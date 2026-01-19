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
