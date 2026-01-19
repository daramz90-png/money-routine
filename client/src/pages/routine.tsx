import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Lightbulb, Clock, Calendar, Eye, ChevronRight, 
  User, CheckCircle2, Coffee, Briefcase, Moon, Sun,
  Train, Baby, BookOpen, TrendingUp, TrendingDown,
  Mail, Heart, Award, Target, AlertCircle
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { apiRequest } from '@/lib/queryClient';

const categories = [
  { id: 'monthly', name: '월간 투자 일지', icon: Calendar },
  { id: 'routine', name: '워킹맘 루틴', icon: Clock },
  { id: 'failure', name: '실패담 & 교훈', icon: AlertCircle },
  { id: 'gap', name: '5년 공백 이야기', icon: Heart },
];

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: number;
  views: number;
}

const articles: Article[] = [
  {
    id: '1',
    title: '2026년 1월 투자 기록',
    summary: '새해 첫 달, 공모주 3건 청약하고 분양권 1건 검토했습니다. 수익과 배운 점을 정리합니다.',
    category: 'monthly',
    date: '2026-01-19',
    readTime: 8,
    views: 2340,
  },
  {
    id: '2',
    title: '2025년 결산 - 총 수익 공개',
    summary: '2025년 한 해 동안의 투자 활동과 실제 수익을 공개합니다. 성공과 실패 모두 담았습니다.',
    category: 'monthly',
    date: '2026-01-05',
    readTime: 12,
    views: 5670,
  },
  {
    id: '3',
    title: '워킹맘의 아침 10분 루틴',
    summary: '출근 준비하면서 10분 만에 확인하는 투자 체크리스트. 매일 습관이 되면 큰 차이를 만듭니다.',
    category: 'routine',
    date: '2026-01-15',
    readTime: 5,
    views: 4120,
  },
  {
    id: '4',
    title: '주말 2시간 투자 공부법',
    summary: '아이가 낮잠 자는 동안 집중해서 공부하는 방법. 효율적인 정보 수집 노하우를 공유합니다.',
    category: 'routine',
    date: '2026-01-10',
    readTime: 7,
    views: 3890,
  },
  {
    id: '5',
    title: '육아 틈틈이 하는 공모주 청약',
    summary: '지하철에서, 점심시간에, 잠들기 전에. 틈새 시간을 활용한 공모주 청약 노하우입니다.',
    category: 'routine',
    date: '2026-01-08',
    readTime: 6,
    views: 3450,
  },
  {
    id: '6',
    title: '분양권 투자 실패하고 배운 것',
    summary: '첫 분양권 투자에서 손해 본 이야기. 너무 급하게 결정해서 생긴 문제들을 솔직하게 털어놓습니다.',
    category: 'failure',
    date: '2026-01-12',
    readTime: 9,
    views: 6780,
  },
  {
    id: '7',
    title: '손절 못해서 잃은 돈',
    summary: '미련 때문에 손절 타이밍을 놓쳤습니다. 그때 배운 교훈이 지금의 원칙이 되었습니다.',
    category: 'failure',
    date: '2026-01-03',
    readTime: 8,
    views: 5230,
  },
  {
    id: '8',
    title: '욕심 부리다 놓친 기회',
    summary: '더 오를 거라는 욕심이 가장 큰 적이었습니다. 적당히 만족하는 법을 배운 이야기.',
    category: 'failure',
    date: '2025-12-28',
    readTime: 7,
    views: 4560,
  },
  {
    id: '9',
    title: '5년 쉬고 달라진 시장',
    summary: '육아로 5년 쉬는 동안 시장은 완전히 바뀌어 있었습니다. 복귀 후 느낀 변화들.',
    category: 'gap',
    date: '2026-01-18',
    readTime: 10,
    views: 7890,
  },
  {
    id: '10',
    title: '복귀 후 가장 어려웠던 점',
    summary: '감을 되찾는 데 6개월이 걸렸습니다. 공백기 후 다시 시작하는 분들께 드리는 조언.',
    category: 'gap',
    date: '2026-01-14',
    readTime: 8,
    views: 5670,
  },
  {
    id: '11',
    title: '공백기에도 놓치지 말아야 할 것',
    summary: '투자를 쉬더라도 이것만은 계속 해야 합니다. 저도 이걸 했기에 빨리 복귀할 수 있었습니다.',
    category: 'gap',
    date: '2026-01-06',
    readTime: 6,
    views: 4320,
  },
];

const monthlyRecords = [
  {
    month: '2026년 1월',
    activities: ['공모주 3건 청약 (1건 당첨)', '분양권 후보지 2곳 답사', 'ETF 리밸런싱'],
    profit: '+45만원',
    isProfit: true,
    lesson: '서두르지 않고 기다리니 좋은 기회가 왔습니다.',
  },
  {
    month: '2025년 12월',
    activities: ['공모주 5건 청약 (2건 당첨)', '연말 세금 정리', '2026년 투자 계획 수립'],
    profit: '+82만원',
    isProfit: true,
    lesson: '연말은 정리하고 계획 세우기 좋은 시기입니다.',
  },
  {
    month: '2025년 11월',
    activities: ['공모주 4건 청약', '분양권 1건 매도 계약', '배당주 추가 매수'],
    profit: '+1,200만원',
    isProfit: true,
    lesson: '분양권 매도 타이밍이 좋았습니다. 욕심 부리지 않은 게 정답.',
  },
  {
    month: '2025년 10월',
    activities: ['공모주 3건 청약 (0건 당첨)', '청약 대기', '시장 분석'],
    profit: '-2만원',
    isProfit: false,
    lesson: '당첨이 안 되는 달도 있습니다. 꾸준함이 중요.',
  },
];

const dailySchedule = [
  { time: '06:00', activity: '출근 준비', task: '10분 뉴스 체크', icon: Sun, color: 'from-yellow-400 to-orange-400' },
  { time: '09:00', activity: '출근 (지하철)', task: '공모주 청약 확인', icon: Train, color: 'from-blue-400 to-indigo-400' },
  { time: '12:00', activity: '점심시간', task: '20분 투자 정보 수집', icon: Coffee, color: 'from-amber-400 to-orange-400' },
  { time: '19:00', activity: '퇴근 후', task: '육아 (투자 OFF)', icon: Baby, color: 'from-pink-400 to-rose-400' },
  { time: '22:00', activity: '아이 재운 후', task: '30분 투자 분석', icon: Moon, color: 'from-indigo-400 to-purple-400' },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function EmailForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/subscribe', { email });
      toast({
        title: '구독 완료!',
        description: '쿠쿠의 투자 이야기를 보내드릴게요.',
      });
      setEmail('');
    } catch (error) {
      toast({
        title: '구독 실패',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" data-testid="form-subscribe">
      <Input
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-12"
        data-testid="input-email"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        data-testid="button-subscribe"
      >
        <Mail className="w-4 h-4 mr-2" />
        구독하기
      </Button>
    </form>
  );
}

function ProfileSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-0 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-4">안녕하세요, 쿠쿠입니다</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                30대 중반 대기업 워킹맘이자,<br />
                5년 부동산 투자 경력을 가진 실전 투자자입니다.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                지방에서 서울 갈아타기 성공경험 보유<br />
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">현 순자산 9억</span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">분양권 투자로 1억 이상 수익</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">지방/서울 투자로 5억 이상 수익</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">공모주 청약으로 월 10-50만원</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">육아휴직 복직 후 과장 승진</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                아무것도 모르던 5년 전, 100번 넘게 듣고 배우며 시작했습니다.<br />
                바닥부터 시작해서 9억의 순자산을 만들어가고 있습니다.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function CategoryTabs({ activeCategory, onCategoryChange }: { 
  activeCategory: string | null; 
  onCategoryChange: (category: string | null) => void;
}) {
  return (
    <div className="border-b border-border/50 mb-8">
      <div className="flex flex-wrap gap-0">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeCategory === null 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          data-testid="tab-all"
        >
          전체
          {activeCategory === null && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
          )}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
              activeCategory === cat.id 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid={`tab-${cat.id}`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimelineSection() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">월별 투자 기록</h2>
        </div>

        <div className="space-y-4">
          {monthlyRecords.map((record, index) => (
            <Card key={index} className="p-6 bg-card border-0 shadow-md" data-testid={`timeline-${index}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 text-sm px-3 py-1">
                    {record.month}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {record.activities.map((activity, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-muted-foreground">수익/손실:</span>
                    <span className={`font-bold ${record.isProfit ? 'text-green-600' : 'text-red-500'}`}>
                      {record.isProfit ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                      {record.profit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{record.lesson}"
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyScheduleSection() {
  return (
    <section className="py-8 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">워킹맘의 하루</h2>
        </div>

        <Card className="p-6 bg-card border-0 shadow-lg">
          <div className="space-y-4">
            {dailySchedule.map((item, index) => (
              <div key={index} className="flex items-center gap-4" data-testid={`schedule-${index}`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{item.time}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-foreground">{item.activity}</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground font-medium">
              "하루 1시간도 안 되는 시간으로 충분합니다"
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const category = categories.find(c => c.id === article.category);
  
  return (
    <Link href={`/routine/${article.id}`}>
      <Card className="p-5 hover-elevate cursor-pointer bg-card border-0 shadow-md h-full" data-testid={`article-card-${article.id}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            {category && <category.icon className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 text-xs">
              {category?.name}
            </Badge>
            <h3 className="font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{article.summary}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}분
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ArticlesSection({ activeCategory }: { activeCategory: string | null }) {
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">글 목록</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">해당 카테고리의 글이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SubscribeSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">
          쿠쿠의 솔직한 투자 이야기를 받아보세요
        </h2>
        <p className="text-white/80 mb-8">
          월간 투자 기록, 실패담, 워킹맘 루틴까지<br />
          진짜 이야기만 보내드립니다.
        </p>
        <div className="max-w-md mx-auto">
          <EmailForm />
        </div>
      </div>
    </section>
  );
}

export default function Routine() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            쿠쿠의 투자 루틴
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            30대 워킹맘, 육아와 투자를 함께하는 진짜 이야기
          </p>
        </div>
      </section>

      <ProfileSection />
      
      <div className="max-w-4xl mx-auto px-4">
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      <TimelineSection />
      <DailyScheduleSection />
      <ArticlesSection activeCategory={activeCategory} />
      <SubscribeSection />
    </div>
  );
}
