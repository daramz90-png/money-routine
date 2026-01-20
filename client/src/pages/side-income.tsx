import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Clock, Calendar, Star, ChevronRight, 
  BookOpen, Briefcase, PenTool, Gift, Trophy, Bell
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
  { id: 'n-job', name: 'N잡 아이디어', icon: Briefcase },
  { id: 'blog', name: '블로그 수익', icon: PenTool },
  { id: 'talent', name: '재능 판매', icon: Gift },
  { id: 'success', name: '투잡 성공기', icon: Trophy },
];

const articles: Article[] = [
  {
    id: '1',
    title: '직장인이 할 수 있는 N잡 아이디어 10가지',
    summary: '퇴근 후 2시간, 주말을 활용해 월 50만원 추가 수입을 만드는 현실적인 방법들을 소개합니다.',
    category: 'n-job',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    date: '2026-01-18',
    readTime: 8,
    isPopular: true,
  },
  {
    id: '2',
    title: '블로그로 월 100만원 버는 사람들의 공통점',
    summary: '애드센스, 제휴 마케팅, 협찬까지. 블로그 수익화의 모든 것을 파헤칩니다.',
    category: 'blog',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
    date: '2026-01-16',
    readTime: 10,
    isPopular: true,
  },
  {
    id: '3',
    title: '크몽, 탈잉으로 재능 팔아서 월급 외 수입 만들기',
    summary: '디자인, 번역, 영상 편집부터 엑셀, 파워포인트까지. 내 재능을 돈으로 바꾸는 방법.',
    category: 'talent',
    thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop',
    date: '2026-01-14',
    readTime: 6,
    isPopular: true,
  },
  {
    id: '4',
    title: '평범한 직장인이 스마트스토어로 월 200 버는 후기',
    summary: '회사 다니면서 시작한 스마트스토어, 6개월 만에 월 200만원 순수익을 달성한 실제 사례.',
    category: 'success',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    date: '2026-01-12',
    readTime: 7,
  },
  {
    id: '5',
    title: '유튜브 구독자 0명에서 시작해 수익 창출까지',
    summary: '장비 없이 스마트폰으로 시작한 유튜브. 첫 수익이 들어오기까지의 솔직한 이야기.',
    category: 'n-job',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
    date: '2026-01-10',
    readTime: 9,
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
    <Link href={`/side-income/${article.id}`}>
      <Card className="overflow-hidden hover-elevate cursor-pointer bg-card/95 backdrop-blur-sm border-0 shadow-lg" data-testid={`article-card-${article.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0">
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
        className={activeCategory === null ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0" : ""}
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
          className={activeCategory === cat.id ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0" : ""}
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
            <Link key={article.id} href={`/side-income/${article.id}`}>
              <div className="flex items-start gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid={`popular-article-${index + 1}`}>
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground line-clamp-2">{article.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-pink-500 to-rose-600 border-0 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold">오늘의 5분 미션</h3>
        </div>
        <p className="text-sm text-white/90 mb-4">
          오늘의 미션: 내가 잘하는 것 3가지 적어보기
        </p>
        <Button variant="secondary" size="sm" className="w-full" data-testid="button-mission">
          미션 확인하기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Card>

      <Card className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-pink-500" />
          <h3 className="font-bold text-foreground">새 글 알림 받기</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          부수입 꿀팁을 놓치지 마세요! 새 글이 올라오면 바로 알려드릴게요.
        </p>
        <Link href="/subscribe">
          <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0" data-testid="button-subscribe-cta">
            구독하기
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default function SideIncome() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredArticles = activeCategory 
    ? articles.filter(a => a.category === activeCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            부수입 만들기
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            월급 외 수입으로 경제적 자유에 한 발 더 가까이
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
