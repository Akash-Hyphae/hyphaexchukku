import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'chukku', label: 'CHUKKU' },
    { id: 'hyphae', label: 'HYPHAE' },
    { id: 'gallery', label: 'OUR GALLERY' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'love-letter', label: 'LOVE LETTER' },
    { id: 'future', label: 'FUTURE' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DDD2]/60 py-3.5 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer focus-visible:outline-hidden"
        >
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wider text-[#3D251E] group-hover:text-[#A84B3D] transition-colors">
            CHUKKU <span className="font-sans font-light text-[#A84B3D] mx-1">×</span> HYPHAE
          </span>
          <span className="block font-handwriting text-xs text-[#7D5A4F] -mt-1 group-hover:text-[#3D251E] transition-colors">
            our little universe
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs font-medium tracking-widest transition-all relative py-1 cursor-pointer focus-visible:outline-hidden ${
                  isActive
                    ? 'text-[#A84B3D] font-semibold'
                    : 'text-[#614A42] hover:text-[#3D251E]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A84B3D] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#3D251E] hover:text-[#A84B3D] transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2]/98 backdrop-blur-xl border-b border-[#E8DDD2] px-6 py-5 shadow-lg">
          <div className="flex flex-col space-y-4">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium tracking-widest py-2 border-b border-[#F0E6DD] transition-colors ${
                    isActive ? 'text-[#A84B3D] font-semibold' : 'text-[#614A42]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
