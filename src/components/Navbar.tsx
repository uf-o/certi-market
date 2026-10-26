import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Lock, Search, Grid, Compass, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any, category?: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cart,
  onOpenCart,
  searchQuery,
  onSearchChange,
  isAdminAuthenticated,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#2563EB] text-[#0F2A6A] shadow-sm">
      {/* Top Banner with W3C & Certified mention */}
      <div className="bg-[#2563EB] text-white text-[11px] font-mono tracking-wider py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/aistudio/certified-logo_b9de136c.png" alt="Certified Logo" className="w-4 h-4 object-contain brightness-0 invert" />
          <span className="font-bold">RÉSEAU W3C OFFICIEL</span>
          <span className="opacity-60 hidden sm:inline">•</span>
          <span className="hidden sm:inline">SDK CertiPay Merchant Actif</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="bg-[#1E40AF] px-2 py-0.5 font-bold uppercase tracking-widest border border-blue-300/30">Protocole Sécurisé 256-bit</span>
          <span className="opacity-80 hidden md:inline">Angles droits • Design Brutaliste</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 bg-[#E0F2FE] border-2 border-[#2563EB] flex items-center justify-center p-1 shadow-[2px_2px_0px_#2563EB]">
            <img 
              src="/assets/aistudio/certified-logo_b9de136c.png" 
              alt="Certified Logo" 
              className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight font-heading uppercase text-[#0F2A6A]">certi-market</span>
              <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.2 font-mono font-bold tracking-widest">PRO</span>
            </div>
            <p className="text-[10px] text-[#3B5DB5] tracking-wider uppercase font-mono font-medium -mt-0.5">Boutique & Extracteur Certifié</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full border-2 border-[#2563EB] bg-[#F0F9FF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563EB] transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un produit, une référence, un créateur..."
              className="w-full h-10 pl-9 pr-4 text-xs font-medium text-[#0F2A6A] bg-transparent outline-none placeholder:text-[#3B5DB5]/60"
            />
            <Search className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2563EB] font-bold px-1 hover:bg-[#E0F2FE]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center gap-1.5 ${
              currentView === 'home' 
                ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                : 'bg-white text-[#0F2A6A] border-[#2563EB] hover:bg-[#E0F2FE]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Boutique</span>
          </button>

          <button
            onClick={() => onNavigate('categories-index')}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center gap-1.5 ${
              currentView === 'categories-index' || currentView === 'category'
                ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                : 'bg-white text-[#0F2A6A] border-[#2563EB] hover:bg-[#E0F2FE]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Catégories</span>
          </button>

          {/* Cart trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB] bg-[#0F2A6A] text-white hover:bg-[#1E40AF] transition-all flex items-center gap-2 shadow-[2px_2px_0px_#2563EB]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panier</span>
            <span className="bg-[#2563EB] text-white px-1.5 py-0.2 text-[11px] font-mono font-bold">
              {totalCartItems}
            </span>
          </button>

          {/* Admin Scraper Access */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#0F2A6A] ${
              currentView === 'admin'
                ? 'bg-[#1E40AF] text-white border-[#0F2A6A]'
                : 'bg-amber-100 text-[#0F2A6A] border-[#0F2A6A] hover:bg-amber-200'
            }`}
            title="Espace Admin : Scraper et injection automatique de produits"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-mono">Admin</span>
            {isAdminAuthenticated && (
              <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#BFDBFE]">
        <div className="relative w-full border-2 border-[#2563EB] bg-[#F0F9FF]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher des produits..."
            className="w-full h-9 pl-9 pr-4 text-xs font-medium text-[#0F2A6A] bg-transparent outline-none"
          />
          <Search className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </header>
  );
};
