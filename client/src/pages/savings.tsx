import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, Clock, Calendar, Star, ChevronRight, 
  BookOpen, Target, Scale, Repeat, Layers, Bell
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
  { id: 'saving-goal', name: '목돈 모으기', icon: Target },
  { id: 'deposit-compare', name: '예적금 비교', icon: Scale },
  { id: 'habit', name: '저축 습관', icon: Repeat },
  { id: 'account-split', name: '통장 쪼개기', icon: Layers },
];

const articles: Article[] = [
  {
    id: '1',
    title: '1년에 1000만원 모으는 현실적인 방법',
    summary: '월급이 적어도 할 수 있습니다. 매달 83만원씩 저축하는 구체적인 전략과 실천 팁을 공개합니다.',
    category: 'saving-goal',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 6,
    isPopular: true,
  },
  {
    id: '2',
    title: '2026년 1월 예적금 금리 비교 TOP 10',
    summary: '이달의 최고 금리 예적금 상품을 한눈에 비교해보세요. 시중은행부터 저축은행까지 총정리.',
    category: 'deposit-compare',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-15',
    readTime: 5,
    isPopular: true,
  },
  {
    id: '3',
    title: '돈 모으기가 어려운 당신을 위한 자동 저축 시스템',
    summary: '의지력에 의존하지 마세요. 월급날 자동으로 저축되는 시스템을 만들면 누구나 부자가 될 수 있습니다.',
    category: 'habit',
    thumbnail: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=400&h=300&fit=crop',
    date: '2026-01-13',
    readTime: 4,
    isPopular: true,
  },
  {
    id: '4',
    title: '통장 쪼개기 완벽 가이드: 월급 관리의 정석',
    summary: '급여통장, 소비통장, 저축통장, 비상금통장. 4개의 통장으로 돈 관리 스트레스에서 벗어나세요.',
    category: 'account-split',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    date: '2026-01-11',
    readTime: 7,
  },
  {
    id: '5',
    title: '파킹통장 vs CMA, 비상금은 어디에 넣어야 할까?',
    summary: '갑자기 돈이 필요할 때 바로 꺼낼 수 있으면서도 이자를 받을 수 있는 최적의 선택은?',
    category: 'deposit-compare',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    date: '2026-01-09',
    readTime: 5,
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
    <Link href={`/savings/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
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
        className={activeCategory === null ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0" : ""}
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
          className={activeCategory === cat.id ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0" : ""}
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
            <Link key={article.id} href={`/savings/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-blue-500 to-cyan-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold">오늘의 5분 미션</h3>
        </div>
        <p className="text-sm text-white/90 mb-4">
          오늘의 미션: 이번 달 고정 지출 3가지 적어보기
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
          저축 꿀팁을 놓치지 마세요! 새 글이 올라오면 바로 알려드릴게요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0" data-testid="button-subscribe-cta">
            구독하기
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function Savings() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            통장 관리
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            체계적인 통장 관리로 부자가 되는 첫걸음
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
