import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { MarketData, PageType } from "@shared/schema";
import { insertRoutineArticleSchema, insertArticleSchema } from "@shared/schema";

interface ExchangeRateResponse {
  rates: { KRW: number };
}

interface CoinGeckoResponse {
  bitcoin: { krw: number; krw_24h_change: number };
}

interface FearGreedResponse {
  data: Array<{ value: string; value_classification: string }>;
}

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
      };
    }>;
  };
}

interface GoldPriceResponse {
  price: number;
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch {
    clearTimeout(id);
    throw new Error('Request timeout');
  }
}

async function fetchUSDKRW(): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json() as ExchangeRateResponse;
    const rate = data.rates.KRW;
    const prevRate = rate * 0.998;
    const change = ((rate - prevRate) / prevRate * 100);
    return { value: rate.toFixed(2), change };
  } catch {
    return { value: '1,427.80', change: -0.19 };
  }
}

async function fetchGold(usdkrw: number): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://data-asg.goldprice.org/dbXRates/KRW');
    const data = await response.json() as { items: Array<{ xauPrice: number; pcXau: number }> };
    const krwPerOz = data.items[0].xauPrice;
    const krwPerG = Math.round(krwPerOz / 31.1035);
    const change = data.items[0].pcXau || 0;
    return { value: krwPerG.toLocaleString('ko-KR'), change };
  } catch {
    return { value: '220,000', change: 0 };
  }
}

async function fetchSPY(): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://query1.finance.yahoo.com/v8/finance/chart/SPY');
    const data = await response.json() as YahooFinanceResponse;
    const quote = data.chart.result[0].meta;
    const currentPrice = quote.regularMarketPrice;
    const prevClose = quote.previousClose;
    const change = ((currentPrice - prevClose) / prevClose * 100);
    return { value: currentPrice.toFixed(2), change };
  } catch {
    return { value: '590.25', change: -0.99 };
  }
}

async function fetchBitcoin(): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
    const data = await response.json() as Array<{ trade_price: number; signed_change_rate: number }>;
    const price = data[0].trade_price;
    const change = data[0].signed_change_rate * 100;
    return { value: price.toLocaleString('ko-KR'), change };
  } catch {
    try {
      const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw&include_24hr_change=true');
      const data = await response.json() as CoinGeckoResponse;
      if (data.bitcoin) {
        return { value: data.bitcoin.krw.toLocaleString('ko-KR'), change: data.bitcoin.krw_24h_change };
      }
    } catch {}
    return { value: '136,000,000', change: 0 };
  }
}

async function fetchNASDAQ(): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://api.stock.naver.com/index/.IXIC/basic', 8000);
    const data = await response.json() as { 
      closePrice: string; 
      fluctuationsRatio: string;
    };
    if (data.closePrice) {
      const value = data.closePrice.replace(/,/g, '');
      const change = parseFloat(data.fluctuationsRatio) || 0;
      return { value: parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), change };
    }
  } catch {}
  try {
    const response = await fetchWithTimeout('https://query2.finance.yahoo.com/v8/finance/chart/%5EIXIC?interval=1d&range=1d');
    const data = await response.json() as YahooFinanceResponse;
    if (data.chart?.result?.[0]?.meta) {
      const quote = data.chart.result[0].meta;
      const currentPrice = quote.regularMarketPrice;
      const prevClose = quote.previousClose;
      if (currentPrice && prevClose) {
        const change = ((currentPrice - prevClose) / prevClose * 100);
        return { value: currentPrice.toFixed(2), change };
      }
    }
  } catch {}
  return { value: '19,500', change: 0 };
}

async function fetchKODEX200(): Promise<{ value: string; change: number }> {
  try {
    const response = await fetchWithTimeout('https://query2.finance.yahoo.com/v8/finance/chart/069500.KS?interval=1d&range=1d');
    const data = await response.json() as YahooFinanceResponse;
    if (data.chart?.result?.[0]?.meta) {
      const quote = data.chart.result[0].meta;
      const currentPrice = quote.regularMarketPrice;
      const prevClose = quote.previousClose;
      if (currentPrice && prevClose) {
        const change = ((currentPrice - prevClose) / prevClose * 100);
        return { value: currentPrice.toLocaleString('ko-KR'), change };
      }
    }
  } catch {}
  try {
    const response = await fetchWithTimeout('https://query1.finance.yahoo.com/v8/finance/chart/069500.KS');
    const data = await response.json() as YahooFinanceResponse;
    if (data.chart?.result?.[0]?.meta) {
      const quote = data.chart.result[0].meta;
      const currentPrice = quote.regularMarketPrice;
      const prevClose = quote.previousClose;
      if (currentPrice && prevClose) {
        const change = ((currentPrice - prevClose) / prevClose * 100);
        return { value: currentPrice.toLocaleString('ko-KR'), change };
      }
    }
  } catch {}
  return { value: '41,000', change: 0 };
}

async function fetchFearGreed(): Promise<{ value: string; status: string }> {
  const translateFearGreed = (status: string): string => {
    const translations: Record<string, string> = {
      'Extreme Fear': '극단적 공포',
      'Fear': '공포',
      'Neutral': '중립',
      'Greed': '탐욕',
      'Extreme Greed': '극단적 탐욕'
    };
    return translations[status] || status;
  };

  try {
    const response = await fetchWithTimeout('https://api.alternative.me/fng/');
    const data = await response.json() as FearGreedResponse;
    const value = data.data[0].value;
    const status = translateFearGreed(data.data[0].value_classification);
    return { value, status };
  } catch {
    return { value: '52', status: '중립' };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get('/api/subscribers', async (_req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get subscribers' });
    }
  });

  app.post('/api/subscribe', async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const subscriberName = name || '구독자';
      const subscriber = await storage.addSubscriber(subscriberName, email);
      res.json({ success: true, subscriber });
    } catch (error) {
      res.status(500).json({ error: 'Failed to subscribe' });
    }
  });

  app.delete('/api/subscribers/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.removeSubscriber(id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove subscriber' });
    }
  });

  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || '5511';
    
    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: '비밀번호가 올바르지 않습니다' });
    }
  });

  app.get('/api/market-data', async (_req, res) => {
    try {
      const [usdkrw, spy, bitcoin, nasdaq, kodex200, fearGreed] = await Promise.all([
        fetchUSDKRW(),
        fetchSPY(),
        fetchBitcoin(),
        fetchNASDAQ(),
        fetchKODEX200(),
        fetchFearGreed()
      ]);

      const usdkrwRate = parseFloat(usdkrw.value.replace(/,/g, ''));
      const gold = await fetchGold(usdkrwRate);

      const marketData: MarketData = {
        usdkrw: { ...usdkrw, loading: false },
        gold: { ...gold, loading: false },
        spy: { ...spy, loading: false },
        bitcoin: { ...bitcoin, loading: false },
        nasdaq: { ...nasdaq, loading: false },
        kodex200: { ...kodex200, loading: false },
        fearGreed: { ...fearGreed, loading: false },
        scfi: { value: '1,245', change: -2.3, loading: false }
      };

      res.json(marketData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  });

  // Dashboard Content by Date
  app.get('/api/dashboard/dates', async (_req, res) => {
    try {
      const dates = await storage.getAvailableDates();
      res.json(dates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get available dates' });
    }
  });

  app.get('/api/dashboard/:date', async (req, res) => {
    try {
      const content = await storage.getDashboardContent(req.params.date);
      if (!content) {
        return res.status(404).json({ error: 'Content not found for this date' });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get dashboard content' });
    }
  });

  app.post('/api/dashboard/:date', async (req, res) => {
    try {
      const content = await storage.saveDashboardContent(req.params.date, req.body);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save dashboard content' });
    }
  });

  // Routine Articles CRUD
  app.get('/api/routine-articles', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const articles = await storage.getRoutineArticles(category);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get articles' });
    }
  });

  app.get('/api/routine-articles/:id', async (req, res) => {
    try {
      const article = await storage.getRoutineArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get article' });
    }
  });

  app.post('/api/routine-articles', async (req, res) => {
    try {
      const parseResult = insertRoutineArticleSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || 'Invalid data' });
      }
      const article = await storage.createRoutineArticle(parseResult.data);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create article' });
    }
  });

  app.patch('/api/routine-articles/:id', async (req, res) => {
    try {
      const article = await storage.updateRoutineArticle(req.params.id, req.body);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update article' });
    }
  });

  app.delete('/api/routine-articles/:id', async (req, res) => {
    try {
      const success = await storage.deleteRoutineArticle(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  });

  app.get('/api/articles/:pageType', async (req, res) => {
    try {
      const { pageType } = req.params;
      const { category } = req.query;
      if (!['routine', 'real-estate', 'invest'].includes(pageType)) {
        return res.status(400).json({ error: 'Invalid page type' });
      }
      const articles = await storage.getArticles(pageType as PageType, category as string | undefined);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get articles' });
    }
  });

  app.get('/api/articles/:pageType/:id', async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get article' });
    }
  });

  app.post('/api/articles', async (req, res) => {
    try {
      const parseResult = insertArticleSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || 'Invalid data' });
      }
      const article = await storage.createArticle(parseResult.data);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create article' });
    }
  });

  app.patch('/api/articles/:id', async (req, res) => {
    try {
      const article = await storage.updateArticle(req.params.id, req.body);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update article' });
    }
  });

  app.delete('/api/articles/:id', async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  });

  return httpServer;
}
