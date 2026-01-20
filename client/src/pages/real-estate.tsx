import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, Clock, Calendar, Star, Eye, ChevronRight, 
  Home, FileText, Wallet, Lightbulb, Bell, PinIcon, Loader2
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { useQuery } from '@tanstack/react-query';
import type { Article } from '@shared/schema';
import { getRealEstateImage } from '@/lib/article-images';

const categories = [
  { id: 'buy', name: '매매 전략', icon: Home },
  { id: 'subscription', name: '청약 가이드', icon: FileText },
  { id: 'rent', name: '전월세 노하우', icon: Building },
  { id: 'tax', name: '세금/대출', icon: Wallet },
];

const tips = [
  '전세 계약 전 등기부등본은 반드시 계약 당일에 다시 확인하세요.',
  '청약통장은 가입 기간이 길수록 유리합니다. 미리미리 가입하세요.',
  '재건축 투자는 조합설립인가 이후 단계가 비교적 안전합니다.',
  '양도세 비과세를 위해선 2년 이상 거주 요건을 꼭 확인하세요.',
  '전월세신고제로 인해 계약 후 30일 이내 신고는 필수입니다.',
  '주담대 갈아타기로 연간 수십만원 이자를 절약할 수 있습니다.',
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
    <Link href={`/real-estate/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg h-full" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={getRealEstateImage(article.category)} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white border-0">
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
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ articles }: { articles: Article[] }) {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const pinnedArticles = articles.filter(a => a.isPinned);
  const popularArticles = articles.filter(a => a.featured).sort((a, b) => b.views - a.views).slice(0, 5);
  
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
              <Link key={article.id} href={`/real-estate/${article.id}`}>
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
              <Link key={article.id} href={`/real-estate/${article.id}`}>
                <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-foreground">오늘의 부동산 팁</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-blue-500 to-sky-500 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5" />
          <h3 className="font-bold">뉴스레터 구독</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">
          매주 부동산 시장 동향과 실전 팁을 받아보세요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-white text-blue-600" data-testid="button-subscribe-sidebar">
            무료 구독하기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function RealEstate() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/real-estate'],
  });

  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            부동산
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            직장인을 위한 진짜 부동산 이야기
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
            
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {filteredArticles.length === 0 && (
                  <div className="text-center py-16">
                    <Building className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">해당 카테고리의 글이 없습니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <Sidebar articles={articles} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
