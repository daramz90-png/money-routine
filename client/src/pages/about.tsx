import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { SharedHeader } from '@/components/shared-header';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <SharedHeader />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Info className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">소개</h1>
        </div>
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-xl">
          <p className="text-muted-foreground text-center py-12">
            쿠쿠의 돈루틴 소개 페이지입니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
