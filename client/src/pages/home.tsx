import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, TrendingUp, TrendingDown, DollarSign, Coins, 
  BarChart3, Bitcoin, LineChart, Building2, Gauge, Ship, 
  Check, Calendar, Newspaper, ListTodo, Quote, Bell,
  Clock, ChartLine, Star, ExternalLink,
  CheckSquare, Building, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { MarketData, FearGreedData, DashboardContent, ManualMarketData } from '@shared/schema';
import { initialMarketData, defaultContent, defaultManualMarketData } from '@shared/schema';
import { SharedHeader } from '@/components/shared-header';

function HeroSection({ 
  date, 
  title, 
  subtitle, 
  availableDates = [],
  selectedDate,
  onDateChange 
}: { 
  date: string; 
  title: string; 
  subtitle: string;
  availableDates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}) {
  const safeAvailableDates = availableDates || [];
  const currentIndex = safeAvailableDates.indexOf(selectedDate);
  const canGoPrev = currentIndex >= 0 && currentIndex < safeAvailableDates.length - 1;
  const canGoNext = currentIndex > 0;

  const goToPrev = () => {
    if (canGoPrev) {
      onDateChange(safeAvailableDates[currentIndex + 1]);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      onDateChange(safeAvailableDates[currentIndex - 1]);
    }
  };

  const formatDateKorean = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
  };

  const isToday = safeAvailableDates.length === 0 || selectedDate === safeAvailableDates[0];

  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-hero-title">
          {title || '하루 5분으로 시작하는 재테크'}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
          {subtitle || '공모주 청약부터 부동산 뉴스, 놓치기 쉬운 정책 정보까지!'}
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={!canGoPrev}
            className="text-white hover:bg-white/20 disabled:opacity-30"
            data-testid="button-prev-date"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="inline-flex flex-wrap items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full" data-testid="text-date">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{selectedDate ? formatDateKorean(selectedDate) : date}</span>
            {!isToday && (
              <Badge className="bg-amber-500 text-white border-0 ml-2">지난 호</Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className="text-white hover:bg-white/20 disabled:opacity-30"
            data-testid="button-next-date"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {safeAvailableDates.length > 1 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {safeAvailableDates.slice(0, 7).map((d) => (
              <button
                key={d}
                onClick={() => onDateChange(d)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  d === selectedDate 
                    ? 'bg-white text-purple-700 font-medium' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                data-testid={`date-chip-${d}`}
              >
                {new Date(d).getMonth() + 1}/{new Date(d).getDate()}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SummarySection({ summaries }: { summaries: { id: string; text: string }[] }) {
  return (
    <section className="py-8" id="summary">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Check className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">오늘의 주요 요약</h2>
      </div>
      <Card className="p-6 shadow-lg border-0 bg-card">
        <div className="space-y-4">
          {summaries.map((item) => (
            <div key={item.id} className="flex flex-wrap items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30" data-testid={`summary-${item.id}`}>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground font-medium flex-1 min-w-0">{item.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function IPOCard({ ipo }: { ipo: any }) {
  return (
    <Card className={`p-5 shadow-md transition-all ${ipo.isHighlight ? 'ring-2 ring-red-500 bg-red-50/50 dark:bg-red-950/20' : 'bg-card'}`} data-testid={`ipo-${ipo.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h4 className="text-lg font-bold text-foreground">{ipo.name}</h4>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          접수 {ipo.score}점
        </Badge>
      </div>
      {ipo.isHighlight && (
        <Badge className="mb-3 bg-red-500 text-white">
          <Star className="w-3 h-3 mr-1" />
          청약하세요
        </Badge>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">청약기간</span>
          <span className="font-medium text-foreground">{ipo.period}</span>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">공모가</span>
          <span className="font-medium text-foreground">{ipo.price} ({ipo.minAmount})</span>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">증권사</span>
          <span className="font-medium text-foreground">{ipo.broker}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{ipo.description}</p>
    </Card>
  );
}

function RealEstateCard({ item }: { item: any }) {
  return (
    <Card className="p-4 shadow-md bg-card" data-testid={`realestate-${item.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-foreground">{item.name}</h4>
        <Badge variant="outline" className="text-xs">{item.priority}</Badge>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">위치</span>
          <span className="text-foreground">{item.location}</span>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">세대수</span>
          <span className="text-foreground">{item.units}세대</span>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">기간</span>
          <span className="text-foreground">{item.period}</span>
        </div>
      </div>
    </Card>
  );
}

function ScheduleSection({ ipos, realEstates }: { ipos: any[]; realEstates: any[] }) {
  const apartments = realEstates.filter(r => r.type === 'apartment');
  const urban = realEstates.filter(r => r.type === 'urban');
  
  return (
    <section className="py-8" id="schedule">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Calendar className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">오늘의 재테크 일정</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg border-0 bg-card">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-foreground">공모주 청약</h3>
          </div>
          <div className="space-y-4">
            {ipos.length > 0 ? (
              ipos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo} />)
            ) : (
              <p className="text-muted-foreground text-center py-4">오늘 공모주 청약 일정이 없습니다</p>
            )}
          </div>
        </Card>
        
        <Card className="p-6 shadow-lg border-0 bg-card">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-foreground">부동산 청약</h3>
          </div>
          
          {apartments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">아파트</h4>
              <div className="space-y-3">
                {apartments.map((item) => <RealEstateCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
          
          {urban.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">도시형 생활주택</h4>
              <div className="space-y-3">
                {urban.map((item) => <RealEstateCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
          
          {apartments.length === 0 && urban.length === 0 && (
            <p className="text-muted-foreground text-center py-4">오늘 부동산 청약 일정이 없습니다</p>
          )}
        </Card>
      </div>
    </section>
  );
}

function NewsSection({ news }: { news: any[] }) {
  return (
    <section className="py-8" id="news">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Newspaper className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">오늘의 뉴스픽</h2>
      </div>
      
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id} className="p-5 shadow-md border-0 bg-card hover-elevate transition-all" data-testid={`news-${item.id}`}>
            <div className="flex flex-wrap gap-4">
              <div className="w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.summary}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex flex-wrap items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                    기사 전문 보기
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TodoSection({ todos }: { todos: any[] }) {
  return (
    <section className="py-8" id="todo">
      <Card className="p-6 shadow-xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <ListTodo className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">오늘 해야하는 것!!!</h2>
        </div>
        
        <div className="space-y-4">
          {todos.map((todo) => (
            <Card key={todo.id} className="p-4 bg-white dark:bg-card shadow-md" data-testid={`todo-${todo.id}`}>
              <div className="flex flex-wrap items-start gap-3">
                <CheckSquare className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground mb-1">{todo.title}</h4>
                  <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1">
                    <span className="text-orange-600">→</span>
                    <span>{todo.description}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </section>
  );
}

function MarketCard({ 
  name, 
  value, 
  unit, 
  change, 
  loading, 
  icon: Icon,
  url
}: { 
  name: string; 
  value: string; 
  unit: string; 
  change: number; 
  loading: boolean; 
  icon?: React.ElementType;
  url?: string;
}) {
  const isUp = change > 0;
  
  const cardContent = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{name}</span>
        {url && <ExternalLink className="w-3 h-3 ml-auto opacity-50" />}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-28 mb-2" />
      ) : (
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      )}
      {unit && <div className="text-xs text-muted-foreground mb-3">{unit}</div>}
      {!loading && change !== 0 && (
        <div className={`inline-flex flex-wrap items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
          isUp ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isUp ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
      )}
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="p-5 shadow-md border-0 bg-card hover-elevate transition-all cursor-pointer" data-testid={`card-market-${name.toLowerCase().replace(/\s/g, '-')}`}>
          {cardContent}
        </Card>
      </a>
    );
  }
  
  return (
    <Card className="p-5 shadow-md border-0 bg-card hover-elevate transition-all" data-testid={`card-market-${name.toLowerCase().replace(/\s/g, '-')}`}>
      {cardContent}
    </Card>
  );
}

function FearGreedCard({ data, url }: { data: FearGreedData; url?: string }) {
  const getFearGreedStyle = (value: string) => {
    const num = parseInt(value);
    if (num < 25) return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
    if (num < 45) return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    if (num < 55) return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (num < 75) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
  };

  const style = getFearGreedStyle(data.value);

  const cardContent = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
        <Gauge className="w-4 h-4" />
        <span>CNN 공포지수</span>
        {url && <ExternalLink className="w-3 h-3 ml-auto opacity-50" />}
      </div>
      {data.loading ? (
        <Skeleton className="h-8 w-16 mb-2" />
      ) : (
        <div className={`text-3xl font-bold mb-2 ${style.color}`}>{data.value}</div>
      )}
      {data.loading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <div className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${style.bg} ${style.color}`}>
          {data.status}
        </div>
      )}
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="p-5 shadow-md border-0 bg-card hover-elevate transition-all cursor-pointer" data-testid="card-fear-greed">
          {cardContent}
        </Card>
      </a>
    );
  }

  return (
    <Card className="p-5 shadow-md border-0 bg-card hover-elevate transition-all" data-testid="card-fear-greed">
      {cardContent}
    </Card>
  );
}

function MarketSection({ marketData, isLoading, isFetching, onRefresh, title, refreshNote }: { 
  marketData: MarketData; 
  isLoading: boolean; 
  isFetching: boolean;
  onRefresh: () => void;
  title: string;
  refreshNote: string;
}) {
  return (
    <section className="py-8" id="market">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <ChartLine className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{title || '주요 항목 시세 CHECK'}</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          data-testid="button-refresh"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MarketCard 
          name="달러 환율"
          value={marketData.usdkrw.value}
          unit="원/$"
          change={marketData.usdkrw.change}
          loading={isLoading || marketData.usdkrw.loading}
          icon={DollarSign}
          url="https://m.stock.naver.com/marketindex/exchange/FX_USDKRW"
        />
        <MarketCard 
          name="금 (Gold)"
          value={marketData.gold.value}
          unit="원/g"
          change={marketData.gold.change}
          loading={isLoading || marketData.gold.loading}
          icon={Coins}
          url="https://m.stock.naver.com/marketindex/metals/M04020000"
        />
        <MarketCard 
          name="SPY"
          value={marketData.spy.value}
          unit="$"
          change={marketData.spy.change}
          loading={isLoading || marketData.spy.loading}
          icon={BarChart3}
          url="https://m.stock.naver.com/worldstock/etf/SPY/total"
        />
        <MarketCard 
          name="비트코인"
          value={marketData.bitcoin.value}
          unit="원"
          change={marketData.bitcoin.change}
          loading={isLoading || marketData.bitcoin.loading}
          icon={Bitcoin}
          url="https://m.stock.naver.com/crypto/UPBIT/BTC"
        />
        <MarketCard 
          name="나스닥"
          value={marketData.nasdaq.value}
          unit="$"
          change={marketData.nasdaq.change}
          loading={isLoading || marketData.nasdaq.loading}
          icon={LineChart}
          url="https://m.stock.naver.com/worldstock/index/.IXIC/total"
        />
        <MarketCard 
          name="KODEX 200"
          value={marketData.kodex200.value}
          unit="원"
          change={marketData.kodex200.change}
          loading={isLoading || marketData.kodex200.loading}
          icon={Building2}
          url="https://m.stock.naver.com/domestic/stock/069500/total"
        />
        <FearGreedCard 
          data={isLoading ? { ...marketData.fearGreed, loading: true } : marketData.fearGreed} 
          url="https://edition.cnn.com/markets/fear-and-greed"
        />
        <MarketCard 
          name="SCFI (운임지수)"
          value={marketData.scfi.value}
          unit="포인트"
          change={marketData.scfi.change}
          loading={isLoading || marketData.scfi.loading}
          icon={Ship}
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground text-center">
        {refreshNote || '* 데이터는 5분마다 자동 갱신됩니다'}
      </p>
    </section>
  );
}

function ThoughtsSection({ thoughts }: { thoughts: { id: string; title: string; content: string }[] }) {
  return (
    <section className="py-8" id="thoughts">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <DollarSign className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">오늘 쿠쿠의 생각</h2>
      </div>
      
      <Card className="p-6 shadow-lg border-0 bg-card">
        <div className="space-y-6">
          {thoughts.map((thought) => (
            <div key={thought.id} data-testid={`thought-${thought.id}`}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-foreground">{thought.title}</h3>
              </div>
              <div className="pl-7 space-y-3">
                {thought.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-center text-lg font-bold text-foreground">
            오늘도 흔들림 없이, 루틴대로 갑시다
          </p>
        </div>
      </Card>
    </section>
  );
}

function QuoteSection({ quote }: { quote: { text: string; author: string } }) {
  return (
    <section className="py-8">
      <Card className="p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl border-0">
        <div className="text-center">
          <Quote className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <p className="text-xl sm:text-2xl font-medium mb-4 italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-white/90">– {quote.author}</p>
        </div>
      </Card>
    </section>
  );
}

function ClosingSection({ closingMessage, closingSubMessage, subscribeButtonText }: { closingMessage: string; closingSubMessage: string; subscribeButtonText: string }) {
  return (
    <section className="py-8">
      <Card className="p-8 text-center shadow-lg border-0 bg-card">
        <p className="text-xl font-medium text-foreground mb-2">
          {closingMessage || '오늘 하루도 차분하게, 그리고 흔들리지 않게 갑시다'}
        </p>
        <p className="text-muted-foreground mb-6">{closingSubMessage || '오늘도 화이팅입니다 ^^'}</p>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
          onClick={() => alert('이웃추가 기능은 곧 오픈됩니다!')}
          data-testid="button-subscribe"
        >
          <Bell className="w-4 h-4 mr-2" />
          {subscribeButtonText || '이웃추가하고 돈되는 루틴 받기'}
        </Button>
      </Card>
    </section>
  );
}

function Footer({ hashtags, footerText }: { hashtags: string[]; footerText: string }) {
  const defaultHashtags = ['재테크루틴', '경제뉴스요약', '공모주청약', '투자공부', '부동산청약', '환율', '연말정산', '돈공부'];
  const displayHashtags = hashtags && hashtags.length > 0 ? hashtags : defaultHashtags;
  
  return (
    <footer className="bg-gray-900 text-white py-12 mt-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">쿠쿠의 돈루틴</span>
        </div>
        <p className="text-gray-400 mb-6">{footerText || '하루 5분으로 시작하는 재테크 루틴'}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {displayHashtags.map((tag) => (
            <span key={tag} className="text-sm text-blue-400">#{tag}</span>
          ))}
        </div>
        <p className="text-gray-500 text-sm">© 2024 쿠쿠의 돈루틴. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [content, setContent] = useState<DashboardContent>(defaultContent);

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ['/api/dashboard/dates'],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: apiContent, isLoading: isLoadingContent } = useQuery<DashboardContent>({
    queryKey: ['/api/dashboard', selectedDate],
    enabled: !!selectedDate,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: marketData, isLoading, isFetching, refetch } = useQuery<MarketData>({
    queryKey: ['/api/market-data'],
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });

  const formatDate = useCallback(() => {
    const today = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${days[today.getDay()]}요일`;
  }, []);

  useEffect(() => {
    setCurrentDate(formatDate());
  }, [formatDate]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (apiContent) {
      setContent(apiContent);
    } else {
      const savedContent = localStorage.getItem('dashboardContent');
      if (savedContent) {
        try {
          const parsed = JSON.parse(savedContent);
          setContent(parsed);
        } catch (e) {
          console.error('Failed to parse saved content');
        }
      }
    }
  }, [apiContent]);

  const applyManualOverrides = useCallback((apiData: MarketData, manual: ManualMarketData | undefined): MarketData => {
    if (!manual) return apiData;
    
    return {
      usdkrw: manual.usdkrw?.enabled && manual.usdkrw.value 
        ? { value: manual.usdkrw.value, change: manual.usdkrw.change, loading: false }
        : apiData.usdkrw,
      gold: manual.gold?.enabled && manual.gold.value 
        ? { value: manual.gold.value, change: manual.gold.change, loading: false }
        : apiData.gold,
      spy: manual.spy?.enabled && manual.spy.value 
        ? { value: manual.spy.value, change: manual.spy.change, loading: false }
        : apiData.spy,
      bitcoin: manual.bitcoin?.enabled && manual.bitcoin.value 
        ? { value: manual.bitcoin.value, change: manual.bitcoin.change, loading: false }
        : apiData.bitcoin,
      nasdaq: manual.nasdaq?.enabled && manual.nasdaq.value 
        ? { value: manual.nasdaq.value, change: manual.nasdaq.change, loading: false }
        : apiData.nasdaq,
      kodex200: manual.kodex200?.enabled && manual.kodex200.value 
        ? { value: manual.kodex200.value, change: manual.kodex200.change, loading: false }
        : apiData.kodex200,
      fearGreed: manual.fearGreed?.enabled && manual.fearGreed.value 
        ? { value: manual.fearGreed.value, status: manual.fearGreed.status, loading: false }
        : apiData.fearGreed,
      scfi: manual.scfi?.enabled && manual.scfi.value 
        ? { value: manual.scfi.value, change: manual.scfi.change, loading: false }
        : apiData.scfi,
    };
  }, []);

  const currentMarketData = applyManualOverrides(
    marketData || initialMarketData, 
    content.manualMarketData
  );

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      <HeroSection 
        date={currentDate} 
        title={content.heroTitle || ''} 
        subtitle={content.heroSubtitle || ''} 
        availableDates={availableDates}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <SummarySection summaries={content.summaries} />
        <ScheduleSection ipos={content.ipos} realEstates={content.realEstates} />
        <NewsSection news={content.news} />
        <TodoSection todos={content.todos} />
        <MarketSection 
          marketData={currentMarketData} 
          isLoading={isLoading} 
          isFetching={isFetching}
          onRefresh={() => refetch()}
          title={content.marketSectionTitle || ''}
          refreshNote={content.marketRefreshNote || ''}
        />
        <ThoughtsSection thoughts={content.thoughts || []} />
        <QuoteSection quote={content.quote} />
        <ClosingSection 
          closingMessage={content.closingMessage || ''} 
          closingSubMessage={content.closingSubMessage || ''}
          subscribeButtonText={content.subscribeButtonText || ''}
        />
      </main>
      
      <Footer 
        hashtags={content.hashtags || []} 
        footerText={content.footerText || ''} 
      />
    </div>
  );
}
