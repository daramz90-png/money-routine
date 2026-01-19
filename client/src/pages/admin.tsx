import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Save, Plus, Trash2, Check, TrendingUp, Building, 
  Newspaper, ListTodo, Quote, Coins, MessageSquare, Sparkles, Hash, Type, ChartLine, Lock, Users, Mail, RefreshCw, BookOpen, Edit, Loader2
} from 'lucide-react';
import type { DashboardContent, SummaryItem, IPOItem, RealEstateItem, NewsItem, TodoItem, ThoughtItem, ManualMarketData, Subscriber, RoutineArticle } from '@shared/schema';
import { defaultContent, defaultManualMarketData } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function PasswordGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        onAuthenticated();
        toast({
          title: "인증 성공",
          description: "관리자 페이지에 접속했습니다.",
        });
      } else {
        setError(true);
        setPassword('');
        toast({
          title: "인증 실패",
          description: "비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "오류 발생",
        description: "서버에 연결할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">관리자 인증</h1>
          <p className="text-muted-foreground mt-2 text-center">관리자 페이지에 접근하려면 비밀번호를 입력하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="비밀번호 입력"
              className={error ? 'border-red-500' : ''}
              data-testid="input-admin-password"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1">비밀번호가 올바르지 않습니다</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-admin-login">
            {isLoading ? '확인 중...' : '로그인'}
          </Button>
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              홈으로 돌아가기
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

const categoryOptions = [
  { value: 'monthly', label: '월간 투자 일지' },
  { value: 'routine', label: '워킹맘 루틴' },
  { value: 'failure', label: '실패담 & 교훈' },
  { value: 'gap', label: '워킹맘 투자자의 이야기' },
];

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState<DashboardContent>(defaultContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [editingArticle, setEditingArticle] = useState<RoutineArticle | null>(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'monthly' as RoutineArticle['category'],
    date: new Date().toISOString().split('T')[0],
    readTime: 5,
    views: 0,
    featured: false,
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery<RoutineArticle[]>({
    queryKey: ['/api/routine-articles'],
    enabled: isAuthenticated,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (article: Omit<RoutineArticle, 'id'>) => {
      const res = await apiRequest('POST', '/api/routine-articles', article);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routine-articles'] });
      toast({ title: '글 작성 완료' });
      resetArticleForm();
    },
    onError: () => {
      toast({ title: '글 작성 실패', variant: 'destructive' });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, ...article }: RoutineArticle) => {
      const res = await apiRequest('PATCH', `/api/routine-articles/${id}`, article);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routine-articles'] });
      toast({ title: '글 수정 완료' });
      resetArticleForm();
    },
    onError: () => {
      toast({ title: '글 수정 실패', variant: 'destructive' });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/routine-articles/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/routine-articles'] });
      toast({ title: '글 삭제 완료' });
    },
    onError: () => {
      toast({ title: '글 삭제 실패', variant: 'destructive' });
    },
  });

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      summary: '',
      content: '',
      category: 'monthly',
      date: new Date().toISOString().split('T')[0],
      readTime: 5,
      views: 0,
      featured: false,
    });
    setEditingArticle(null);
    setIsArticleFormOpen(false);
  };

  const handleEditArticle = (article: RoutineArticle) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      date: article.date,
      readTime: article.readTime,
      views: article.views,
      featured: article.featured,
    });
    setIsArticleFormOpen(true);
  };

  const handleSubmitArticle = () => {
    if (!articleForm.title || !articleForm.summary || !articleForm.content) {
      toast({ title: '필수 항목을 입력해주세요', variant: 'destructive' });
      return;
    }
    if (editingArticle) {
      updateArticleMutation.mutate({ id: editingArticle.id, ...articleForm });
    } else {
      createArticleMutation.mutate(articleForm);
    }
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const response = await fetch('/api/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers');
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const removeSubscriber = async (id: string) => {
    try {
      const response = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        toast({ title: '구독자 삭제 완료' });
      }
    } catch {
      toast({ title: '삭제 실패', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const savedContent = localStorage.getItem('dashboardContent');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) {
        console.error('Failed to parse saved content');
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('dashboardContent', JSON.stringify(content));
      toast({
        title: "저장 완료",
        description: "콘텐츠가 성공적으로 저장되었습니다.",
      });
    } catch (e) {
      toast({
        title: "저장 실패",
        description: "콘텐츠 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  const addSummary = () => {
    setContent(prev => ({
      ...prev,
      summaries: [...prev.summaries, { id: generateId(), text: '' }]
    }));
  };

  const updateSummary = (id: string, text: string) => {
    setContent(prev => ({
      ...prev,
      summaries: prev.summaries.map(s => s.id === id ? { ...s, text } : s)
    }));
  };

  const removeSummary = (id: string) => {
    setContent(prev => ({
      ...prev,
      summaries: prev.summaries.filter(s => s.id !== id)
    }));
  };

  const addIPO = () => {
    setContent(prev => ({
      ...prev,
      ipos: [...prev.ipos, {
        id: generateId(),
        name: '',
        score: 0,
        period: '',
        price: '',
        minAmount: '',
        broker: '',
        description: '',
        isHighlight: false,
      }]
    }));
  };

  const updateIPO = (id: string, field: keyof IPOItem, value: any) => {
    setContent(prev => ({
      ...prev,
      ipos: prev.ipos.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const removeIPO = (id: string) => {
    setContent(prev => ({
      ...prev,
      ipos: prev.ipos.filter(i => i.id !== id)
    }));
  };

  const addRealEstate = () => {
    setContent(prev => ({
      ...prev,
      realEstates: [...prev.realEstates, {
        id: generateId(),
        name: '',
        location: '',
        units: 0,
        period: '',
        priority: '',
        type: 'apartment',
      }]
    }));
  };

  const updateRealEstate = (id: string, field: keyof RealEstateItem, value: any) => {
    setContent(prev => ({
      ...prev,
      realEstates: prev.realEstates.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeRealEstate = (id: string) => {
    setContent(prev => ({
      ...prev,
      realEstates: prev.realEstates.filter(r => r.id !== id)
    }));
  };

  const addNews = () => {
    setContent(prev => ({
      ...prev,
      news: [...prev.news, { id: generateId(), title: '', summary: '', url: '' }]
    }));
  };

  const updateNews = (id: string, field: keyof NewsItem, value: string) => {
    setContent(prev => ({
      ...prev,
      news: prev.news.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const removeNews = (id: string) => {
    setContent(prev => ({
      ...prev,
      news: prev.news.filter(n => n.id !== id)
    }));
  };

  const addTodo = () => {
    setContent(prev => ({
      ...prev,
      todos: [...prev.todos, { id: generateId(), title: '', description: '' }]
    }));
  };

  const updateTodo = (id: string, field: keyof TodoItem, value: string) => {
    setContent(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const removeTodo = (id: string) => {
    setContent(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
  };

  const addThought = () => {
    setContent(prev => ({
      ...prev,
      thoughts: [...(prev.thoughts || []), { id: generateId(), title: '', content: '' }]
    }));
  };

  const updateThought = (id: string, field: keyof ThoughtItem, value: string) => {
    setContent(prev => ({
      ...prev,
      thoughts: (prev.thoughts || []).map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const removeThought = (id: string) => {
    setContent(prev => ({
      ...prev,
      thoughts: (prev.thoughts || []).filter(t => t.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between h-16 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <Coins className="w-6 h-6" />
                <span className="text-lg font-bold">관리자 페이지</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-foreground">히어로 섹션</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label>메인 타이틀</Label>
              <Input
                value={content.heroTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="하루 5분으로 시작하는 재테크"
                data-testid="input-hero-title"
              />
            </div>
            <div>
              <Label>서브 타이틀</Label>
              <Input
                value={content.heroSubtitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="공모주 청약부터 부동산 뉴스, 놓치기 쉬운 정책 정보까지!"
                data-testid="input-hero-subtitle"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Check className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-foreground">오늘의 주요 요약</h2>
          </div>
          <div className="space-y-3">
            {content.summaries.map((summary, index) => (
              <div key={summary.id} className="flex flex-wrap gap-2">
                <Input
                  value={summary.text}
                  onChange={(e) => updateSummary(summary.id, e.target.value)}
                  placeholder={`요약 ${index + 1}`}
                  className="flex-1 min-w-0"
                  data-testid={`input-summary-${index}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSummary(summary.id)}
                  data-testid={`button-remove-summary-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSummary} className="w-full" data-testid="button-add-summary">
              <Plus className="w-4 h-4 mr-2" />
              요약 추가
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-foreground">공모주 청약</h2>
          </div>
          <div className="space-y-4">
            {content.ipos.map((ipo, index) => (
              <Card key={ipo.id} className="p-4 bg-muted/30" data-testid={`ipo-form-${index}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <span className="font-semibold text-foreground">공모주 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeIPO(ipo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>종목명</Label>
                    <Input value={ipo.name} onChange={(e) => updateIPO(ipo.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <Label>접수 점수</Label>
                    <Input type="number" value={ipo.score} onChange={(e) => updateIPO(ipo.id, 'score', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <Label>청약기간</Label>
                    <Input value={ipo.period} onChange={(e) => updateIPO(ipo.id, 'period', e.target.value)} />
                  </div>
                  <div>
                    <Label>공모가</Label>
                    <Input value={ipo.price} onChange={(e) => updateIPO(ipo.id, 'price', e.target.value)} />
                  </div>
                  <div>
                    <Label>최소금액</Label>
                    <Input value={ipo.minAmount} onChange={(e) => updateIPO(ipo.id, 'minAmount', e.target.value)} />
                  </div>
                  <div>
                    <Label>증권사</Label>
                    <Input value={ipo.broker} onChange={(e) => updateIPO(ipo.id, 'broker', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>설명</Label>
                    <Input value={ipo.description} onChange={(e) => updateIPO(ipo.id, 'description', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ipo.isHighlight}
                      onChange={(e) => updateIPO(ipo.id, 'isHighlight', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label className="mb-0">중요 공모주 (강조 표시)</Label>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addIPO} className="w-full" data-testid="button-add-ipo">
              <Plus className="w-4 h-4 mr-2" />
              공모주 추가
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Building className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-foreground">부동산 청약</h2>
          </div>
          <div className="space-y-4">
            {content.realEstates.map((item, index) => (
              <Card key={item.id} className="p-4 bg-muted/30" data-testid={`realestate-form-${index}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <span className="font-semibold text-foreground">부동산 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeRealEstate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>이름</Label>
                    <Input value={item.name} onChange={(e) => updateRealEstate(item.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <Label>위치</Label>
                    <Input value={item.location} onChange={(e) => updateRealEstate(item.id, 'location', e.target.value)} />
                  </div>
                  <div>
                    <Label>세대수</Label>
                    <Input type="number" value={item.units} onChange={(e) => updateRealEstate(item.id, 'units', parseInt(e.target.value) || 0)} />
                  </div>
                  <div>
                    <Label>기간</Label>
                    <Input value={item.period} onChange={(e) => updateRealEstate(item.id, 'period', e.target.value)} />
                  </div>
                  <div>
                    <Label>순위</Label>
                    <Input value={item.priority} onChange={(e) => updateRealEstate(item.id, 'priority', e.target.value)} />
                  </div>
                  <div>
                    <Label>유형</Label>
                    <select
                      value={item.type}
                      onChange={(e) => updateRealEstate(item.id, 'type', e.target.value as 'apartment' | 'urban')}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="apartment">아파트</option>
                      <option value="urban">도시형 생활주택</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addRealEstate} className="w-full" data-testid="button-add-realestate">
              <Plus className="w-4 h-4 mr-2" />
              부동산 추가
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Newspaper className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-foreground">오늘의 뉴스픽</h2>
          </div>
          <div className="space-y-4">
            {content.news.map((news, index) => (
              <Card key={news.id} className="p-4 bg-muted/30" data-testid={`news-form-${index}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <span className="font-semibold text-foreground">뉴스 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeNews(news.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>제목</Label>
                    <Input value={news.title} onChange={(e) => updateNews(news.id, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>요약</Label>
                    <Textarea value={news.summary} onChange={(e) => updateNews(news.id, 'summary', e.target.value)} />
                  </div>
                  <div>
                    <Label>URL (선택)</Label>
                    <Input value={news.url || ''} onChange={(e) => updateNews(news.id, 'url', e.target.value)} placeholder="https://" />
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addNews} className="w-full" data-testid="button-add-news">
              <Plus className="w-4 h-4 mr-2" />
              뉴스 추가
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ListTodo className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold text-foreground">오늘 해야하는 것</h2>
          </div>
          <div className="space-y-4">
            {content.todos.map((todo, index) => (
              <Card key={todo.id} className="p-4 bg-muted/30" data-testid={`todo-form-${index}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <span className="font-semibold text-foreground">할일 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeTodo(todo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>제목</Label>
                    <Input value={todo.title} onChange={(e) => updateTodo(todo.id, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Textarea value={todo.description} onChange={(e) => updateTodo(todo.id, 'description', e.target.value)} />
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addTodo} className="w-full" data-testid="button-add-todo">
              <Plus className="w-4 h-4 mr-2" />
              할일 추가
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ChartLine className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-bold text-foreground">주요 항목 시세 CHECK</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label>섹션 타이틀</Label>
              <Input
                value={content.marketSectionTitle || ''}
                onChange={(e) => setContent(prev => ({ ...prev, marketSectionTitle: e.target.value }))}
                placeholder="주요 항목 시세 CHECK"
                data-testid="input-market-title"
              />
            </div>
            <div>
              <Label>새로고침 안내 문구</Label>
              <Input
                value={content.marketRefreshNote || ''}
                onChange={(e) => setContent(prev => ({ ...prev, marketRefreshNote: e.target.value }))}
                placeholder="* 데이터는 5분마다 자동 갱신됩니다"
                data-testid="input-market-refresh-note"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              * 시세 데이터는 실시간 API에서 자동으로 가져옵니다. 아래에서 수동으로 값을 입력할 수 있습니다.
            </p>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg border-2 border-orange-200 dark:border-orange-900">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Coins className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-foreground">시세 수동 입력</h2>
            <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">API 오류시 사용</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            API에서 데이터를 가져오지 못할 경우, 체크박스를 활성화하고 값을 직접 입력하세요.
          </p>
          <div className="space-y-4">
            {[
              { key: 'usdkrw', label: '달러 환율', unit: '원' },
              { key: 'gold', label: '금 시세', unit: '원/g' },
              { key: 'spy', label: 'S&P 500 (SPY)', unit: 'USD' },
              { key: 'bitcoin', label: '비트코인', unit: '원' },
              { key: 'nasdaq', label: '나스닥', unit: '' },
              { key: 'kodex200', label: 'KODEX 200', unit: '원' },
              { key: 'scfi', label: 'SCFI 운임지수', unit: '' },
            ].map((item) => {
              const manualData = content.manualMarketData || defaultManualMarketData;
              const itemData = manualData[item.key as keyof ManualMarketData] as { enabled: boolean; value: string; change: number };
              return (
                <Card key={item.key} className={`p-3 ${itemData.enabled ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' : 'bg-muted/30'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="checkbox"
                      checked={itemData.enabled}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        manualMarketData: {
                          ...defaultManualMarketData,
                          ...prev.manualMarketData,
                          [item.key]: { ...itemData, enabled: e.target.checked }
                        }
                      }))}
                      className="w-4 h-4"
                      data-testid={`checkbox-manual-${item.key}`}
                    />
                    <span className="font-medium min-w-24">{item.label}</span>
                    <Input
                      value={itemData.value}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        manualMarketData: {
                          ...defaultManualMarketData,
                          ...prev.manualMarketData,
                          [item.key]: { ...itemData, value: e.target.value }
                        }
                      }))}
                      placeholder={`값 입력 (${item.unit})`}
                      className="flex-1 min-w-0"
                      disabled={!itemData.enabled}
                      data-testid={`input-manual-${item.key}-value`}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={itemData.change}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        manualMarketData: {
                          ...defaultManualMarketData,
                          ...prev.manualMarketData,
                          [item.key]: { ...itemData, change: parseFloat(e.target.value) || 0 }
                        }
                      }))}
                      placeholder="변동률 %"
                      className="w-24"
                      disabled={!itemData.enabled}
                      data-testid={`input-manual-${item.key}-change`}
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </Card>
              );
            })}
            
            <Card className={`p-3 ${(content.manualMarketData?.fearGreed?.enabled) ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' : 'bg-muted/30'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="checkbox"
                  checked={content.manualMarketData?.fearGreed?.enabled || false}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    manualMarketData: {
                      ...defaultManualMarketData,
                      ...prev.manualMarketData,
                      fearGreed: { 
                        ...(prev.manualMarketData?.fearGreed || defaultManualMarketData.fearGreed), 
                        enabled: e.target.checked 
                      }
                    }
                  }))}
                  className="w-4 h-4"
                  data-testid="checkbox-manual-fearGreed"
                />
                <span className="font-medium min-w-24">CNN 공포지수</span>
                <Input
                  value={content.manualMarketData?.fearGreed?.value || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    manualMarketData: {
                      ...defaultManualMarketData,
                      ...prev.manualMarketData,
                      fearGreed: { 
                        ...(prev.manualMarketData?.fearGreed || defaultManualMarketData.fearGreed), 
                        value: e.target.value 
                      }
                    }
                  }))}
                  placeholder="지수 (0-100)"
                  className="w-24"
                  disabled={!content.manualMarketData?.fearGreed?.enabled}
                  data-testid="input-manual-fearGreed-value"
                />
                <select
                  value={content.manualMarketData?.fearGreed?.status || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    manualMarketData: {
                      ...defaultManualMarketData,
                      ...prev.manualMarketData,
                      fearGreed: { 
                        ...(prev.manualMarketData?.fearGreed || defaultManualMarketData.fearGreed), 
                        status: e.target.value 
                      }
                    }
                  }))}
                  className="h-9 px-3 rounded-md border border-input bg-background"
                  disabled={!content.manualMarketData?.fearGreed?.enabled}
                  data-testid="select-manual-fearGreed-status"
                >
                  <option value="">상태 선택</option>
                  <option value="극단적 공포">극단적 공포</option>
                  <option value="공포">공포</option>
                  <option value="중립">중립</option>
                  <option value="탐욕">탐욕</option>
                  <option value="극단적 탐욕">극단적 탐욕</option>
                </select>
              </div>
            </Card>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-foreground">오늘 쿠쿠의 생각</h2>
          </div>
          <div className="space-y-4">
            {(content.thoughts || []).map((thought, index) => (
              <Card key={thought.id} className="p-4 bg-muted/30" data-testid={`thought-form-${index}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <span className="font-semibold text-foreground">생각 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeThought(thought.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>제목 (예: 10월의 마지막날)</Label>
                    <Input value={thought.title} onChange={(e) => updateThought(thought.id, 'title', e.target.value)} />
                  </div>
                  <div>
                    <Label>내용 (빈 줄로 단락 구분)</Label>
                    <Textarea 
                      value={thought.content} 
                      onChange={(e) => updateThought(thought.id, 'content', e.target.value)} 
                      className="min-h-32"
                      placeholder="이번 달은 시장이 유난히 뜨거웠네요...&#10;&#10;두 번째 단락은 빈 줄로 구분하세요."
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addThought} className="w-full" data-testid="button-add-thought">
              <Plus className="w-4 h-4 mr-2" />
              생각 추가
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Label>마무리 문구</Label>
            <Input
              value={content.closingMessage || ''}
              onChange={(e) => setContent(prev => ({ ...prev, closingMessage: e.target.value }))}
              placeholder="오늘도 흔들림 없이, 루틴대로 갑시다"
              data-testid="input-closing-message"
            />
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Quote className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-foreground">오늘의 한 줄</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label>명언</Label>
              <Textarea
                value={content.quote.text}
                onChange={(e) => setContent(prev => ({ ...prev, quote: { ...prev.quote, text: e.target.value } }))}
                placeholder="명언을 입력하세요"
                data-testid="input-quote-text"
              />
            </div>
            <div>
              <Label>저자</Label>
              <Input
                value={content.quote.author}
                onChange={(e) => setContent(prev => ({ ...prev, quote: { ...prev.quote, author: e.target.value } }))}
                placeholder="저자 이름"
                data-testid="input-quote-author"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Type className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-foreground">마무리 섹션</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label>마무리 서브 메시지</Label>
              <Input
                value={content.closingSubMessage || ''}
                onChange={(e) => setContent(prev => ({ ...prev, closingSubMessage: e.target.value }))}
                placeholder="오늘도 화이팅입니다 ^^"
                data-testid="input-closing-sub-message"
              />
            </div>
            <div>
              <Label>구독 버튼 텍스트</Label>
              <Input
                value={content.subscribeButtonText || ''}
                onChange={(e) => setContent(prev => ({ ...prev, subscribeButtonText: e.target.value }))}
                placeholder="이웃추가하고 돈되는 루틴 받기"
                data-testid="input-subscribe-button-text"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Hash className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-foreground">푸터 설정</h2>
          </div>
          <div className="space-y-3">
            <div>
              <Label>푸터 설명 문구</Label>
              <Input
                value={content.footerText || ''}
                onChange={(e) => setContent(prev => ({ ...prev, footerText: e.target.value }))}
                placeholder="하루 5분으로 시작하는 재테크 루틴"
                data-testid="input-footer-text"
              />
            </div>
            <div>
              <Label>해시태그 (쉼표로 구분)</Label>
              <Input
                value={(content.hashtags || []).join(', ')}
                onChange={(e) => setContent(prev => ({ 
                  ...prev, 
                  hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                }))}
                placeholder="재테크루틴, 경제뉴스요약, 공모주청약, ..."
                data-testid="input-hashtags"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-foreground">쿠쿠의 루틴 글 관리</h2>
              <span className="text-sm text-muted-foreground">({articles.length}개)</span>
            </div>
            <Button 
              onClick={() => setIsArticleFormOpen(true)}
              data-testid="button-new-article"
            >
              <Plus className="w-4 h-4 mr-1" />
              새 글 작성
            </Button>
          </div>

          {isArticleFormOpen && (
            <Card className="p-4 mb-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold mb-3 text-foreground">
                {editingArticle ? '글 수정' : '새 글 작성'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label>제목 *</Label>
                  <Input
                    value={articleForm.title}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="글 제목"
                    data-testid="input-article-title"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>요약 *</Label>
                  <Textarea
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="글 요약 (목록에 표시됨)"
                    data-testid="input-article-summary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>본문 *</Label>
                  <Textarea
                    value={articleForm.content}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="글 본문 내용"
                    className="min-h-32"
                    data-testid="input-article-content"
                  />
                </div>
                <div>
                  <Label>카테고리</Label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value as RoutineArticle['category'] }))}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background"
                    data-testid="select-article-category"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>날짜</Label>
                  <Input
                    type="date"
                    value={articleForm.date}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, date: e.target.value }))}
                    data-testid="input-article-date"
                  />
                </div>
                <div>
                  <Label>읽는 시간 (분)</Label>
                  <Input
                    type="number"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                    data-testid="input-article-readtime"
                  />
                </div>
                <div>
                  <Label>조회수</Label>
                  <Input
                    type="number"
                    value={articleForm.views}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                    data-testid="input-article-views"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4"
                    data-testid="checkbox-article-featured"
                  />
                  <Label className="mb-0">추천 글로 표시</Label>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  onClick={handleSubmitArticle}
                  disabled={createArticleMutation.isPending || updateArticleMutation.isPending}
                  data-testid="button-save-article"
                >
                  {(createArticleMutation.isPending || updateArticleMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  {editingArticle ? '수정' : '저장'}
                </Button>
                <Button variant="outline" onClick={resetArticleForm} data-testid="button-cancel-article">
                  취소
                </Button>
              </div>
            </Card>
          )}

          {isLoadingArticles ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
              로딩 중...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 작성된 글이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                  data-testid={`article-row-${article.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                        {categoryOptions.find(c => c.value === article.category)?.label}
                      </span>
                      {article.featured && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded">
                          추천
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-foreground truncate">{article.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{article.summary}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditArticle(article)}
                      data-testid={`button-edit-article-${article.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteArticleMutation.mutate(article.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      data-testid={`button-delete-article-${article.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-foreground">구독자 관리</h2>
              <span className="text-sm text-muted-foreground">({subscribers.length}명)</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSubscribers}
              disabled={isLoadingSubscribers}
              data-testid="button-refresh-subscribers"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingSubscribers ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
          {isLoadingSubscribers ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>아직 구독자가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {subscribers.map((subscriber) => (
                <div 
                  key={subscriber.id} 
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                  data-testid={`subscriber-row-${subscriber.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{subscriber.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{subscriber.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('ko-KR')}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSubscriber(subscriber.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      data-testid={`button-delete-subscriber-${subscriber.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-2xl p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg h-12 text-lg"
            data-testid="button-save"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
