import { type User, type InsertUser, type Subscriber, type RoutineArticle } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscribers: Map<string, Subscriber>;
  private routineArticles: Map<string, RoutineArticle>;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
    this.routineArticles = new Map();
    this.seedDefaultArticles();
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
}

export const storage = new MemStorage();
