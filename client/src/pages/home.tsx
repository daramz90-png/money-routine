import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  BarChart3,
  Bitcoin,
  LineChart,
  Building2,
  Gauge,
  Ship,
  Check,
  Calendar,
  Newspaper,
  ListTodo,
  Quote,
  Bell,
  Clock,
  ChartLine,
  Star,
  ExternalLink,
  MessageCircle,
  CheckSquare,
  Building,
  ChevronLeft,
  ChevronRight,
  Camera,
  Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import type {
  MarketData,
  FearGreedData,
  DashboardContent,
  ManualMarketData,
} from "@shared/schema";
import {
  initialMarketData,
  defaultContent,
  defaultManualMarketData,
} from "@shared/schema";
import { SharedHeader } from "@/components/shared-header";

function HeroSection({
  date,
  title,
  subtitle,
  availableDates = [],
  selectedDate,
  onDateChange,
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
  const canGoPrev =
    currentIndex >= 0 && currentIndex < safeAvailableDates.length - 1;
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
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
  };

  const isToday =
    safeAvailableDates.length === 0 || selectedDate === safeAvailableDates[0];

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-12 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-base font-medium mb-4">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          LIVE 실시간 금융 데이터
        </div>
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight"
          data-testid="text-hero-title"
        >
          {title || "하루 5분으로 시작하는 재테크"}
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          {subtitle ||
            "공모주 청약부터 부동산 뉴스, 놓치기 쉬운 정책 정보까지!"}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={!canGoPrev}
            className="text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 border border-slate-700"
            data-testid="button-prev-date"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div
            className="inline-flex flex-wrap items-center gap-2 bg-slate-800/80 border border-slate-700 backdrop-blur-sm px-5 py-2.5 rounded-lg"
            data-testid="text-date"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-white">
              {selectedDate ? formatDateKorean(selectedDate) : date}
            </span>
            {!isToday && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-2">
                지난 호
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className="text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 border border-slate-700"
            data-testid="button-next-date"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {safeAvailableDates.length > 1 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {safeAvailableDates.slice(0, 7).map((d) => (
              <button
                key={d}
                onClick={() => onDateChange(d)}
                className={`px-3 py-1.5 rounded-md text-base transition-all ${
                  d === selectedDate
                    ? "bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/25"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
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

function SummarySection({
  summaries,
}: {
  summaries: { id: string; text: string }[];
}) {
  return (
    <section className="py-8" id="summary">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-emerald-400 border border-slate-700">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            오늘의 주요 요약
          </h2>
          <p className="text-base text-muted-foreground">Today's Key Points</p>
        </div>
      </div>
      <Card className="p-0 shadow-lg border border-slate-200 dark:border-slate-800 bg-card overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {summaries.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-wrap items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              data-testid={`summary-${item.id}`}
            >
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold text-base">
                {index + 1}
              </div>
              <span className="text-foreground text-lg flex-1 min-w-0 leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function IPOCard({ ipo }: { ipo: any }) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all ${ipo.isHighlight ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"}`}
      data-testid={`ipo-${ipo.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h4 className="text-lg font-bold text-foreground">{ipo.name}</h4>
        <div className="flex items-center gap-2">
          {ipo.isHighlight && (
            <Badge className="bg-red-500 text-white text-sm">
              <Star className="w-3 h-3 mr-1" />
              청약
            </Badge>
          )}
          <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {ipo.score}점
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-base mb-3">
        <div>
          <span className="text-muted-foreground text-sm">청약기간</span>
          <p className="font-medium text-foreground">{ipo.period}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">공모가</span>
          <p className="font-medium text-foreground">{ipo.price}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">최소금액</span>
          <p className="font-medium text-foreground">{ipo.minAmount}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-sm">증권사</span>
          <p className="font-medium text-foreground">{ipo.broker}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground border-t border-slate-200 dark:border-slate-700 pt-2">
        {ipo.description}
      </p>
    </div>
  );
}

function RealEstateCard({ item }: { item: any }) {
  return (
    <div
      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
      data-testid={`realestate-${item.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-foreground text-base">{item.name}</h4>
        <Badge
          variant="outline"
          className="text-sm border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400"
        >
          {item.priority}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">위치</span>
          <p className="text-foreground font-medium">{item.location}</p>
        </div>
        <div>
          <span className="text-muted-foreground">세대수</span>
          <p className="text-foreground font-medium">{item.units}세대</p>
        </div>
        <div>
          <span className="text-muted-foreground">기간</span>
          <p className="text-foreground font-medium">{item.period}</p>
        </div>
      </div>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
          data-testid={`realestate-link-${item.id}`}
        >
          <ExternalLink className="w-3 h-3" />
          청약하는 곳 위치 확인하기
        </a>
      )}
    </div>
  );
}

function ScheduleSection({
  ipos,
  realEstates,
  ipoOpinion,
}: {
  ipos: any[];
  realEstates: any[];
  ipoOpinion?: string;
}) {
  const apartments = realEstates.filter((r) => r.type === "apartment");
  const urban = realEstates.filter((r) => r.type === "urban");

  return (
    <section className="py-8" id="schedule">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-emerald-400 border border-slate-700">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            오늘의 재테크 일정
          </h2>
          <p className="text-base text-muted-foreground">
            Today's Investment Schedule
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 shadow-lg border border-slate-200 dark:border-slate-800 bg-card">
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">공모주 청약</h3>
            <span className="ml-auto text-sm text-muted-foreground">IPO</span>
          </div>
          <div className="space-y-3">
            {ipos.length > 0 ? (
              ipos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo} />)
            ) : (
              <p className="text-muted-foreground text-center py-6 text-base">
                오늘 공모주 청약 일정이 없습니다
              </p>
            )}
          </div>

          {ipoOpinion && (
            <div
              className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
              data-testid="ipo-opinion-section"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1">
                    쿠쿠의 의견
                  </h4>
                  <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {ipoOpinion}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5 shadow-lg border border-slate-200 dark:border-slate-800 bg-card">
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">부동산 청약</h3>
            <a
              href="https://www.applyhome.co.kr/co/coa/selectMainView.do"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
              data-testid="link-applyhome"
            >
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-pointer text-sm">
                <ExternalLink className="w-3 h-3 mr-1" />
                청약홈
              </Badge>
            </a>
          </div>

          {apartments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                아파트
              </h4>
              <div className="space-y-2">
                {apartments.map((item) => (
                  <RealEstateCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {urban.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                도시형 생활주택
              </h4>
              <div className="space-y-2">
                {urban.map((item) => (
                  <RealEstateCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {apartments.length === 0 && urban.length === 0 && (
            <p className="text-muted-foreground text-center py-6 text-base">
              오늘 부동산 청약 일정이 없습니다
            </p>
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
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-emerald-400 border border-slate-700">
          <Newspaper className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">오늘의 뉴스픽</h2>
          <p className="text-base text-muted-foreground">Today's News Pick</p>
        </div>
      </div>

      <div className="space-y-3">
        {news.map((item) => (
          <Card
            key={item.id}
            className="p-4 shadow-md border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            data-testid={`news-${item.id}`}
          >
            <div className="flex flex-wrap gap-4">
              <div className="w-1 bg-emerald-500 rounded flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-base text-muted-foreground mb-2 line-clamp-2">
                  {item.summary}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-wrap items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm"
                  >
                    기사 보기
                    <ExternalLink className="w-3 h-3" />
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
      <Card className="p-5 shadow-lg border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              오늘 해야하는 것
            </h2>
            <p className="text-base text-amber-600 dark:text-amber-400">
              Action Required
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-amber-200 dark:border-amber-800/50"
              data-testid={`todo-${todo.id}`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <CheckSquare className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-base mb-0.5">
                    {todo.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {todo.description}
                  </p>
                </div>
              </div>
            </div>
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
  url,
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
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="font-medium">{name}</span>
        {url && <ExternalLink className="w-3 h-3 ml-auto opacity-40" />}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <div className="text-2xl font-bold text-foreground tabular-nums mb-0.5">
          {value}
        </div>
      )}
      {unit && <div className="text-sm text-muted-foreground mb-2">{unit}</div>}
      {!loading && change !== 0 && (
        <div
          className={`inline-flex flex-wrap items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded ${
            isUp
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {isUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>
            {isUp ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
      )}
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <Card
          className="p-4 shadow-md border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          data-testid={`card-market-${name.toLowerCase().replace(/\s/g, "-")}`}
        >
          {cardContent}
        </Card>
      </a>
    );
  }

  return (
    <Card
      className="p-4 shadow-md border border-slate-200 dark:border-slate-800 bg-card"
      data-testid={`card-market-${name.toLowerCase().replace(/\s/g, "-")}`}
    >
      {cardContent}
    </Card>
  );
}

function FearGreedCard({ data, url }: { data: FearGreedData; url?: string }) {
  const getFearGreedStyle = (value: string) => {
    const num = parseInt(value);
    if (num < 25)
      return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/30",
      };
    if (num < 45)
      return {
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/30",
      };
    if (num < 55)
      return {
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
      };
    if (num < 75)
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
      };
    return {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    };
  };

  const style = getFearGreedStyle(data.value);

  const cardContent = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
        <Gauge className="w-4 h-4" />
        <span className="font-medium">CNN 공포지수</span>
        {url && <ExternalLink className="w-3 h-3 ml-auto opacity-40" />}
      </div>
      {data.loading ? (
        <Skeleton className="h-8 w-12 mb-1" />
      ) : (
        <div
          className={`text-3xl font-bold mb-0.5 tabular-nums ${style.color}`}
        >
          {data.value}
        </div>
      )}
      {data.loading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        <div
          className={`inline-block text-sm font-semibold px-2 py-0.5 rounded ${style.bg} ${style.color}`}
        >
          {data.status}
        </div>
      )}
    </>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <Card
          className="p-4 shadow-md border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          data-testid="card-fear-greed"
        >
          {cardContent}
        </Card>
      </a>
    );
  }

  return (
    <Card
      className="p-4 shadow-md border border-slate-200 dark:border-slate-800 bg-card"
      data-testid="card-fear-greed"
    >
      {cardContent}
    </Card>
  );
}

function MarketSection({
  marketData,
  isLoading,
  isFetching,
  onRefresh,
  title,
  refreshNote,
}: {
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
          <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-emerald-400 border border-slate-700">
            <ChartLine className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {title || "주요 항목 시세 CHECK"}
            </h2>
            <p className="text-base text-muted-foreground">
              Real-time Market Data
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="border-slate-300 dark:border-slate-700"
          data-testid="button-refresh"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          새로고침
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          data={
            isLoading
              ? { ...marketData.fearGreed, loading: true }
              : marketData.fearGreed
          }
          url="https://edition.cnn.com/markets/fear-and-greed"
        />
        <MarketCard
          name="SCFI (운임지수)"
          value={marketData.scfi.value}
          unit="포인트"
          change={marketData.scfi.change}
          loading={isLoading || marketData.scfi.loading}
          icon={Ship}
          url="https://m.stock.naver.com/marketindex/transport/.SCFIDXSSE"
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center">
        {refreshNote || "* 데이터는 1분마다 자동 갱신됩니다"}
      </p>
    </section>
  );
}

function ThoughtsSection({
  thoughts,
}: {
  thoughts: { id: string; title: string; content: string }[];
}) {
  return (
    <section className="py-8" id="thoughts">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-emerald-400 border border-slate-700">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            오늘 쿠쿠의 생각
          </h2>
          <p className="text-base text-muted-foreground">Today's Insight</p>
        </div>
      </div>

      <Card className="p-5 shadow-lg border border-slate-200 dark:border-slate-800 bg-card">
        <div className="space-y-5">
          {thoughts.map((thought) => (
            <div key={thought.id} data-testid={`thought-${thought.id}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {thought.title}
                </h3>
              </div>
              <div className="pl-8 space-y-2">
                {thought.content.split("\n\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-center text-lg font-medium text-foreground">
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
      <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
        <div className="text-center relative z-10">
          <Quote className="w-10 h-10 mx-auto mb-3 text-emerald-400/60" />
          <p className="text-xl sm:text-2xl font-medium mb-3 italic leading-relaxed text-slate-100">
            "{quote.text}"
          </p>
          <p className="text-emerald-400 text-base">– {quote.author}</p>
        </div>
      </Card>
    </section>
  );
}

function ClosingSection({
  closingMessage,
  closingSubMessage,
  subscribeButtonText,
}: {
  closingMessage: string;
  closingSubMessage: string;
  subscribeButtonText: string;
}) {
  return (
    <section className="py-8">
      <Card className="p-6 text-center shadow-lg border border-slate-200 dark:border-slate-800 bg-card">
        <p className="text-xl font-medium text-foreground mb-1">
          {closingMessage ||
            "오늘 하루도 차분하게, 그리고 흔들리지 않게 갑시다"}
        </p>
        <p className="text-base text-muted-foreground mb-5">
          {closingSubMessage || "오늘도 화이팅입니다 ^^"}
        </p>
        <Link href="/subscribe">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            data-testid="button-subscribe"
          >
            <Bell className="w-4 h-4 mr-2" />
            {subscribeButtonText || "이웃추가하고 돈되는 루틴 받기"}
          </Button>
        </Link>
      </Card>
    </section>
  );
}

function Footer({
  hashtags,
  footerText,
}: {
  hashtags: string[];
  footerText: string;
}) {
  const defaultHashtags = [
    "재테크루틴",
    "경제뉴스요약",
    "공모주청약",
    "투자공부",
    "부동산청약",
    "환율",
    "연말정산",
    "돈공부",
  ];
  const displayHashtags =
    hashtags && hashtags.length > 0 ? hashtags : defaultHashtags;

  return (
    <footer className="bg-slate-950 text-white py-10 mt-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">쿠쿠의 돈루틴</span>
        </div>
        <p className="text-slate-400 text-base mb-4">
          {footerText || "하루 5분으로 시작하는 재테크 루틴"}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {displayHashtags.map((tag) => (
            <span key={tag} className="text-sm text-emerald-400">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-slate-600 text-sm">
          © 2026 쿠쿠의 돈루틴. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [content, setContent] = useState<DashboardContent>(defaultContent);

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["/api/dashboard/dates"],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: apiContent, isLoading: isLoadingContent } =
    useQuery<DashboardContent>({
      queryKey: ["/api/dashboard", selectedDate],
      enabled: !!selectedDate,
      staleTime: 0,
      refetchOnWindowFocus: true,
    });

  const {
    data: marketData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<MarketData>({
    queryKey: ["/api/market-data"],
    refetchInterval: 1 * 60 * 1000,
    staleTime: 30 * 1000,
  });

  const formatDate = useCallback(() => {
    const today = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
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
      const savedContent = localStorage.getItem("dashboardContent");
      if (savedContent) {
        try {
          const parsed = JSON.parse(savedContent);
          setContent(parsed);
        } catch (e) {
          console.error("Failed to parse saved content");
        }
      }
    }
  }, [apiContent]);

  const applyManualOverrides = useCallback(
    (apiData: MarketData, manual: ManualMarketData | undefined): MarketData => {
      if (!manual) return apiData;

      return {
        usdkrw:
          manual.usdkrw?.enabled && manual.usdkrw.value
            ? {
                value: manual.usdkrw.value,
                change: manual.usdkrw.change,
                loading: false,
              }
            : apiData.usdkrw,
        gold:
          manual.gold?.enabled && manual.gold.value
            ? {
                value: manual.gold.value,
                change: manual.gold.change,
                loading: false,
              }
            : apiData.gold,
        spy:
          manual.spy?.enabled && manual.spy.value
            ? {
                value: manual.spy.value,
                change: manual.spy.change,
                loading: false,
              }
            : apiData.spy,
        bitcoin:
          manual.bitcoin?.enabled && manual.bitcoin.value
            ? {
                value: manual.bitcoin.value,
                change: manual.bitcoin.change,
                loading: false,
              }
            : apiData.bitcoin,
        nasdaq:
          manual.nasdaq?.enabled && manual.nasdaq.value
            ? {
                value: manual.nasdaq.value,
                change: manual.nasdaq.change,
                loading: false,
              }
            : apiData.nasdaq,
        kodex200:
          manual.kodex200?.enabled && manual.kodex200.value
            ? {
                value: manual.kodex200.value,
                change: manual.kodex200.change,
                loading: false,
              }
            : apiData.kodex200,
        fearGreed:
          manual.fearGreed?.enabled && manual.fearGreed.value
            ? {
                value: manual.fearGreed.value,
                status: manual.fearGreed.status,
                loading: false,
              }
            : apiData.fearGreed,
        scfi:
          manual.scfi?.enabled && manual.scfi.value
            ? {
                value: manual.scfi.value,
                change: manual.scfi.change,
                loading: false,
              }
            : apiData.scfi,
      };
    },
    [],
  );

  const currentMarketData = applyManualOverrides(
    marketData || initialMarketData,
    content.manualMarketData,
  );

  const pageRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const isCaptureMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("capture") === "true";

  const handleCapture = async () => {
    if (!pageRef.current) return;
    setIsCapturing(true);

    try {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = pageRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: true,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const svgs = clonedDoc.querySelectorAll("svg");
          svgs.forEach((svg) => {
            svg.setAttribute(
              "width",
              svg.getBoundingClientRect().width.toString(),
            );
            svg.setAttribute(
              "height",
              svg.getBoundingClientRect().height.toString(),
            );
          });
        },
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `쿠쿠의돈루틴_${currentDate}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("고화질 이미지가 저장되었습니다!");
    } catch (e) {
      console.error("Capture failed:", e);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    }
    setIsCapturing(false);
  };

  return (
    <div className="min-h-screen bg-background" ref={pageRef}>
      {!isCaptureMode && <SharedHeader />}
      <HeroSection
        date={currentDate}
        title={content.heroTitle || ""}
        subtitle={content.heroSubtitle || ""}
        availableDates={availableDates}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <SummarySection summaries={content.summaries} />
        <ScheduleSection
          ipos={content.ipos}
          realEstates={content.realEstates}
          ipoOpinion={content.ipoOpinion}
        />
        <NewsSection news={content.news} />
        <TodoSection todos={content.todos} />
        <MarketSection
          marketData={currentMarketData}
          isLoading={isLoading}
          isFetching={isFetching}
          onRefresh={() => refetch()}
          title={content.marketSectionTitle || ""}
          refreshNote={content.marketRefreshNote || ""}
        />
        <ThoughtsSection thoughts={content.thoughts || []} />
        <QuoteSection quote={content.quote} />
        <ClosingSection
          closingMessage={content.closingMessage || ""}
          closingSubMessage={content.closingSubMessage || ""}
          subscribeButtonText={content.subscribeButtonText || ""}
        />
      </main>

      <Footer
        hashtags={content.hashtags || []}
        footerText={content.footerText || ""}
      />

      {isCaptureMode && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden">
          <Button
            onClick={handleCapture}
            disabled={isCapturing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg px-6 py-3 text-lg"
            data-testid="button-capture-page"
          >
            <Download className="w-5 h-5 mr-2" />
            {isCapturing ? "캡처 중..." : "고화질 이미지 저장"}
          </Button>
        </div>
      )}
    </div>
  );
}
