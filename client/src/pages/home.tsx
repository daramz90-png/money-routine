import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Coins, BarChart3, Bitcoin, LineChart, Building2, Gauge, Ship, Check, Calendar, Newspaper, ListTodo, Lightbulb, Quote, Bell } from 'lucide-react';
import type { MarketData, FearGreedData } from '@shared/schema';
import { initialMarketData } from '@shared/schema';

function MarketCard({ 
  name, 
  value, 
  unit, 
  change, 
  loading, 
  isWeekly = false,
  icon: Icon
}: { 
  name: string; 
  value: string; 
  unit: string; 
  change: number; 
  loading: boolean; 
  isWeekly?: boolean;
  icon?: React.ElementType;
}) {
  const isUp = change > 0;
  
  return (
    <Card className="p-5 hover-elevate active-elevate-2 transition-all duration-200 relative bg-card" data-testid={`card-market-${name.toLowerCase().replace(/\s/g, '-')}`}>
      {isWeekly && (
        <div className="absolute top-2 right-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
          주간
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{name}</span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24 mb-2 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
      ) : (
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
      )}
      {unit && <div className="text-xs text-muted-foreground mb-2">{unit}</div>}
      {!loading && change !== 0 && (
        <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-flex flex-wrap items-center gap-1 ${
          isUp ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400'
        }`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
      )}
    </Card>
  );
}

function FearGreedCard({ data }: { data: FearGreedData }) {
  const getFearGreedColor = (value: string) => {
    const num = parseInt(value);
    if (num < 25) return 'text-red-500';
    if (num < 45) return 'text-orange-500';
    if (num < 55) return 'text-green-500';
    if (num < 75) return 'text-blue-500';
    return 'text-purple-500';
  };

  const getFearGreedBgColor = (value: string) => {
    const num = parseInt(value);
    if (num < 25) return 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400';
    if (num < 45) return 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400';
    if (num < 55) return 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400';
    if (num < 75) return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
    return 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400';
  };

  return (
    <Card className="p-5 hover-elevate active-elevate-2 transition-all duration-200 bg-card" data-testid="card-fear-greed">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
        <Gauge className="w-4 h-4" />
        <span>공포/탐욕 지수</span>
      </div>
      {data.loading ? (
        <Skeleton className="h-8 w-16 mb-2 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
      ) : (
        <div className={`text-3xl font-bold mb-2 ${getFearGreedColor(data.value)}`}>
          {data.value}
        </div>
      )}
      {data.loading ? (
        <Skeleton className="h-6 w-20 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
      ) : (
        <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${getFearGreedBgColor(data.value)}`}>
          {data.status}
        </div>
      )}
    </Card>
  );
}

function InfoCard({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <Card className="p-5 bg-card/50 hover-elevate active-elevate-2" data-testid={`card-info-${title.slice(0, 10)}`}>
      <div className="flex flex-wrap gap-2">
        <div className="w-1 bg-gradient-to-b from-primary to-primary/60 rounded flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="font-bold mb-2 text-foreground">{title}</div>
          <div className="text-muted-foreground">{content}</div>
        </div>
      </div>
    </Card>
  );
}

function NewsCard({ source, title, summary }: { source: string; title: string; summary: string }) {
  return (
    <Card className="p-5 hover-elevate active-elevate-2 transition-all bg-card" data-testid={`card-news-${title.slice(0, 10)}`}>
      <div className="font-semibold mb-2 text-foreground">{source}</div>
      <div className="font-bold text-foreground mb-2">{title}</div>
      <div className="text-muted-foreground text-sm">{summary}</div>
    </Card>
  );
}

function SummaryCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <Card className="p-4 shadow-sm hover-elevate active-elevate-2 transition-all bg-card" data-testid={`card-summary-${index}`}>
      <div className="flex flex-wrap gap-2">
        <div className="w-1 bg-gradient-to-b from-primary to-primary/60 rounded flex-shrink-0"></div>
        <div className="flex-1 min-w-0 flex flex-wrap items-start gap-2">
          <span className="flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </span>
          <span className="text-foreground flex-1 min-w-0">{children}</span>
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex flex-wrap items-center gap-2 text-foreground">
      <span className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded"></span>
      {Icon && <Icon className="w-6 h-6 text-muted-foreground" />}
      <span>{children}</span>
    </h2>
  );
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const { data: marketData, isLoading, isFetching, refetch } = useQuery<MarketData>({
    queryKey: ['/api/market-data'],
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });

  const formatDate = useCallback(() => {
    const today = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${days[today.getDay()]}요일)`;
  }, []);

  useEffect(() => {
    setCurrentDate(formatDate());
  }, [formatDate]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      const now = new Date();
      setLastUpdate(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [isLoading, isFetching, marketData]);

  const handleRefresh = async () => {
    await refetch();
  };

  const currentMarketData = marketData || initialMarketData;

  const summaryItems = [
    '2차 민생회복 소비쿠폰 마감일! 국민 90%에 10만 원 쿠폰 지급!!!',
    '코스피, 이번 주 사상 최고권 유지 (장중 4100 돌파·종가 최고 경신 중)',
    '오늘 마감: 9월분 간이지급명세서·용역제공 과세자료 제출 D-day'
  ];

  const newsItems = [
    {
      source: '매일경제',
      title: '美·中 무역전쟁 \'해빙\'… 관세·희토류 맞교환',
      summary: 'APEC 정상 부산 회담서 \'관세 10%↓·희토류 공급 재개\' 합의'
    },
    {
      source: '매일경제',
      title: '현대차, 3분기 관세 손해 1.8조… 최대 매출에도 영업이익 29%↓',
      summary: '역대 최대 매출에도 불구하고 관세 부담으로 영업이익 감소'
    },
    {
      source: '서울경제',
      title: '엔비디아 돕는 삼성… HBM4 치킨게임 예고',
      summary: '삼성전자, 엔비디아에 HBM3E 12단 공급 개시. 6세대 HBM4 생산 준비'
    }
  ];

  const todoItems = [
    '소비쿠폰 대상이라면 18시 이전 신청 완료할 것!',
    '세금납부 D-day 10월 31일 납부기한 확인 후 지연 없도록 재확인',
    '투자자는 단기 차익실현 및 자산 비중 리밸런싱 점검!!!'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/80 to-primary dark:from-primary/60 dark:to-primary/90 p-3 sm:p-5">
      <div className="max-w-4xl mx-auto bg-background rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        <header className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 sm:p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 relative z-10 flex items-center justify-center gap-2" data-testid="text-title">
            <Coins className="w-8 h-8 sm:w-10 sm:h-10" />
            쿠쿠의 돈루틴
          </h1>
          <p className="text-base sm:text-lg opacity-95 relative z-10">하루 5분이면 충분합니다</p>
          <div className="mt-4 inline-block bg-primary-foreground/20 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base" data-testid="text-date">
            {currentDate}
          </div>
          {lastUpdate && (
            <div className="mt-2 text-sm opacity-80" data-testid="text-last-update">
              마지막 업데이트: {lastUpdate}
            </div>
          )}
        </header>

        <div className="p-4 sm:p-8">
          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0s' }}>
            <SectionHeader icon={Check}>오늘의 3줄 요약</SectionHeader>
            <div className="space-y-3">
              {summaryItems.map((item, i) => (
                <SummaryCard key={i} index={i}>{item}</SummaryCard>
              ))}
            </div>
          </section>

          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <SectionHeader icon={BarChart3}>실시간 주요 시세 CHECK</SectionHeader>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MarketCard 
                name="달러 환율"
                value={currentMarketData.usdkrw.value}
                unit="원/$"
                change={currentMarketData.usdkrw.change}
                loading={isLoading || currentMarketData.usdkrw.loading}
                icon={DollarSign}
              />
              <MarketCard 
                name="금 (Gold)"
                value={currentMarketData.gold.value}
                unit="원/g"
                change={currentMarketData.gold.change}
                loading={isLoading || currentMarketData.gold.loading}
                icon={Coins}
              />
              <MarketCard 
                name="SPY"
                value={currentMarketData.spy.value}
                unit="$"
                change={currentMarketData.spy.change}
                loading={isLoading || currentMarketData.spy.loading}
                icon={BarChart3}
              />
              <MarketCard 
                name="비트코인"
                value={currentMarketData.bitcoin.value}
                unit="원"
                change={currentMarketData.bitcoin.change}
                loading={isLoading || currentMarketData.bitcoin.loading}
                icon={Bitcoin}
              />
              <MarketCard 
                name="NDAQ (나스닥)"
                value={currentMarketData.nasdaq.value}
                unit="$"
                change={currentMarketData.nasdaq.change}
                loading={isLoading || currentMarketData.nasdaq.loading}
                icon={LineChart}
              />
              <MarketCard 
                name="KODEX 200"
                value={currentMarketData.kodex200.value}
                unit="원"
                change={currentMarketData.kodex200.change}
                loading={isLoading || currentMarketData.kodex200.loading}
                icon={Building2}
              />
              <FearGreedCard data={isLoading ? { ...currentMarketData.fearGreed, loading: true } : currentMarketData.fearGreed} />
              <MarketCard 
                name="SCFI (운임지수)"
                value={currentMarketData.scfi.value}
                unit="포인트"
                change={currentMarketData.scfi.change}
                loading={isLoading || currentMarketData.scfi.loading}
                isWeekly={true}
                icon={Ship}
              />
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              * SCFI는 매주 금요일 업데이트됩니다 | 데이터는 5분마다 자동 갱신됩니다
            </div>
          </section>

          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <SectionHeader icon={Calendar}>오늘의 재테크 일정</SectionHeader>
            <div className="space-y-4">
              <InfoCard title="공모주" content="없음" />
              <InfoCard 
                title="청약 (수도권청약)" 
                content={
                  <div>
                    <div>경기: 부천아이테라자이</div>
                    <div className="text-sm text-muted-foreground ml-0">(부천과안지구 B-2블록, 3세대) - 10/31</div>
                  </div>
                } 
              />
              <InfoCard 
                title="정책 일정" 
                content="DSR 강화(10/29), 국세 체납자 실태 전수조사 본격화 (내년 3월~)" 
              />
              <InfoCard 
                title="세금 일정" 
                content={
                  <div>
                    <div>오늘(10/31) 마감: 간이지급명세서, 일용근로소득 지급명세서</div>
                    <div className="text-destructive font-semibold mt-1">→ 제출 지연 시 가산세 2% + 세무조사 대상 가능성</div>
                  </div>
                } 
              />
            </div>
          </section>

          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <SectionHeader icon={Newspaper}>오늘의 뉴스픽</SectionHeader>
            <div className="space-y-3">
              {newsItems.map((news, i) => (
                <NewsCard 
                  key={i}
                  source={`${news.source}`}
                  title={news.title}
                  summary={news.summary}
                />
              ))}
            </div>
          </section>

          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <SectionHeader icon={ListTodo}>오늘 해야하는 것!!!</SectionHeader>
            <div className="space-y-3">
              {todoItems.map((item, i) => (
                <div key={i} className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white p-5 rounded-xl shadow-lg font-semibold flex flex-wrap items-start gap-2" data-testid={`card-todo-${i}`}>
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1 min-w-0">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <SectionHeader icon={Lightbulb}>오늘 쿠쿠의 생각</SectionHeader>
            <Card className="p-6 bg-card/50">
              <div className="flex flex-wrap gap-2">
                <div className="w-1 bg-gradient-to-b from-primary to-primary/60 rounded flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold mb-3 text-foreground flex flex-wrap items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>10월의 마지막날</span>
                  </p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">이번 달은 시장이 유난히 뜨거웠네요. 코스피가 4100선을 돌파했고, 삼성전자는 반도체의 부활을 알리며 시장 심리를 완전히 바꿔놓았습니다.</p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">약간의 단기 과열구간이라고 생각되지만 꾸준히 매수하는 것은 멈추지 않을 계획입니다. 꾸준히 오래 누가 더 버티는가에 싸움을 또 열심히 해야겠습니다.</p>
                  
                  <p className="font-bold mb-3 mt-6 text-foreground flex flex-wrap items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>11월을 맞이하면서</span>
                  </p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">미국에서 금리를 낮추고 갈수록 돈잔치의 분위기로 방향성이 잡히고 있네요. 내가 가지고 있는 자산에 대해서 어느정도는 무관심하게 봐야할때도 있지만 또 시장상황에 맞게 대응해야할 때가 있습니다.</p>
                  <p className="mb-4 leading-relaxed text-muted-foreground">이제 더 펼쳐질 돈잔치를 대비하기 위해 어느정도는 준비를 하실 때라고 생각이 되네요. 11월을 맞이하기 전 오늘 하루, 내 자산의 구조를 한 번 점검해보세요.</p>
                  
                  <p className="text-center font-bold mt-6 text-foreground">오늘도 흔들림 없이, 루틴대로 갑시다</p>
                </div>
              </div>
            </Card>
          </section>

          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 sm:p-8 rounded-xl text-center mb-8 animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <Quote className="w-8 h-8 mx-auto mb-4 opacity-80" />
            <p className="text-lg sm:text-xl italic mb-4 leading-relaxed">
              "시장은 기다리는 자의 것이 아니라,<br />준비된 자의 것이다."
            </p>
            <p className="opacity-90">– 하워드 막스</p>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-red-500 dark:from-pink-600 dark:to-red-600 text-white p-6 sm:p-10 rounded-xl text-center animate-slideUp" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8" />
              매일 아침 돈루틴 받아보기
            </h2>
            <p className="mb-6 text-base sm:text-lg">하루 5분, 당신의 재테크 습관을 바꿔드립니다</p>
            <Button 
              onClick={() => alert('구독 기능은 곧 오픈됩니다!')}
              variant="secondary"
              size="lg"
              className="bg-white text-red-500 font-bold rounded-full shadow-lg"
              data-testid="button-subscribe"
            >
              지금 구독하기
            </Button>
          </div>
        </div>

        <footer className="text-center p-6 sm:p-8 border-t border-border text-muted-foreground">
          <p>© 2024 쿠쿠의 돈루틴. All rights reserved.</p>
          <p className="mt-2 text-sm">루틴으로 미래를 바꾸는 투자자, 쿠쿠입니다</p>
        </footer>
      </div>
    </div>
  );
}
