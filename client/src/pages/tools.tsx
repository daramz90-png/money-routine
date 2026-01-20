import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Wrench, Calculator, TrendingUp, Home, ArrowLeftRight, 
  Banknote, Copy, X, Check
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

interface CalculatorCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  testId: string;
}

function CalculatorCard({ icon, title, description, color, onClick, testId }: CalculatorCardProps) {
  return (
    <Card 
      className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={testId}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0" data-testid={`${testId}-button`}>
            <Calculator className="w-4 h-4 mr-2" />
            계산하기
          </Button>
        </div>
      </div>
    </Card>
  );
}

function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
}

function formatCurrency(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}억원`;
  } else if (num >= 10000) {
    return `${formatNumber(Math.round(num / 10000))}만원`;
  }
  return `${formatNumber(num)}원`;
}

function ComingSoonModal({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-12 text-center">
          <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold text-foreground mb-2">준비중입니다</h3>
          <p className="text-muted-foreground">
            더 정확한 계산기를 준비하고 있습니다.<br />
            조금만 기다려주세요!
          </p>
        </div>
        <Button onClick={onClose} className="w-full" variant="outline">
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function CompoundInterestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [initialAmount, setInitialAmount] = useState<string>('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('50');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    finalAmount: number;
    totalDeposit: number;
    totalInterest: number;
    yearlyData: { year: number; amount: number }[];
  } | null>(null);

  const calculate = () => {
    const initial = parseFloat(initialAmount) * 10000 || 0;
    const monthly = parseFloat(monthlyDeposit) * 10000 || 0;
    const rate = parseFloat(annualRate) / 100 || 0;
    const period = parseInt(years) || 0;
    
    const monthlyRate = rate / 12;
    let balance = initial;
    const yearlyData: { year: number; amount: number }[] = [];
    
    for (let year = 1; year <= period; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + monthly;
      }
      yearlyData.push({ year, amount: Math.round(balance) });
    }
    
    const totalDeposit = initial + monthly * 12 * period;
    const totalInterest = balance - totalDeposit;
    
    setResult({
      finalAmount: Math.round(balance),
      totalDeposit,
      totalInterest: Math.round(totalInterest),
      yearlyData,
    });
  };

  const reset = () => {
    setInitialAmount('1000');
    setMonthlyDeposit('50');
    setAnnualRate('7');
    setYears('10');
    setResult(null);
    setCopied(false);
  };

  const copyResult = () => {
    if (result) {
      const text = `[복리 계산 결과]
초기금액: ${initialAmount}만원
월 적립액: ${monthlyDeposit}만원
연 수익률: ${annualRate}%
투자 기간: ${years}년

최종 금액: ${formatCurrency(result.finalAmount)}
총 원금: ${formatCurrency(result.totalDeposit)}
총 수익: +${formatCurrency(result.totalInterest)}

- 쿠쿠의 돈루틴 계산기`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxAmount = result ? Math.max(...result.yearlyData.map(d => d.amount)) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            복리 계산기
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initial" className="text-sm">초기 금액 (만원)</Label>
              <Input
                id="initial"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                placeholder="1000"
                data-testid="input-initial-amount"
              />
            </div>
            <div>
              <Label htmlFor="monthly" className="text-sm">월 적립액 (만원)</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                placeholder="50"
                data-testid="input-monthly-deposit"
              />
            </div>
            <div>
              <Label htmlFor="rate" className="text-sm">연 수익률 (%)</Label>
              <Input
                id="rate"
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                placeholder="7"
                step="0.1"
                data-testid="input-annual-rate"
              />
            </div>
            <div>
              <Label htmlFor="years" className="text-sm">투자 기간 (년)</Label>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="10"
                data-testid="input-years"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={calculate} 
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0"
              data-testid="button-calculate"
            >
              <Calculator className="w-4 h-4 mr-2" />
              계산하기
            </Button>
            <Button variant="outline" onClick={reset} data-testid="button-reset">
              초기화
            </Button>
          </div>

          {result && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">최종 금액</p>
                  <p className="text-lg font-bold text-emerald-600" data-testid="result-final-amount">{formatCurrency(result.finalAmount)}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">총 원금</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(result.totalDeposit)}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">총 수익</p>
                  <p className="text-lg font-bold text-indigo-700">+{formatCurrency(result.totalInterest)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">연도별 자산 성장</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.yearlyData.map((data) => (
                    <div key={data.year} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{data.year}년</span>
                      <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-20 text-right">{formatCurrency(data.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={copyResult} 
                data-testid="button-copy-result"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    복사 완료!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    결과 복사하기
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Tools() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const calculators = [
    {
      id: 'loan',
      icon: <Banknote className="w-7 h-7" />,
      title: '대출 이자 계산기',
      description: '원리금균등 vs 원금균등 비교',
      color: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    },
    {
      id: 'capital-gains',
      icon: <Home className="w-7 h-7" />,
      title: '양도소득세 계산기',
      description: '집 팔 때 세금 얼마나 나올까?',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
    {
      id: 'rent-compare',
      icon: <ArrowLeftRight className="w-7 h-7" />,
      title: '전월세 비교 계산기',
      description: '전세 vs 월세 뭐가 유리할까?',
      color: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    },
    {
      id: 'compound',
      icon: <TrendingUp className="w-7 h-7" />,
      title: '복리 계산기',
      description: '목돈 만들기 시뮬레이션',
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            재테크 계산기
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            쉽고 빠른 계산으로 현명한 결정을
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              color={calc.color}
              onClick={() => setActiveModal(calc.id)}
              testId={`card-${calc.id}`}
            />
          ))}
        </div>
      </main>

      <ComingSoonModal 
        open={activeModal === 'loan'} 
        onClose={() => setActiveModal(null)} 
        title="대출 이자 계산기"
      />
      <ComingSoonModal 
        open={activeModal === 'capital-gains'} 
        onClose={() => setActiveModal(null)} 
        title="양도소득세 계산기"
      />
      <ComingSoonModal 
        open={activeModal === 'rent-compare'} 
        onClose={() => setActiveModal(null)} 
        title="전월세 비교 계산기"
      />
      <CompoundInterestModal 
        open={activeModal === 'compound'} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}
