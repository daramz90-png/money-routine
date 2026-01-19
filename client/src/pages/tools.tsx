import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calculator, TrendingUp, Target, Receipt, Share2, RotateCcw
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
}

function formatCurrency(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억원`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}만원`;
  }
  return `${formatNumber(num)}원`;
}

function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState<string>('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('50');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
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
  };

  const share = () => {
    if (result) {
      const text = `복리 계산 결과\n초기금액: ${initialAmount}만원\n월 납입: ${monthlyDeposit}만원\n연 수익률: ${annualRate}%\n기간: ${years}년\n\n최종 금액: ${formatCurrency(result.finalAmount)}\n총 수익: ${formatCurrency(result.totalInterest)}`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        alert('결과가 클립보드에 복사되었습니다!');
      }
    }
  };

  const maxAmount = result ? Math.max(...result.yearlyData.map(d => d.amount)) : 0;

  return (
    <Card className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">복리 계산기</h3>
          <p className="text-sm text-muted-foreground">시간이 만드는 복리의 마법</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
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
          <Label htmlFor="monthly" className="text-sm">월 납입액 (만원)</Label>
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

      <div className="flex gap-2 mb-6">
        <Button 
          onClick={calculate} 
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
          data-testid="button-calculate-compound"
        >
          <Calculator className="w-4 h-4 mr-2" />
          계산하기
        </Button>
        <Button variant="outline" size="icon" onClick={reset} data-testid="button-reset">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">최종 금액</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(result.finalAmount)}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">총 원금</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(result.totalDeposit)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">총 수익</p>
              <p className="text-lg font-bold text-blue-600">+{formatCurrency(result.totalInterest)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">연도별 자산 성장</p>
            <div className="space-y-2">
              {result.yearlyData.map((data) => (
                <div key={data.year} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{data.year}년</span>
                  <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-20 text-right">{formatCurrency(data.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={share} data-testid="button-share">
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
        </div>
      )}
    </Card>
  );
}

function GoalCalculator() {
  const [goalAmount, setGoalAmount] = useState<string>('5000');
  const [currentSavings, setCurrentSavings] = useState<string>('500');
  const [monthlySavings, setMonthlySavings] = useState<string>('100');
  const [result, setResult] = useState<{
    months: number;
    years: number;
    remainingMonths: number;
  } | null>(null);

  const calculate = () => {
    const goal = parseFloat(goalAmount) * 10000 || 0;
    const current = parseFloat(currentSavings) * 10000 || 0;
    const monthly = parseFloat(monthlySavings) * 10000 || 0;
    
    if (monthly <= 0) return;
    
    const remaining = goal - current;
    const months = Math.ceil(remaining / monthly);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    setResult({ months, years, remainingMonths });
  };

  const reset = () => {
    setGoalAmount('5000');
    setCurrentSavings('500');
    setMonthlySavings('100');
    setResult(null);
  };

  return (
    <Card className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">목표 달성 계산기</h3>
          <p className="text-sm text-muted-foreground">목표 금액까지 얼마나 걸릴까요?</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="goal" className="text-sm">목표 금액 (만원)</Label>
          <Input
            id="goal"
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            placeholder="5000"
            data-testid="input-goal-amount"
          />
        </div>
        <div>
          <Label htmlFor="current" className="text-sm">현재 저축액 (만원)</Label>
          <Input
            id="current"
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="500"
            data-testid="input-current-savings"
          />
        </div>
        <div>
          <Label htmlFor="monthlySave" className="text-sm">월 저축 가능액 (만원)</Label>
          <Input
            id="monthlySave"
            type="number"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(e.target.value)}
            placeholder="100"
            data-testid="input-monthly-savings"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          onClick={calculate} 
          className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0"
          data-testid="button-calculate-goal"
        >
          <Calculator className="w-4 h-4 mr-2" />
          계산하기
        </Button>
        <Button variant="outline" size="icon" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">목표 달성까지</p>
          <p className="text-3xl font-bold text-purple-600 mb-1">
            {result.years > 0 && `${result.years}년 `}
            {result.remainingMonths > 0 && `${result.remainingMonths}개월`}
            {result.years === 0 && result.remainingMonths === 0 && '이미 달성!'}
          </p>
          <p className="text-sm text-muted-foreground">
            총 {result.months}개월 후 목표 달성
          </p>
        </div>
      )}
    </Card>
  );
}

function TaxRefundCalculator() {
  const [salary, setSalary] = useState<string>('5000');
  const [dependents, setDependents] = useState<string>('0');
  const [insurance, setInsurance] = useState<string>('100');
  const [pension, setPension] = useState<string>('400');
  const [result, setResult] = useState<{
    estimatedRefund: number;
    isRefund: boolean;
  } | null>(null);

  const calculate = () => {
    const annualSalary = parseFloat(salary) * 10000 * 12 || 0;
    const numDependents = parseInt(dependents) || 0;
    const annualInsurance = parseFloat(insurance) * 10000 || 0;
    const annualPension = parseFloat(pension) * 10000 || 0;
    
    const standardDeduction = Math.min(annualSalary * 0.15, 5000000);
    const dependentDeduction = numDependents * 1500000;
    const insuranceDeduction = Math.min(annualInsurance, 1000000);
    const pensionDeduction = Math.min(annualPension, 4000000);
    
    const totalDeduction = standardDeduction + dependentDeduction + insuranceDeduction + pensionDeduction;
    const taxableIncome = Math.max(annualSalary - totalDeduction, 0);
    
    let tax = 0;
    if (taxableIncome <= 14000000) {
      tax = taxableIncome * 0.06;
    } else if (taxableIncome <= 50000000) {
      tax = 840000 + (taxableIncome - 14000000) * 0.15;
    } else if (taxableIncome <= 88000000) {
      tax = 6240000 + (taxableIncome - 50000000) * 0.24;
    } else {
      tax = 15360000 + (taxableIncome - 88000000) * 0.35;
    }
    
    const alreadyPaid = annualSalary * 0.033;
    const estimatedRefund = alreadyPaid - tax;
    
    setResult({
      estimatedRefund: Math.round(estimatedRefund),
      isRefund: estimatedRefund > 0,
    });
  };

  const reset = () => {
    setSalary('5000');
    setDependents('0');
    setInsurance('100');
    setPension('400');
    setResult(null);
  };

  return (
    <Card className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
          <Receipt className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">연말정산 예상 환급액</h3>
          <p className="text-sm text-muted-foreground">간단 예측 (참고용)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="salary" className="text-sm">월급 (만원)</Label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="5000"
            data-testid="input-salary"
          />
        </div>
        <div>
          <Label htmlFor="dependents" className="text-sm">부양가족 수</Label>
          <Input
            id="dependents"
            type="number"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            placeholder="0"
            data-testid="input-dependents"
          />
        </div>
        <div>
          <Label htmlFor="insurance" className="text-sm">보험료 (연간 만원)</Label>
          <Input
            id="insurance"
            type="number"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            placeholder="100"
            data-testid="input-insurance"
          />
        </div>
        <div>
          <Label htmlFor="pension" className="text-sm">연금저축 (연간 만원)</Label>
          <Input
            id="pension"
            type="number"
            value={pension}
            onChange={(e) => setPension(e.target.value)}
            placeholder="400"
            data-testid="input-pension"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          onClick={calculate} 
          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0"
          data-testid="button-calculate-tax"
        >
          <Calculator className="w-4 h-4 mr-2" />
          계산하기
        </Button>
        <Button variant="outline" size="icon" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className={`rounded-xl p-6 text-center ${
          result.isRefund 
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
            : 'bg-gradient-to-br from-red-500/10 to-rose-500/10'
        }`}>
          <p className="text-sm text-muted-foreground mb-2">
            {result.isRefund ? '예상 환급액' : '예상 추가 납부액'}
          </p>
          <p className={`text-3xl font-bold ${result.isRefund ? 'text-green-600' : 'text-red-600'}`}>
            {result.isRefund ? '+' : '-'}{formatCurrency(Math.abs(result.estimatedRefund))}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            * 실제 환급액과 다를 수 있습니다
          </p>
        </div>
      )}
    </Card>
  );
}

export default function Tools() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            재테크 도구
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            투자와 저축을 도와주는 유용한 계산기들
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompoundInterestCalculator />
          <GoalCalculator />
          <TaxRefundCalculator />
        </div>
      </div>
    </div>
  );
}
