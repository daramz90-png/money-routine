import { type User, type InsertUser, type Subscriber } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSubscribers(): Promise<Subscriber[]>;
  addSubscriber(name: string, email: string): Promise<Subscriber>;
  removeSubscriber(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private subscribers: Map<string, Subscriber>;

  constructor() {
    this.users = new Map();
    this.subscribers = new Map();
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
}

export const storage = new MemStorage();
