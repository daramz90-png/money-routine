import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Coins, BookOpen, Building2, TrendingUp, Settings, Home
} from 'lucide-react';

const navItems = [
  { name: '쿠쿠의 루틴', href: '/', icon: BookOpen },
  { name: '홈', href: '/home', icon: Home },
  { name: '부동산', href: '/real-estate', icon: Building2 },
  { name: '투자', href: '/invest', icon: TrendingUp },
  { name: '관리자', href: '/admin', icon: Settings },
];

export function SharedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">쿠쿠의 돈루틴</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href}>
                  <button 
                    className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                      isActive ? 'text-white' : 'text-white/80 hover:text-white'
                    }`}
                    data-testid={`nav-${item.name}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      
      <div 
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-64 z-50 bg-gradient-to-b from-indigo-600 to-purple-700 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <span className="text-lg font-bold text-white">메뉴</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsMenuOpen(false)}
            data-testid="button-close-menu"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="p-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href !== '/' && location.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    data-testid={`mobile-nav-${item.name}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
