import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface MarketDataItem {
  value: string;
  change: number;
  loading: boolean;
}

export interface FearGreedData {
  value: string;
  status: string;
  loading: boolean;
}

export interface MarketData {
  usdkrw: MarketDataItem;
  gold: MarketDataItem;
  spy: MarketDataItem;
  bitcoin: MarketDataItem;
  nasdaq: MarketDataItem;
  kodex200: MarketDataItem;
  fearGreed: FearGreedData;
  scfi: MarketDataItem;
}

export const initialMarketData: MarketData = {
  usdkrw: { value: '로딩중...', change: 0, loading: true },
  gold: { value: '로딩중...', change: 0, loading: true },
  spy: { value: '로딩중...', change: 0, loading: true },
  bitcoin: { value: '로딩중...', change: 0, loading: true },
  nasdaq: { value: '로딩중...', change: 0, loading: true },
  kodex200: { value: '로딩중...', change: 0, loading: true },
  fearGreed: { value: '50', status: '중립', loading: false },
  scfi: { value: '1,245', change: 0, loading: false }
};

export interface SummaryItem {
  id: string;
  text: string;
}

export interface IPOItem {
  id: string;
  name: string;
  score: number;
  period: string;
  price: string;
  minAmount: string;
  broker: string;
  description: string;
  isHighlight: boolean;
}

export interface RealEstateItem {
  id: string;
  name: string;
  location: string;
  units: number;
  period: string;
  priority: string;
  type: 'apartment' | 'urban';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url?: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
}

export interface ThoughtItem {
  id: string;
  title: string;
  content: string;
}

export interface DashboardContent {
  date: string;
  heroTitle: string;
  heroSubtitle: string;
  summaries: SummaryItem[];
  ipos: IPOItem[];
  realEstates: RealEstateItem[];
  news: NewsItem[];
  todos: TodoItem[];
  thoughts: ThoughtItem[];
  closingMessage: string;
  closingSubMessage: string;
  subscribeButtonText: string;
  quote: {
    text: string;
    author: string;
  };
  hashtags: string[];
  footerText: string;
}

export const defaultContent: DashboardContent = {
  date: '',
  heroTitle: '하루 5분으로 시작하는 재테크',
  heroSubtitle: '공모주 청약부터 부동산 뉴스, 놓치기 쉬운 정책 정보까지!',
  summaries: [
    { id: '1', text: '공모주 (세미파이브) 청약시작 (청약하세요)' },
    { id: '2', text: '역삼 센트럴 자이 청약 마지막날 (2순위 청약일)' },
    { id: '3', text: '환율 1480원 돌파' },
  ],
  ipos: [
    {
      id: '1',
      name: '세미파이브',
      score: 71,
      period: '12/18~12/19',
      price: '24,000원',
      minAmount: '12만원',
      broker: '삼성증권',
      description: '반도체 설계 자동화 솔루션 기업',
      isHighlight: true,
    },
  ],
  realEstates: [
    {
      id: '1',
      name: '역삼 센트럴 자이',
      location: '역삼',
      units: 87,
      period: '12/15~18',
      priority: '2순위',
      type: 'apartment',
    },
    {
      id: '2',
      name: '라비움 한강',
      location: '마포',
      units: 165,
      period: '12/18~',
      priority: '1순위',
      type: 'apartment',
    },
  ],
  news: [
    {
      id: '1',
      title: '빚갚기 급급…투자용 회사채 3%뿐',
      summary: '기업들의 자금조달 현황과 투자심리 위축 분석',
    },
    {
      id: '2',
      title: '계엄 때로 돌아간 환율에 외환당국 긴급대책',
      summary: '환율 급등에 따른 정부의 긴급 대응책 발표',
    },
    {
      id: '3',
      title: '환율 장중 1480원 돌파… 외환스와프 가동',
      summary: '원/달러 환율 급등세에 한미 통화스와프 발동 검토',
    },
  ],
  todos: [
    {
      id: '1',
      title: '세미파이브 청약하기',
      description: '삼성증권 계좌 있으신 분들은 무조건 청약하세요! 12만원',
    },
    {
      id: '2',
      title: '연말정산 기부금/공제항목 체크하기',
      description: '연말정산 시즌 대비 공제항목 미리 점검',
    },
  ],
  thoughts: [
    {
      id: '1',
      title: '10월의 마지막날',
      content: '이번 달은 시장이 유난히 뜨거웠네요. 코스피가 4100선을 돌파했고, 삼성전자는 반도체의 부활을 알리며 시장 심리를 완전히 바꿔놓았습니다.\n\n약간의 단기 과열구간이라고 생각되지만 꾸준히 매수하는 것은 멈추지 않을 계획입니다. 꾸준히 오래 누가 더 버티는가에 싸움을 또 열심히 해야겠습니다.',
    },
    {
      id: '2',
      title: '11월을 맞이하면서',
      content: '미국에서 금리를 낮추고 갈수록 돈잔치의 분위기로 방향성이 잡히고 있네요. 내가 가지고 있는 자산에 대해서 어느정도는 무관심하게 봐야할때도 있지만 또 시장상황에 맞게 대응해야할 때가 있습니다.\n\n이제 더 펼쳐질 돈잔치를 대비하기 위해 어느정도는 준비를 하실 때라고 생각이 되네요. 11월을 맞이하기 전 오늘 하루, 내 자산의 구조를 한 번 점검해보세요.',
    },
  ],
  closingMessage: '오늘도 흔들림 없이, 루틴대로 갑시다',
  closingSubMessage: '오늘도 화이팅입니다 ^^',
  subscribeButtonText: '이웃추가하고 돈되는 루틴 받기',
  quote: {
    text: '위기는 언제나 기회와 함께 온다.',
    author: '존 F. 케네디',
  },
  hashtags: ['재테크루틴', '경제뉴스요약', '공모주청약', '투자공부', '부동산청약', '환율', '연말정산', '돈공부'],
  footerText: '하루 5분으로 시작하는 재테크 루틴',
};
