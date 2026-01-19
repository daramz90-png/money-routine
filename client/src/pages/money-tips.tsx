import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

export default function MoneyTips() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="page-title">
            돈 버는 팁
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            일상에서 실천할 수 있는 재테크 노하우
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <Card className="p-12 bg-card/95 backdrop-blur-sm border-0 shadow-lg text-center">
          <Lightbulb className="w-16 h-16 mx-auto mb-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-foreground mb-4">준비중입니다</h2>
          <p className="text-muted-foreground">
            절세, 저축, 부수입 등 다양한 돈 버는 팁을 곧 만나보실 수 있습니다.
          </p>
        </Card>
      </main>
    </div>
  );
}
