import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Clock, Calendar, Star, Eye, ChevronRight, 
  BarChart3, PieChart, Wallet, Lightbulb, Bell, PinIcon, Briefcase
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  thumbnail: string;
  date: string;
  readTime: number;
  views: number;
  isPopular?: boolean;
  isPinned?: boolean;
}

const categories = [
  { id: 'stock', name: '주식 투자', icon: BarChart3 },
  { id: 'reit-etf', name: '리츠/ETF', icon: PieChart },
  { id: 'dividend', name: '배당주', icon: Wallet },
  { id: 'portfolio', name: '포트폴리오', icon: Briefcase },
];

const articles: Article[] = [
  {
    id: '1',
    title: '초보자를 위한 주식 시작하기',
    summary: '주식 투자를 처음 시작하는 분들을 위한 완벽 가이드. 증권사 계좌 개설부터 첫 주식 매수까지 단계별로 알려드립니다.',
    category: 'stock',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    date: '2026-01-19',
    readTime: 7,
    views: 4520,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '2',
    title: '손절/익절 타이밍 잡는 법',
    summary: '감정에 휘둘리지 않는 매도 전략. 손실을 최소화하고 수익을 극대화하는 실전 노하우를 공유합니다.',
    category: 'stock',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 6,
    views: 3890,
    isPopular: true,
  },
  {
    id: '3',
    title: '차트 분석 기초 완벽 정리',
    summary: '이동평균선, 거래량, 캔들 패턴 등 기술적 분석의 기본기를 탄탄하게 다져봅니다.',
    category: 'stock',
    thumbnail: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 8,
    views: 2340,
  },
  {
    id: '4',
    title: '부동산 리츠 추천 TOP 5',
    summary: '소액으로 부동산에 투자하는 방법, 리츠! 안정적인 배당수익을 주는 추천 리츠를 소개합니다.',
    category: 'reit-etf',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    date: '2026-01-18',
    readTime: 5,
    views: 3120,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '5',
    title: 'ETF로 월 배당 받는 법',
    summary: '미국 월배당 ETF 조합으로 매달 현금흐름 만들기. 실제 포트폴리오 예시와 함께 설명합니다.',
    category: 'reit-etf',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    date: '2026-01-15',
    readTime: 6,
    views: 4780,
    isPopular: true,
  },
  {
    id: '6',
    title: 'S&P 500 ETF 완벽 비교',
    summary: 'SPY, VOO, IVV 등 S&P 500 추종 ETF의 수수료, 거래량, 배당률을 한눈에 비교해봅니다.',
    category: 'reit-etf',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 5,
    views: 2890,
  },
  {
    id: '7',
    title: '배당주로 월 30만원 만들기',
    summary: '배당투자로 월급 외 수입 만들기. 필요한 투자금액과 추천 종목을 상세히 분석합니다.',
    category: 'dividend',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-16',
    readTime: 7,
    views: 5670,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '8',
    title: '고배당주 선정 기준',
    summary: '배당률만 보면 안 됩니다! 지속 가능한 고배당주를 찾는 5가지 핵심 지표를 알려드립니다.',
    category: 'dividend',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    date: '2026-01-13',
    readTime: 6,
    views: 3450,
  },
  {
    id: '9',
    title: '배당 재투자의 복리 효과',
    summary: 'DRIP(배당 재투자)를 활용한 장기 자산 증식 전략. 20년 후 자산이 얼마나 될까요?',
    category: 'dividend',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 5,
    views: 2180,
  },
  {
    id: '10',
    title: '쿠쿠의 1월 포트폴리오 공개',
    summary: '2026년 1월 현재 쿠쿠의 실제 투자 포트폴리오를 공개합니다. 종목별 비중과 투자 이유를 설명합니다.',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 8,
    views: 6890,
    isPopular: true,
  },
  {
    id: '11',
    title: '자산 배분 전략 완벽 가이드',
    summary: '주식, 채권, 현금 비중 어떻게 정해야 할까? 연령별, 목표별 자산 배분 전략을 알려드립니다.',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 7,
    views: 3120,
  },
  {
    id: '12',
    title: '리밸런싱 언제, 어떻게 해야 할까?',
    summary: '포트폴리오 리밸런싱의 타이밍과 방법. 수익률을 높이는 리밸런싱 전략을 공유합니다.',
    category: 'portfolio',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    date: '2026-01-11',
    readTime: 6,
    views: 2560,
  },
];

const pinnedArticles = articles.filter(a => a.isPinned);
const popularArticles = articles.filter(a => a.isPopular).slice(0, 5);

const tips = [
  '투자는 분산이 핵심입니다. 한 종목에 올인하지 마세요.',
  '장기 투자의 가장 큰 적은 조급함입니다. 시간을 우리 편으로!',
  'ETF는 개별 종목 리스크를 줄이면서 시장 수익률을 추종할 수 있는 좋은 도구입니다.',
  '배당주 투자는 배당락일 전에 매수해야 배당을 받을 수 있습니다.',
  '포트폴리오는 최소 6개월에 한 번은 리밸런싱해주세요.',
  '투자 일지를 작성하면 실수를 줄이고 투자 실력이 늘어납니다.',
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatViews(views: number) {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`;
  }
  return views.toString();
}

function ArticleCard({ article }: { article: Article }) {
  const category = categories.find(c => c.id === article.category);
  
  return (
    <Link href={`/invest/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg h-full" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
              {category.name}
            </Badge>
          )}
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
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatViews(article.views)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
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
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  return (
    <div className="space-y-6">
      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <PinIcon className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-foreground">필독 글</h3>
        </div>
        <div className="space-y-3">
          {pinnedArticles.map((article) => (
            <Link key={article.id} href={`/invest/${article.id}`}>
              <div className="p-3 rounded-lg hover-elevate cursor-pointer bg-muted/30" data-testid={`pinned-article-${article.id}`}>
                <p className="text-sm text-foreground line-clamp-2 font-medium">{article.title}</p>
                <span className="text-xs text-muted-foreground mt-1 block">{formatDate(article.date)}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-foreground">인기 글 TOP 5</h3>
        </div>
        <div className="space-y-3">
          {popularArticles.map((article, index) => (
            <Link key={article.id} href={`/invest/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-foreground">오늘의 투자 팁</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-emerald-600 to-teal-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5" />
          <h3 className="font-bold">뉴스레터 구독</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">
          매주 투자 인사이트와 시장 분석을 받아보세요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-white text-emerald-700" data-testid="button-subscribe-sidebar">
            무료 구독하기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function Invest() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            투자
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            소액으로 시작하는 현명한 투자
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <CategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">해당 카테고리의 글이 없습니다.</p>
              </div>
            )}
          </div>
          
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              <Sidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
