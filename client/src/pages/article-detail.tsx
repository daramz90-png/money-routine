import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Clock, Eye, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SharedHeader } from '@/components/shared-header';
import type { Article, RoutineArticle } from '@shared/schema';

const categoryLabels: Record<string, string> = {
  buy: '매매 전략',
  subscription: '청약 가이드',
  rent: '전월세 노하우',
  tax: '세금/대출',
  stock: '주식',
  'reit-etf': '리츠/ETF',
  dividend: '배당',
  portfolio: '포트폴리오',
  monthly: '월간 결산',
  routine: '루틴 공개',
  failure: '실패담',
  gap: '갈아타기',
};

const pageTypeLabels: Record<string, string> = {
  'real-estate': '부동산',
  invest: '투자',
  column: '칼럼',
  routine: '루틴',
};

const pageTypeBackLinks: Record<string, string> = {
  'real-estate': '/real-estate',
  invest: '/invest',
  column: '/column',
  routine: '/routine',
};

export default function ArticleDetail() {
  const [, params] = useRoute('/:pageType/:id');
  const pageType = params?.pageType || '';
  const articleId = params?.id || '';

  const isRoutineArticle = pageType === 'column' || pageType === 'routine';

  const { data: article, isLoading, error } = useQuery<Article | RoutineArticle>({
    queryKey: isRoutineArticle ? ['/api/routine-articles', articleId] : ['/api/articles', pageType, articleId],
    queryFn: async () => {
      const endpoint = isRoutineArticle 
        ? `/api/routine-articles/${articleId}` 
        : `/api/articles/${pageType}/${articleId}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Article not found');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SharedHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <SharedHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">글을 찾을 수 없습니다</h1>
            <p className="text-muted-foreground mb-6">요청하신 글이 존재하지 않거나 삭제되었을 수 있습니다.</p>
            <Link href={pageTypeBackLinks[pageType] || '/'}>
              <Button data-testid="button-back-to-list">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로 돌아가기
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href={pageTypeBackLinks[pageType] || '/'}>
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {pageTypeLabels[pageType] || '목록'}으로 돌아가기
          </Button>
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" data-testid="badge-category">
                {categoryLabels[article.category] || article.category}
              </Badge>
              {article.featured && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  추천
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-article-title">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6" data-testid="text-article-summary">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-article-date">{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span data-testid="text-article-readtime">{article.readTime}분</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span data-testid="text-article-views">{article.views.toLocaleString()}회</span>
              </div>
            </div>
          </header>

          <Card className="p-6 md:p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              data-testid="text-article-content"
            >
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </article>

        <div className="mt-8 pt-8 border-t">
          <Link href={pageTypeBackLinks[pageType] || '/'}>
            <Button variant="outline" data-testid="button-back-bottom">
              <ArrowLeft className="w-4 h-4 mr-2" />
              다른 글 보기
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
