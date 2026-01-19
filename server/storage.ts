import { type User, type InsertUser, type Subscriber, type RoutineArticle, type Article, type PageType, type DashboardContent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSubscribers(): Promise<Subscriber[]>;
  addSubscriber(name: string, email: string): Promise<Subscriber>;
  removeSubscriber(id: string): Promise<boolean>;
  getRoutineArticles(category?: string): Promise<RoutineArticle[]>;
  getRoutineArticle(id: string): Promise<RoutineArticle | undefined>;
  createRoutineArticle(article: Omit<RoutineArticle, 'id'>): Promise<RoutineArticle>;
  updateRoutineArticle(id: string, article: Partial<Omit<RoutineArticle, 'id'>>): Promise<RoutineArticle | undefined>;
  deleteRoutineArticle(id: string): Promise<boolean>;
  getArticles(pageType: PageType, category?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: Omit<Article, 'id'>): Promise<Article>;
  updateArticle(id: string, article: Partial<Omit<Article, 'id'>>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getDashboardContent(date: string): Promise<DashboardContent | undefined>;
  saveDashboardContent(date: string, content: DashboardContent): Promise<DashboardContent>;
  getAvailableDates(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscribers: Map<string, Subscriber>;
  private routineArticles: Map<string, RoutineArticle>;
  private articles: Map<string, Article>;
  private dashboardContents: Map<string, DashboardContent>;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
    this.routineArticles = new Map();
    this.articles = new Map();
    this.dashboardContents = new Map();
    this.seedDefaultArticles();
    this.seedDefaultPageArticles();
    this.seedDefaultDashboardContent();
  }

  private seedDefaultArticles() {
    const defaultArticles: RoutineArticle[] = [
      {
        id: '1',
        title: '2026년 1월 투자 결산',
        summary: '연초 계획대로 진행한 투자 현황과 배운 점들을 정리합니다.',
        content: '2026년 1월의 투자 결산입니다. 이번 달에는 공모주 청약과 부동산 시장 분석에 집중했습니다...',
        category: 'monthly',
        date: '2026-01-15',
        readTime: 5,
        views: 234,
        featured: true
      },
      {
        id: '2',
        title: '워킹맘의 하루 루틴 공개',
        summary: '육아와 직장, 그리고 투자까지. 시간 관리의 비밀을 공개합니다.',
        content: '많은 분들이 어떻게 시간을 관리하냐고 물어보세요. 솔직히 처음에는 정말 힘들었어요...',
        category: 'routine',
        date: '2026-01-10',
        readTime: 7,
        views: 456,
        featured: true
      },
      {
        id: '3',
        title: '첫 분양권 투자 실패담',
        summary: '처음 투자에서 배운 값비싼 교훈을 솔직하게 공유합니다.',
        content: '투자를 시작하고 처음 겪은 실패 이야기입니다. 지금 생각하면 왜 그랬을까 싶지만...',
        category: 'failure',
        date: '2026-01-05',
        readTime: 6,
        views: 789,
        featured: false
      },
      {
        id: '4',
        title: '지방에서 서울로, 갈아타기 성공기',
        summary: '5년간의 투자 여정과 서울 입성까지의 이야기',
        content: '지방 아파트에서 시작해서 서울로 갈아타기까지의 여정을 공유합니다...',
        category: 'gap',
        date: '2026-01-01',
        readTime: 10,
        views: 1234,
        featured: true
      }
    ];
    defaultArticles.forEach(article => {
      this.routineArticles.set(article.id, article);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).sort(
      (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
    );
  }

  async addSubscriber(name: string, email: string): Promise<Subscriber> {
    const existing = Array.from(this.subscribers.values()).find(s => s.email === email);
    if (existing) {
      return existing;
    }
    const id = randomUUID();
    const subscriber: Subscriber = {
      id,
      name,
      email,
      subscribedAt: new Date().toISOString(),
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async removeSubscriber(id: string): Promise<boolean> {
    return this.subscribers.delete(id);
  }

  async getRoutineArticles(category?: string): Promise<RoutineArticle[]> {
    const articles = Array.from(this.routineArticles.values());
    const filtered = category 
      ? articles.filter(a => a.category === category)
      : articles;
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRoutineArticle(id: string): Promise<RoutineArticle | undefined> {
    return this.routineArticles.get(id);
  }

  async createRoutineArticle(article: Omit<RoutineArticle, 'id'>): Promise<RoutineArticle> {
    const id = randomUUID();
    const newArticle: RoutineArticle = { ...article, id };
    this.routineArticles.set(id, newArticle);
    return newArticle;
  }

  async updateRoutineArticle(id: string, updates: Partial<Omit<RoutineArticle, 'id'>>): Promise<RoutineArticle | undefined> {
    const existing = this.routineArticles.get(id);
    if (!existing) return undefined;
    const updated: RoutineArticle = { ...existing, ...updates };
    this.routineArticles.set(id, updated);
    return updated;
  }

  async deleteRoutineArticle(id: string): Promise<boolean> {
    return this.routineArticles.delete(id);
  }

  private seedDefaultPageArticles() {
    const defaultArticles: Article[] = [
      {
        id: 're-1',
        pageType: 'real-estate',
        title: '2026년 수도권 아파트 시장 전망',
        summary: '올해 수도권 부동산 시장은 어떻게 될까요? 금리, 공급, 정책 변화를 종합적으로 분석합니다.',
        content: '2026년 수도권 아파트 시장에 대한 상세 분석입니다...',
        category: 'buy',
        date: '2026-01-19',
        readTime: 7,
        views: 3240,
        featured: true,
        isPinned: true
      },
      {
        id: 're-2',
        pageType: 'real-estate',
        title: '청약 가점 계산하는 법',
        summary: '청약 가점제의 구성요소와 계산 방법을 상세히 알려드립니다.',
        content: '청약 가점제에 대한 완벽 가이드입니다...',
        category: 'subscription',
        date: '2026-01-18',
        readTime: 5,
        views: 4120,
        featured: true,
        isPinned: true
      },
      {
        id: 're-3',
        pageType: 'real-estate',
        title: '전세 사기 피하는 체크리스트',
        summary: '전세 계약 전 반드시 확인해야 할 10가지.',
        content: '전세 사기를 피하는 방법을 상세히 설명합니다...',
        category: 'rent',
        date: '2026-01-16',
        readTime: 6,
        views: 5670,
        featured: true,
        isPinned: true
      },
      {
        id: 're-4',
        pageType: 'real-estate',
        title: '취득세 절감 전략',
        summary: '부동산 취득 시 세금을 줄이는 합법적인 방법들.',
        content: '취득세 절감에 대한 상세 가이드입니다...',
        category: 'tax',
        date: '2026-01-10',
        readTime: 8,
        views: 2890,
        featured: false,
        isPinned: false
      },
      {
        id: 'inv-1',
        pageType: 'invest',
        title: '초보자를 위한 주식 시작하기',
        summary: '주식 투자를 처음 시작하는 분들을 위한 완벽 가이드.',
        content: '주식 투자의 기초부터 실전까지 알려드립니다...',
        category: 'stock',
        date: '2026-01-19',
        readTime: 7,
        views: 4520,
        featured: true,
        isPinned: true
      },
      {
        id: 'inv-2',
        pageType: 'invest',
        title: '부동산 리츠 추천 TOP 5',
        summary: '소액으로 부동산에 투자하는 방법, 리츠!',
        content: '추천 리츠 상품에 대한 상세 분석입니다...',
        category: 'reit-etf',
        date: '2026-01-18',
        readTime: 5,
        views: 3120,
        featured: true,
        isPinned: true
      },
      {
        id: 'inv-3',
        pageType: 'invest',
        title: '배당주로 월 30만원 만들기',
        summary: '배당투자로 월급 외 수입 만들기.',
        content: '배당 투자 전략에 대한 상세 가이드입니다...',
        category: 'dividend',
        date: '2026-01-16',
        readTime: 7,
        views: 5670,
        featured: true,
        isPinned: true
      },
      {
        id: 'inv-4',
        pageType: 'invest',
        title: '나만의 포트폴리오 구성하기',
        summary: '자산배분의 기본 원칙과 실전 포트폴리오 예시.',
        content: '포트폴리오 구성에 대한 상세 가이드입니다...',
        category: 'portfolio',
        date: '2026-01-12',
        readTime: 8,
        views: 2340,
        featured: false,
        isPinned: false
      }
    ];
    defaultArticles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }

  async getArticles(pageType: PageType, category?: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values()).filter(a => a.pageType === pageType);
    const filtered = category 
      ? articles.filter(a => a.category === category)
      : articles;
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const id = randomUUID();
    const newArticle: Article = { ...article, id };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticle(id: string, updates: Partial<Omit<Article, 'id'>>): Promise<Article | undefined> {
    const existing = this.articles.get(id);
    if (!existing) return undefined;
    const updated: Article = { ...existing, ...updates };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  private seedDefaultDashboardContent() {
    const today = new Date();
    const dates = [
      new Date(today),
      new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    ];

    dates.forEach((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      const content: DashboardContent = {
        date: dateStr,
        heroTitle: '하루 5분으로 시작하는 재테크',
        heroSubtitle: '공모주 청약부터 부동산 뉴스, 놓치기 쉬운 정책 정보까지!',
        summaries: [
          { id: '1', text: index === 0 ? '공모주 (세미파이브) 청약시작 (청약하세요)' : `${dateStr} 주요 요약 1` },
          { id: '2', text: index === 0 ? '역삼 센트럴 자이 청약 마지막날' : `${dateStr} 주요 요약 2` },
          { id: '3', text: index === 0 ? '환율 1480원 돌파' : `${dateStr} 주요 요약 3` },
        ],
        ipos: [
          {
            id: '1',
            name: index === 0 ? '세미파이브' : `샘플기업 ${index}`,
            score: 71 - index * 5,
            period: `${date.getMonth() + 1}/${date.getDate()}~${date.getMonth() + 1}/${date.getDate() + 1}`,
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
            name: index === 0 ? '역삼 센트럴 자이' : `샘플 아파트 ${index}`,
            location: '서울 강남구',
            units: 340,
            period: `${date.getMonth() + 1}/${date.getDate()}~${date.getMonth() + 1}/${date.getDate() + 2}`,
            priority: '1순위',
            type: 'apartment',
          },
        ],
        news: [
          {
            id: '1',
            title: index === 0 ? 'Fed 금리 동결 시사' : `${dateStr} 뉴스 1`,
            summary: index === 0 ? '미국 연준이 당분간 금리를 동결할 것이라는 시사를 했습니다.' : `${dateStr}의 주요 금융 뉴스입니다.`,
            url: 'https://example.com',
          },
        ],
        todos: [
          {
            id: '1',
            title: index === 0 ? '공모주 청약 확인' : `${dateStr} 할 일`,
            description: index === 0 ? '세미파이브 청약 마감 전 확인하기' : `${dateStr}에 해야 할 일입니다.`,
          },
        ],
        thoughts: [
          {
            id: '1',
            title: '오늘의 생각',
            content: index === 0 ? '장기적인 관점에서 투자하세요.' : `${dateStr}의 생각입니다.`,
          },
        ],
        marketSectionTitle: '주요 항목 시세 CHECK',
        marketRefreshNote: '5분 마다 자동 새로고침',
        closingMessage: '오늘도 당신의 재테크를 응원합니다!',
        closingSubMessage: '매일 아침 돈루틴과 함께하세요',
        subscribeButtonText: '뉴스레터 구독하기',
        quote: {
          text: index === 0 ? '부는 인내하는 자에게 온다.' : '매일 조금씩 성장하는 것이 중요합니다.',
          author: index === 0 ? '워렌 버핏' : '쿠쿠',
        },
        hashtags: ['#재테크', '#공모주', '#부동산', '#투자'],
        footerText: '쿠쿠의 돈루틴과 함께 성공적인 재테크를 시작하세요!',
      };
      this.dashboardContents.set(dateStr, content);
    });
  }

  async getDashboardContent(date: string): Promise<DashboardContent | undefined> {
    return this.dashboardContents.get(date);
  }

  async saveDashboardContent(date: string, content: DashboardContent): Promise<DashboardContent> {
    const contentWithDate = { ...content, date };
    this.dashboardContents.set(date, contentWithDate);
    return contentWithDate;
  }

  async getAvailableDates(): Promise<string[]> {
    return Array.from(this.dashboardContents.keys()).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }
}

export const storage = new MemStorage();
