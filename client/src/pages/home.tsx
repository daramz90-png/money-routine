import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, ChevronRight, Clock, Calendar, Eye, Star,
  Building, TrendingUp, Lightbulb, Wrench, Coffee,
  CheckCircle2, User, Briefcase, Target, Award,
  ArrowRight, Banknote, Home as HomeIcon, Calculator,
  BookOpen, PenLine
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { apiRequest } from '@/lib/queryClient';

const featuredArticles = [
  {
    id: '1',
    title: '분양권 투자로 1억 수익 낸 방법',
    summary: '첫 분양권 투자부터 수익 실현까지, 20년 투자 경험에서 얻은 핵심 노하우를 공개합니다. 초보자도 따라할 수 있는 실전 가이드입니다.',
    category: 'real-estate',
    categoryName: '부동산',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    date: '2026-01-19',
    readTime: 8,
  },
  {
    id: '2',
    title: '공모주 청약, 월 50만원 루틴 공개',
    summary: '매달 꾸준히 10-50만원 수익을 내는 공모주 청약 전략. 증권사 선택부터 배정 확률 높이는 팁까지 모두 알려드립니다.',
    category: 'invest',
    categoryName: '투자',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    date: '2026-01-18',
    readTime: 6,
  },
  {
    id: '3',
    title: '워킹맘의 하루 30분 투자 루틴',
    summary: '바쁜 일상 속에서도 놓치지 않는 투자 습관. 출근 전 10분, 점심시간 10분, 퇴근 후 10분으로 충분합니다.',
    category: 'routine',
    categoryName: '쿠쿠의 루틴',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop',
    date: '2026-01-17',
    readTime: 5,
  },
];

const realEstateArticles = [
  { id: 're1', title: '2026년 분양 일정 총정리', readTime: 7, views: 3240 },
  { id: 're2', title: '청약 가점 높이는 실전 방법', readTime: 6, views: 2890 },
  { id: 're3', title: '서울 vs 지방, 어디에 투자할까?', readTime: 8, views: 2450 },
];

const investArticles = [
  { id: 'in1', title: '공모주 증권사 계좌 전략', readTime: 5, views: 4120 },
  { id: 'in2', title: 'ETF로 월배당 만들기', readTime: 6, views: 3560 },
  { id: 'in3', title: '배당주 포트폴리오 공개', readTime: 7, views: 2980 },
];

const routineArticles = [
  { id: 'rt1', title: '매일 5분 투자 체크리스트', readTime: 4, views: 5230 },
  { id: 'rt2', title: '월급날 자동 투자 세팅하기', readTime: 5, views: 4120 },
  { id: 'rt3', title: '투자 일지 작성법 공개', readTime: 6, views: 3450 },
];

const weeklyJournal = [
  { id: 'j1', date: '01.19', title: '관심 청약 3개 체크 완료', type: '부동산' },
  { id: 'j2', date: '01.18', title: '공모주 OO기업 청약 - 500주 배정', type: '공모주' },
  { id: 'j3', date: '01.17', title: '배당주 추가 매수 10주', type: '주식' },
];

const timeline = [
  { year: '2004', event: '부동산 투자 시작', icon: Building },
  { year: '2015', event: '분양권 투자로 첫 큰 수익', icon: Award },
  { year: '2018-2023', event: '육아를 위한 5년 휴식', icon: User },
  { year: '2023', event: '복귀 후 서울 투자 2억 수익', icon: TrendingUp },
  { year: '2024-현재', event: '공모주 월 10-50만원 꾸준히', icon: Target },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function EmailForm({ variant = 'hero' }: { variant?: 'hero' | 'footer' }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/subscribe', { name: '', email });
      toast({
        title: '구독 완료!',
        description: '매일 오전 10시에 투자 이야기를 보내드릴게요.',
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

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" data-testid="form-hero-subscribe">
        <Input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white"
          data-testid="input-hero-email"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-12 px-6 bg-white text-purple-700 hover:bg-white/90 font-semibold"
          data-testid="button-hero-subscribe"
        >
          <Mail className="w-4 h-4 mr-2" />
          매일 10시에 받기
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" data-testid="form-footer-subscribe">
      <Input
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 h-12"
        data-testid="input-footer-email"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        data-testid="button-footer-subscribe"
      >
        무료 구독하기
      </Button>
    </form>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 text-white py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-hero-title">
          20년 실전 경험으로 증명된<br className="hidden sm:block" /> 투자 루틴
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8">
          30대 워킹맘이 5억 만든 진짜 부동산 이야기
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            분양권 투자 1억+ 수익 실현
          </Badge>
          <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
            <Banknote className="w-4 h-4 mr-2" />
            공모주로 월 10-50만원 꾸준히
          </Badge>
          <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
            <Award className="w-4 h-4 mr-2" />
            5년 공백 후에도 성공적 복귀
          </Badge>
        </div>

        <div className="mb-6">
          <EmailForm variant="hero" />
        </div>
        
        <p className="text-white/80 flex items-center justify-center gap-2">
          <Coffee className="w-4 h-4" />
          매일 오전 10시, 5분이면 읽는 실전 투자 이야기
        </p>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-0 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-4">쿠쿠는 누구인가요?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">30대 중반 대기업 워킹맘</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">20년 부동산 투자 경력</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">분양권 1억+, 서울/지방 2억+</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">공모주 월 10-50만원 수익</span>
                </div>
              </div>
              <Link href="/about">
                <Button variant="outline" className="group">
                  더 알아보기
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function DailyRoutineSection() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg text-white">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-white/80 text-sm mb-1">오늘의 5분 루틴</p>
              <p className="text-xl font-bold">관심 지역 실거래가 3곳 확인하기</p>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">약 5분 소요</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'real-estate': return 'from-purple-500 to-indigo-600';
      case 'invest': return 'from-emerald-500 to-teal-600';
      case 'routine': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Star className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">최신 실전 이야기</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Link key={article.id} href={`/${article.category}/${article.id}`}>
              <Card className="overflow-hidden hover-elevate cursor-pointer h-full bg-card border-0 shadow-lg" data-testid={`featured-${article.id}`}>
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={article.thumbnail} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className={`absolute top-3 left-3 bg-gradient-to-r ${getCategoryColor(article.category)} text-white border-0`}>
                    {article.categoryName}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{article.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}분
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ 
  title, 
  icon: Icon, 
  articles, 
  color, 
  href 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  articles: typeof realEstateArticles;
  color: string;
  href: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
        </div>
        <Link href={href}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link key={article.id} href={`${href}/${article.id}`}>
            <Card className="p-4 hover-elevate cursor-pointer bg-card border-0 shadow-sm" data-testid={`category-${article.id}`}>
              <h4 className="font-medium text-foreground mb-2 line-clamp-1">{article.title}</h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}분
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views.toLocaleString()}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PopularByCategory() {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">카테고리별 인기 글</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategorySection 
            title="부동산 실전 투자" 
            icon={Building} 
            articles={realEstateArticles}
            color="from-purple-500 to-indigo-600"
            href="/real-estate"
          />
          <CategorySection 
            title="주식/공모주 투자" 
            icon={TrendingUp} 
            articles={investArticles}
            color="from-emerald-500 to-teal-600"
            href="/invest"
          />
          <CategorySection 
            title="쿠쿠의 투자 루틴" 
            icon={Lightbulb} 
            articles={routineArticles}
            color="from-amber-500 to-orange-500"
            href="/routine"
          />
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">20년의 기록</h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-indigo-600 hidden md:block" />
          
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div 
                key={item.year}
                className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <Card className="inline-block p-4 bg-card border-0 shadow-md">
                    <p className="text-purple-600 font-bold text-lg mb-1">{item.year}</p>
                    <p className="text-foreground">{item.event}</p>
                  </Card>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0 z-10">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const tools = [
    { name: '분양권 수익 계산기', icon: HomeIcon },
    { name: '대출 이자 계산기', icon: Banknote },
    { name: '양도세 계산기', icon: Calculator },
    { name: '공모주 수익률 계산기', icon: TrendingUp },
  ];

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Wrench className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">투자 계산기</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.name} href="/tools">
              <Card className="p-5 text-center hover-elevate cursor-pointer bg-card border-0 shadow-md h-full" data-testid={`tool-${tool.name}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                  <tool.icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-foreground">{tool.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeeklyJournalSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
              <PenLine className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">쿠쿠의 이번 주</h2>
          </div>
          <Link href="/routine">
            <Button variant="ghost" className="text-muted-foreground">
              전체 보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {weeklyJournal.map((entry) => (
            <Card key={entry.id} className="p-4 bg-card border-0 shadow-sm" data-testid={`journal-${entry.id}`}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">1월</p>
                  <p className="text-lg font-bold text-purple-600">{entry.date.split('.')[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{entry.title}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{entry.type}</Badge>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          워킹맘의 진짜 투자 이야기를 받아보세요
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 justify-center text-white/90">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">매일 오전 10시</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-white/90">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">20년 실전 노하우</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-white/90">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">분양권/공모주 전략</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-white/90">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">시간 관리법</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <EmailForm variant="footer" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      <HeroSection />
      <TrustSection />
      <DailyRoutineSection />
      <FeaturedSection />
      <PopularByCategory />
      <TimelineSection />
      <ToolsSection />
      <WeeklyJournalSection />
      <FooterCTA />
    </div>
  );
}
