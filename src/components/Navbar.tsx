import React, { useState, useEffect } from 'react';
import { ShoppingBag, Utensils, MapPin, Phone, Star, ArrowRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex items-center justify-between rounded-full py-3.5 px-6 sm:px-8 transition-all duration-500 ease-in-out border ${
            isScrolled
              ? 'backdrop-blur-xl bg-white/95 border-stone-150/80 shadow-[0_20px_40px_rgba(56,9,2,0.08)] text-stone-900'
              : 'backdrop-blur-xl bg-[#380902]/85 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.15)] text-[#FFECDA]'
          }`}
        >
          {/* Brand/Logo */}
          <div className="flex items-center gap-3 select-none">
            <div
              className={`p-2.5 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                isScrolled
                  ? 'bg-[#8E1F0D] text-white shadow-[#8E1F0D]/20 hover:rotate-180 duration-700'
                  : 'bg-[#FFBC00] text-[#380902] shadow-[#FFBC00]/10 hover:rotate-180 duration-700'
              }`}
            >
              <Utensils size={18} />
            </div>
            <div className="flex flex-col">
              <span className={`font-bebas text-xl sm:text-2xl tracking-[0.08em] leading-none transition-colors duration-500 ${
                isScrolled ? 'text-[#380902]' : 'text-white'
              }`}>
                PIZZA CRAVE
              </span>
              <span className={`font-sans font-black text-[8px] sm:text-[9px] tracking-widest uppercase transition-colors duration-500 ${
                isScrolled ? 'text-[#8E1F0D]/75' : 'text-[#FFBC00]'
              }`}>
                Gourmet Neapolitan
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#hero-section"
              className={`font-sans font-black text-[11px] tracking-[0.18em] uppercase transition-all duration-300 relative group py-1 ${
                isScrolled ? 'text-stone-600 hover:text-[#8E1F0D]' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Masterpiece
              <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-[#8E1F0D]' : 'bg-[#FFBC00]'
              }`} />
            </a>
            <a
              href="#menu-showcase-section"
              className={`font-sans font-black text-[11px] tracking-[0.18em] uppercase transition-all duration-300 relative group py-1 ${
                isScrolled ? 'text-stone-600 hover:text-[#8E1F0D]' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Our Oven
              <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-[#8E1F0D]' : 'bg-[#FFBC00]'
              }`} />
            </a>
            <a
              href="#why-choose-us"
              className={`font-sans font-black text-[11px] tracking-[0.18em] uppercase transition-all duration-300 relative group py-1 ${
                isScrolled ? 'text-stone-600 hover:text-[#8E1F0D]' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Why Us
              <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-[#8E1F0D]' : 'bg-[#FFBC00]'
              }`} />
            </a>
            <a
              href="#testimonials-section"
              className={`font-sans font-black text-[11px] tracking-[0.18em] uppercase transition-all duration-300 relative group py-1 ${
                isScrolled ? 'text-stone-600 hover:text-[#8E1F0D]' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Guestbook
              <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'bg-[#8E1F0D]' : 'bg-[#FFBC00]'
              }`} />
            </a>
          </div>

          {/* Actions & Dynamic Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Call hotline (with pulse animation) */}
            <a
              href="tel:+12345678910"
              className={`hidden lg:flex items-center gap-2 border px-4 py-1.5 rounded-full transition-all duration-300 text-[10px] sm:text-xs font-black tracking-widest uppercase ${
                isScrolled
                  ? 'border-stone-200 bg-stone-50 text-[#8E1F0D] hover:bg-[#8E1F0D] hover:text-white'
                  : 'border-white/10 bg-white/5 text-[#FFBC00] hover:bg-[#FFBC00] hover:text-[#380902]'
              }`}
            >
              <Phone size={11} className="animate-bounce" />
              <span>DIAL IN NOW</span>
            </a>

            {/* Rome Tag */}
            <div className={`hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
              isScrolled
                ? 'bg-stone-100/80 border-stone-200/50 text-stone-600'
                : 'bg-white/5 border-white/5 text-[#FFECDA]'
            }`}>
              <MapPin size={11} className={isScrolled ? 'text-[#8E1F0D]' : 'text-[#FFBC00]'} />
              <span>ROME, IT</span>
            </div>

            {/* Shopping Cart Button */}
            <button
              className={`relative py-2.5 px-5 rounded-full font-sans font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-500 flex items-center gap-2 overflow-hidden group cursor-pointer shadow-md ${
                isScrolled
                  ? 'bg-[#8E1F0D] text-white hover:bg-[#380902]'
                  : 'bg-[#FFBC00] text-[#380902] hover:bg-white hover:text-[#380902]'
              }`}
              id="nav-cart-btn"
            >
              <ShoppingBag size={13} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10 hidden xs:inline uppercase">CART</span>
              
              {/* Dynamic Bag Counter */}
              <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
                isScrolled
                  ? 'bg-white text-[#8E1F0D] border-white/25'
                  : 'bg-[#380902] text-[#FFBC00] border-[#380902]/20'
              }`}>
                <span className="transition-all duration-200" key={cartCount}>
                  {cartCount}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
