import { Card } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

export default function Tax() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SharedHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Receipt className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">절세 & 환급</h1>
        </div>
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-xl">
          <p className="text-muted-foreground text-center py-12">
            절세 및 환급 관련 콘텐츠가 곧 추가될 예정입니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
