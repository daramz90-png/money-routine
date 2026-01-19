import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, Clock, Calendar, Star, Eye, ChevronRight, 
  Home, FileText, Wallet, Lightbulb, Bell, PinIcon
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
  { id: 'buy', name: '매매 전략', icon: Home },
  { id: 'subscription', name: '청약 가이드', icon: FileText },
  { id: 'rent', name: '전월세 노하우', icon: Building },
  { id: 'tax', name: '세금/대출', icon: Wallet },
];

const articles: Article[] = [
  {
    id: '1',
    title: '2026년 수도권 아파트 시장 전망',
    summary: '올해 수도권 부동산 시장은 어떻게 될까요? 금리, 공급, 정책 변화를 종합적으로 분석하고 투자 전략을 제시합니다.',
    category: 'buy',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    date: '2026-01-19',
    readTime: 7,
    views: 3240,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '2',
    title: '생애최초 특별공급 완벽 가이드',
    summary: '생애최초 특별공급의 자격 조건, 신청 방법, 당첨 확률 높이는 팁까지 한눈에 정리했습니다.',
    category: 'buy',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 6,
    views: 2890,
    isPopular: true,
  },
  {
    id: '3',
    title: '재건축 투자, 지금 들어가도 될까?',
    summary: '재건축 아파트 투자의 장단점과 주의사항. 안전마진 확보를 위한 체크리스트를 공유합니다.',
    category: 'buy',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 8,
    views: 1560,
  },
  {
    id: '4',
    title: '청약 가점 계산하는 법',
    summary: '청약 가점제의 구성요소와 계산 방법을 상세히 알려드립니다. 나의 가점을 미리 계산해보세요.',
    category: 'subscription',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    date: '2026-01-18',
    readTime: 5,
    views: 4120,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '5',
    title: '이번 달 청약 일정 총정리',
    summary: '2026년 1월 진행되는 청약 일정과 주요 단지 정보를 한눈에 확인하세요.',
    category: 'subscription',
    thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    date: '2026-01-15',
    readTime: 4,
    views: 2340,
  },
  {
    id: '6',
    title: '무순위 청약 당첨 노하우',
    summary: '무순위 청약(줍줍)에서 당첨 확률을 높이는 실전 팁과 주의사항을 정리했습니다.',
    category: 'subscription',
    thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 5,
    views: 1890,
  },
  {
    id: '7',
    title: '전세 사기 피하는 체크리스트',
    summary: '전세 계약 전 반드시 확인해야 할 10가지. 깡통전세, 이중계약 등 주요 사기 유형별 예방법을 알려드립니다.',
    category: 'rent',
    thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=300&fit=crop',
    date: '2026-01-16',
    readTime: 6,
    views: 5670,
    isPopular: true,
    isPinned: true,
  },
  {
    id: '8',
    title: '전월세 계약서 작성 꿀팁',
    summary: '계약서에 꼭 넣어야 할 특약 조항과 불리한 조항 피하는 법. 계약서 샘플도 함께 제공합니다.',
    category: 'rent',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    date: '2026-01-13',
    readTime: 7,
    views: 2450,
  },
  {
    id: '9',
    title: '월세 VS 전세, 나에게 맞는 선택은?',
    summary: '월세와 전세의 장단점을 비교하고, 상황별 최적의 선택을 도와드립니다.',
    category: 'rent',
    thumbnail: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 5,
    views: 1780,
  },
  {
    id: '10',
    title: '양도소득세 비과세 받는 조건',
    summary: '1세대 1주택 비과세 요건과 다주택자 양도세 절세 전략을 상세히 설명합니다.',
    category: 'tax',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    date: '2026-01-17',
    readTime: 8,
    views: 3890,
    isPopular: true,
  },
  {
    id: '11',
    title: '취득세 절약하는 방법',
    summary: '주택 취득세율 총정리와 합법적인 절세 방법. 생애최초 취득세 감면 혜택도 확인하세요.',
    category: 'tax',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 6,
    views: 2120,
  },
  {
    id: '12',
    title: '주택담보대출 금리 비교 가이드',
    summary: '시중 은행별 주담대 금리 비교와 유리한 대출 조건 찾는 방법을 알려드립니다.',
    category: 'tax',
    thumbnail: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
    date: '2026-01-11',
    readTime: 7,
    views: 2980,
  },
];

const pinnedArticles = articles.filter(a => a.isPinned);
const popularArticles = articles.filter(a => a.isPopular).slice(0, 5);

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
            src={article.thumbnail} 
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
            <Link key={article.id} href={`/real-estate/${article.id}`}>
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
            <Link key={article.id} href={`/real-estate/${article.id}`}>
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

      <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-foreground">오늘의 부동산 팁</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{randomTip}</p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-purple-600 to-indigo-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5" />
          <h3 className="font-bold">뉴스레터 구독</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">
          매주 부동산 시장 동향과 실전 팁을 받아보세요.
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

export default function RealEstate() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 px-4">
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
          </div>
          
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <Sidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
