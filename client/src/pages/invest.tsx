import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, Clock, Calendar, Star, Eye, ChevronRight, 
  BarChart3, PieChart, Wallet, Lightbulb, Bell, PinIcon, Briefcase, Loader2
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { useQuery } from '@tanstack/react-query';
import type { Article } from '@shared/schema';

const categories = [
  { id: 'stock', name: '주식 투자', icon: BarChart3 },
  { id: 'reit-etf', name: '리츠/ETF', icon: PieChart },
  { id: 'dividend', name: '배당주', icon: Wallet },
  { id: 'portfolio', name: '포트폴리오', icon: Briefcase },
];

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

function Sidebar({ articles = [] }: { articles: Article[] }) {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const pinnedArticles = (articles || []).filter(a => a.isPinned);
  const popularArticles = (articles || []).filter(a => a.featured).sort((a, b) => b.views - a.views).slice(0, 5);
  
  return (
    <div className="space-y-6">
      {pinnedArticles.length > 0 && (
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
      )}

      {popularArticles.length > 0 && (
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
      )}

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
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/invest'],
  });
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SharedHeader />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Sidebar articles={articles} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
