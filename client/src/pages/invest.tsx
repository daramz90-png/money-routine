import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Clock, Calendar, Star, ChevronRight, 
  BookOpen, BarChart3, PieChart, FileText, Bell, Coins
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
  isPopular?: boolean;
}

const categories = [
  { id: 'stock-basics', name: '주식 기초', icon: BarChart3 },
  { id: 'etf', name: 'ETF 투자', icon: PieChart },
  { id: 'fund', name: '펀드 이해하기', icon: Coins },
  { id: 'glossary', name: '투자 용어 사전', icon: FileText },
];

const articles: Article[] = [
  {
    id: '1',
    title: '주식 투자, 어디서부터 시작해야 할까?',
    summary: '주식 투자를 처음 시작하는 분들을 위한 완벽 가이드. 증권사 계좌 개설부터 첫 주식 매수까지 단계별로 알려드립니다.',
    category: 'stock-basics',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    date: '2026-01-15',
    readTime: 5,
    isPopular: true,
  },
  {
    id: '2',
    title: 'ETF란 무엇인가? 초보자를 위한 ETF 완벽 정리',
    summary: 'ETF(상장지수펀드)의 개념부터 장단점, 투자 방법까지. 분산투자의 첫걸음을 ETF로 시작해보세요.',
    category: 'etf',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 7,
    isPopular: true,
  },
  {
    id: '3',
    title: '펀드 vs ETF, 어떤 게 나한테 맞을까?',
    summary: '펀드와 ETF의 차이점을 비교하고 나에게 맞는 투자 상품을 선택하는 방법을 알아봅니다.',
    category: 'fund',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 6,
  },
  {
    id: '4',
    title: 'PER, PBR, ROE... 꼭 알아야 할 투자 용어 10선',
    summary: '주식 투자할 때 자주 만나는 재무제표 용어들. 이것만 알면 기업 분석이 훨씬 쉬워집니다.',
    category: 'glossary',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 8,
    isPopular: true,
  },
  {
    id: '5',
    title: '월급쟁이의 첫 주식 투자, 얼마부터 시작할까?',
    summary: '적은 금액으로 시작하는 주식 투자 전략. 소액으로도 충분히 투자 습관을 만들 수 있습니다.',
    category: 'stock-basics',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    date: '2026-01-08',
    readTime: 4,
  },
];

const popularArticles = articles.filter(a => a.isPopular).slice(0, 5);

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function ArticleCard({ article }: { article: Article }) {
  const category = categories.find(c => c.id === article.category);
  
  return (
    <Link href={`/invest/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              {category.name}
            </Badge>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">{article.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{article.summary}</p>
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
  );
}

function CategoryTabs({ activeCategory, onCategoryChange }: { 
  activeCategory: string | null; 
  onCategoryChange: (category: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className={activeCategory === null ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" : ""}
        data-testid="tab-all"
      >
        전체
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeCategory === cat.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(cat.id)}
          className={activeCategory === cat.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" : ""}
          data-testid={`tab-${cat.id}`}
        >
          <cat.icon className="w-4 h-4 mr-1.5" />
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="space-y-6">
      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-foreground">인기 글 TOP 5</h3>
        </div>
        <div className="space-y-3">
          {popularArticles.map((article, index) => (
            <Link key={article.id} href={`/invest/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold">오늘의 5분 미션</h3>
        </div>
        <p className="text-sm text-white/90 mb-4">
          오늘의 미션: 증권사 앱에서 관심종목 3개 추가하기
        </p>
        <Button variant="secondary" size="sm" className="w-full" data-testid="button-mission">
          미션 확인하기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Card>

      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-foreground">새 글 알림 받기</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          투자 꿀팁을 놓치지 마세요! 새 글이 올라오면 바로 알려드릴게요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" data-testid="button-subscribe-cta">
            구독하기
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
      
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            투자 시작하기
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            초보자도 쉽게 따라하는 투자 가이드
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {filteredArticles.length === 0 && (
              <Card className="p-12 text-center bg-card/95 backdrop-blur-sm border-0 shadow-lg">
                <p className="text-muted-foreground">이 카테고리에 글이 없습니다.</p>
              </Card>
            )}
          </div>

          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        </div>

        <div className="lg:hidden mt-8">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
