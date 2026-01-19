import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Coins, Home as HomeIcon, TrendingUp, Receipt, 
  Wallet, Sparkles, Calculator, Mail, Settings 
} from 'lucide-react';

const navItems = [
  { name: '홈', href: '/', icon: HomeIcon },
  { name: '투자', href: '/invest', icon: TrendingUp },
  { name: '절세', href: '/tax', icon: Receipt },
  { name: '저축', href: '/savings', icon: Wallet },
  { name: '부수입', href: '/side-income', icon: Sparkles },
  { name: '도구', href: '/tools', icon: Calculator },
  { name: '구독', href: '/subscribe', icon: Mail },
  { name: '관리자', href: '/admin', icon: Settings },
];

export function SharedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between h-16 gap-2">
          <Link href="/" className="flex flex-wrap items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">쿠쿠의 돈루틴</span>
          </Link>
          
          <nav className="hidden md:flex flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-white/90 hover:text-white hover:bg-white/10 ${location === item.href ? 'bg-white/20' : ''}`}
                  data-testid={`nav-${item.name}`}
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.name}
                </Button>
              </Link>
            ))}
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
        
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-white/90 hover:text-white hover:bg-white/10 ${location === item.href ? 'bg-white/20' : ''}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
