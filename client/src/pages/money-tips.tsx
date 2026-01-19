import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, Clock, Calendar, Star, Eye, ChevronRight, 
  Briefcase, Receipt, Target, BookOpen, Bell, PinIcon
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
  { id: 'side-income', name: '부수입 아이디어', icon: Briefcase },
  { id: 'tax-tips', name: '절세 꿀팁', icon: Receipt },
  { id: 'routine', name: '재테크 루틴', icon: Target },
  { id: 'journal', name: '쿠쿠의 실천 일지', icon: BookOpen },
];

const articles: Article[] = [
  {
    id: '1',
    title: '직장인 N잡 추천 5가지',
    summary: '본업에 지장 없이 할 수 있는 부업 5가지를 소개합니다. 시간 투자 대비 수익이 좋은 N잡만 모았습니다.',
    category: 'side-income',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    date: '2026-01-19',
    readTime: 6,
    views: 5420,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '2',
    title: '블로그로 월 50만원 버는 법',
    summary: '티스토리, 네이버 블로그로 수익 창출하는 방법. 키워드 선정부터 광고 수익까지 상세 가이드입니다.',
    category: 'side-income',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 8,
    views: 4890,
    isPopular: true,
  },
  {
    id: '3',
    title: '재택 부업 현실적인 수익 공개',
    summary: '쿠팡 파트너스, 스마트스토어, 전자책 등 재택 부업의 실제 수익을 공개합니다.',
    category: 'side-income',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 7,
    views: 3240,
  },
  {
    id: '4',
    title: '연말정산 환급 최대로 받기',
    summary: '놓치기 쉬운 공제 항목 총정리. 연말정산 전 반드시 체크해야 할 절세 포인트를 알려드립니다.',
    category: 'tax-tips',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-18',
    readTime: 7,
    views: 6780,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '5',
    title: 'ISA 계좌 200% 활용법',
    summary: '비과세 혜택을 최대로 받는 ISA 활용 전략. 서민형/일반형 어떤 게 유리할까요?',
    category: 'tax-tips',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    date: '2026-01-15',
    readTime: 6,
    views: 4120,
    isPopular: true,
  },
  {
    id: '6',
    title: '퇴직연금 DC형 vs DB형 선택 가이드',
    summary: '퇴직연금 어떤 유형을 선택해야 할까? 나에게 맞는 퇴직연금 유형을 찾아봅니다.',
    category: 'tax-tips',
    thumbnail: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 5,
    views: 2890,
  },
  {
    id: '7',
    title: '매일 5분 돈 관리 습관',
    summary: '하루 5분만 투자하면 되는 돈 관리 루틴. 가계부 없이도 자산을 불리는 방법입니다.',
    category: 'routine',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    date: '2026-01-16',
    readTime: 4,
    views: 5670,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '8',
    title: '월급날 루틴 공개',
    summary: '월급 들어오면 가장 먼저 해야 할 것들. 자동이체 설정부터 투자금 분배까지 루틴을 공개합니다.',
    category: 'routine',
    thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop',
    date: '2026-01-13',
    readTime: 5,
    views: 3450,
  },
  {
    id: '9',
    title: '52주 적금 챌린지 완주 후기',
    summary: '52주 동안 매주 적금액을 늘려가는 챌린지. 1년 후 얼마나 모았는지 공개합니다.',
    category: 'routine',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 6,
    views: 2180,
  },
  {
    id: '10',
    title: '쿠쿠의 1월 투자 기록',
    summary: '2026년 1월 쿠쿠가 실제로 투자한 내역과 수익률을 투명하게 공개합니다.',
    category: 'journal',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 8,
    views: 7890,
    isPopular: true,
  },
  {
    id: '11',
    title: '실패한 투자에서 배운 것들',
    summary: '쿠쿠가 실제로 손해 본 투자 사례와 그로부터 배운 교훈을 솔직하게 공유합니다.',
    category: 'journal',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 7,
    views: 4560,
  },
  {
    id: '12',
    title: '1년간 지출 줄이기 프로젝트 결산',
    summary: '불필요한 지출을 줄이고 저축률을 높인 1년간의 기록. 실천 방법과 결과를 공유합니다.',
    category: 'journal',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    date: '2026-01-11',
    readTime: 6,
    views: 3120,
  },
];

const pinnedArticles = articles.filter(a => a.isPinned);
const popularArticles = articles.filter(a => a.isPopular).slice(0, 5);

const tips = [
  '소비 전에 24시간 기다려보세요. 충동구매가 줄어듭니다.',
  '월급의 10%는 무조건 저축 먼저! 나머지로 생활하세요.',
  'ISA 계좌는 비과세 혜택이 있어 장기 투자에 유리합니다.',
  '카페 커피 한 잔 줄이면 한 달에 6만원, 1년에 72만원입니다.',
  '신용카드보다 체크카드가 지출 관리에 효과적입니다.',
  '매달 고정비를 점검하고 불필요한 구독 서비스는 해지하세요.',
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
    <Link href={`/money-tips/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg h-full" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
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
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
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
            <Link key={article.id} href={`/money-tips/${article.id}`}>
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
            <Link key={article.id} href={`/money-tips/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-foreground">오늘의 절약 팁</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-amber-500 to-orange-500 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5" />
          <h3 className="font-bold">뉴스레터 구독</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">
          매주 실천 가능한 재테크 팁을 받아보세요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-white text-amber-700" data-testid="button-subscribe-sidebar">
            무료 구독하기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function MoneyTips() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            돈 버는 팁
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            매일 실천하는 재테크 루틴
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
                <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
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
