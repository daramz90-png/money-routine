import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, Star, Clock, FileText, Calculator, Gift, 
  Check, ChevronRight, Quote, Sparkles
} from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  { icon: Clock, title: '매주 월/수/금 오전 7시', description: '출근길에 읽기 딱 좋은 시간에 발송' },
  { icon: FileText, title: '5분이면 읽는 핵심 정리', description: '바쁜 당신을 위한 요약 콘텐츠' },
  { icon: Sparkles, title: '실전 투자 팁 & 절세 전략', description: '바로 적용할 수 있는 실용적인 정보' },
  { icon: Calculator, title: '독점 계산기 & 템플릿', description: '구독자만을 위한 특별 자료 제공' },
];

const recentNewsletters = [
  {
    id: '1',
    title: '[1월 3주차] 2026년 연말정산, 이것만 챙기면 100만원 환급!',
    summary: '연말정산 시즌이 시작됐습니다. 놓치기 쉬운 공제 항목 5가지와 신용카드 소득공제 극대화 전략을 정리했습니다.',
    date: '2026-01-17',
  },
  {
    id: '2',
    title: '[1월 2주차] 금 시세 최고치 경신, 지금 사야 할까?',
    summary: '금값이 사상 최고치를 기록했습니다. 금 투자 방법별 장단점과 지금 투자해도 될지 분석했습니다.',
    date: '2026-01-13',
  },
  {
    id: '3',
    title: '[1월 1주차] 2026년 새해, 재테크 목표 세우는 법',
    summary: '새해를 맞아 현실적인 재테크 목표를 세우는 방법과 실천할 수 있는 구체적인 계획을 공유합니다.',
    date: '2026-01-06',
  },
];

const testimonials = [
  {
    id: '1',
    text: '이 뉴스레터 덕분에 연말정산 30만원 환급받았어요!',
    name: '김**',
    job: '직장인 3년차',
  },
  {
    id: '2',
    text: '매일 아침 커피 마시며 읽는 게 습관이 됐어요. 투자 공부에 큰 도움!',
    name: '이**',
    job: '사회초년생',
  },
  {
    id: '3',
    text: '복잡한 세금 얘기를 쉽게 설명해줘서 좋아요.',
    name: '박**',
    job: '프리랜서',
  },
];

export default function Subscribe() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "올바른 이메일 주소를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        toast({
          title: "구독 완료!",
          description: "매주 유익한 재테크 정보를 보내드릴게요.",
        });
      } else {
        toast({
          title: "구독 실패",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "오류 발생",
        description: "서버에 연결할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">5,000명이 구독 중</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4" data-testid="page-title">
            매주 돈루틴을 받아보세요
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            하루 5분, 커피 한 잔 마시며 읽는 재테크 뉴스레터.
            <br className="hidden sm:block" />
            공모주부터 절세까지, 돈 버는 습관을 만들어 드려요.
          </p>
          
          {!isSubscribed ? (
            <Card className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left">
                  <Label htmlFor="name" className="text-white/90 text-sm">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    data-testid="input-name"
                  />
                </div>
                <div className="text-left">
                  <Label htmlFor="email" className="text-white/90 text-sm">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    data-testid="input-email"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-white text-purple-700 hover:bg-white/90 font-bold text-lg py-6"
                  data-testid="button-subscribe"
                >
                  {isSubmitting ? (
                    '구독 중...'
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      무료로 구독하기
                    </>
                  )}
                </Button>
                <p className="text-xs text-white/60">
                  구독은 언제든 취소할 수 있습니다. 스팸은 절대 보내지 않아요.
                </p>
              </form>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">구독 완료!</h3>
              <p className="text-white/80">
                {name}님, 환영합니다!<br />
                다음 뉴스레터를 기대해주세요.
              </p>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
            구독하면 받을 수 있는 것들
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
            최근 뉴스레터 미리보기
          </h2>
          <div className="space-y-4">
            {recentNewsletters.map((newsletter) => (
              <Card key={newsletter.id} className="p-5 bg-card/95 backdrop-blur-sm border-0 shadow-lg hover-elevate cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">{newsletter.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{newsletter.summary}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12">
            구독자들의 이야기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-lg">
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />
                <p className="text-foreground mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.job}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Gift className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-white/80 mb-8">
            5분 투자로 평생 써먹는 재테크 습관을 만들어보세요.
          </p>
          {!isSubscribed && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-8 py-6"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-testid="button-subscribe-bottom"
            >
              <Mail className="w-5 h-5 mr-2" />
              무료로 구독하기
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
