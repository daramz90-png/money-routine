import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Clock, Calendar, Eye, ChevronRight, 
  Lightbulb, Bell, Star, Loader2
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { useQuery } from '@tanstack/react-query';
import type { RoutineArticle } from '@shared/schema';
import { getColumnImage } from '@/lib/article-images';

const categories = [
  { id: 'monthly', name: '월간 투자 일지', icon: Calendar },
  { id: 'routine', name: '워킹맘 루틴', icon: Clock },
  { id: 'failure', name: '실패담 & 교훈', icon: Lightbulb },
  { id: 'gap', name: '투자 이야기', icon: FileText },
];

const tips = [
  '매일 10분씩 투자 공부를 하면 1년에 60시간이 됩니다.',
  '실패에서 배운 교훈이 성공의 씨앗이 됩니다.',
  '나만의 투자 원칙을 세우고 지키는 것이 중요합니다.',
  '감정에 흔들리지 않는 투자 습관을 만드세요.',
  '작은 성공 경험이 큰 자신감으로 이어집니다.',
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

function ArticleCard({ article }: { article: RoutineArticle }) {
  const category = categories.find(c => c.id === article.category);
  
  return (
    <Link href={`/column/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg h-full" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={getColumnImage(article.category)} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
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
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ articles = [] }: { articles: RoutineArticle[] }) {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const popularArticles = (articles || []).filter(a => a.featured).sort((a, b) => b.views - a.views).slice(0, 5);
  
  return (
    <div className="space-y-6">
      {popularArticles.length > 0 && (
        <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-foreground">인기 글 TOP 5</h3>
          </div>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <Link key={article.id} href={`/column/${article.id}`}>
                <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-foreground">오늘의 팁</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-purple-600 to-indigo-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5" />
          <h3 className="font-bold">뉴스레터 구독</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">
          매주 쿠쿠의 투자 칼럼을 받아보세요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-white text-purple-700" data-testid="button-subscribe-sidebar">
            무료 구독하기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function Column() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: articles = [], isLoading } = useQuery<RoutineArticle[]>({
    queryKey: ['/api/routine-articles'],
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
      
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            칼럼
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            쿠쿠의 투자 이야기와 경험담
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
                <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
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
