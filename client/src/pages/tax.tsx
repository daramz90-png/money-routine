import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, Clock, Calendar, Star, ChevronRight, 
  BookOpen, FileText, PiggyBank, Scale, Bell, Calculator
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
  { id: 'year-end', name: '연말정산 꿀팁', icon: FileText },
  { id: 'isa', name: 'ISA 계좌 활용', icon: PiggyBank },
  { id: 'pension', name: '연금저축 전략', icon: Calculator },
  { id: 'compare', name: '절세 상품 비교', icon: Scale },
];

const articles: Article[] = [
  {
    id: '1',
    title: '2026 연말정산 완벽 가이드: 놓치기 쉬운 공제 항목 총정리',
    summary: '매년 돌아오는 연말정산, 이것만 알면 환급액을 극대화할 수 있습니다. 신용카드, 의료비, 교육비 공제의 모든 것.',
    category: 'year-end',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-18',
    readTime: 8,
    isPopular: true,
  },
  {
    id: '2',
    title: '연말정산 간소화 서비스 200% 활용법',
    summary: '국세청 홈택스에서 제공하는 연말정산 간소화 서비스, 제대로 활용하고 계신가요? 숨은 공제 찾는 방법 알려드립니다.',
    category: 'year-end',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    date: '2026-01-16',
    readTime: 5,
    isPopular: true,
  },
  {
    id: '3',
    title: '13월의 월급, 연말정산 환급 많이 받는 직장인의 비밀',
    summary: '같은 연봉인데 왜 누군가는 100만원을 환급받고 누군가는 오히려 더 내야 할까요? 환급 고수들의 노하우.',
    category: 'year-end',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 6,
  },
  {
    id: '4',
    title: 'ISA 계좌, 왜 지금 만들어야 할까?',
    summary: '비과세 혜택부터 손익통산까지, ISA 계좌의 숨겨진 장점들. 2026년 달라진 제도와 함께 알아봅니다.',
    category: 'isa',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 7,
    isPopular: true,
  },
  {
    id: '5',
    title: 'ISA vs 연금저축, 어떤 계좌에 먼저 넣어야 할까?',
    summary: '두 가지 절세 계좌의 차이점과 우선순위. 나에게 맞는 절세 전략을 세워보세요.',
    category: 'isa',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 6,
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
    <Link href={`/tax/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0">
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
        className={activeCategory === null ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0" : ""}
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
          className={activeCategory === cat.id ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0" : ""}
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
            <Link key={article.id} href={`/tax/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-orange-500 to-amber-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold">오늘의 5분 미션</h3>
        </div>
        <p className="text-sm text-white/90 mb-4">
          오늘의 미션: 홈택스에서 연말정산 간소화 자료 다운로드하기
        </p>
        <Button variant="secondary" size="sm" className="w-full" data-testid="button-mission">
          미션 확인하기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Card>

      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-foreground">새 글 알림 받기</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          절세 꿀팁을 놓치지 마세요! 새 글이 올라오면 바로 알려드릴게요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0" data-testid="button-subscribe-cta">
            구독하기
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function Tax() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            절세 & 환급
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            세금 아끼고 환급 받는 똑똑한 방법
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
