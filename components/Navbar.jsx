import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CreditCard,
  Sparkles,
  Menu,
  X,
  Home,
  History,
  MessageCircle,
  BookOpen,
  Phone
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'AI Chat', icon: MessageCircle, href: '/chat' },
    { name: 'Cards', icon: CreditCard, href: '/cards' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <CreditCard className="text-cyan-400" size={32} />
            <div>
              <h1 className="text-xl font-bold">Card Finder</h1>
              
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  router.pathname === item.href
                    ? 'bg-white text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>

         
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                  router.pathname === item.href
                    ? 'bg-white text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
