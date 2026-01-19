import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function Subscribe() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white">구독하기</h1>
        </div>
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-xl">
          <p className="text-muted-foreground text-center py-12">
            구독 관련 콘텐츠가 곧 추가될 예정입니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
