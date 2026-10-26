import React from 'react';
import { ShieldCheck, Sparkles, Layers, ArrowRight, Database } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  productsCount: number;
  scrapedCount: number;
  onOpenAdmin: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productsCount,
  scrapedCount,
  onOpenAdmin,
}) => {
  return (
    <section className="relative border-b-2 border-[#2563EB] bg-gradient-to-b from-[#DBEAFE]/80 to-[#BFDBFE]/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Message */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 border-2 border-[#2563EB] bg-white px-3 py-1 shadow-[2px_2px_0px_#2563EB]">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified Logo" 
                className="w-5 h-5 object-contain" 
              />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0F2A6A]">
                Marché Certifié W3C • Garantie Transmutation 100%
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading uppercase text-[#0F2A6A] leading-[1.05]">
              Catalogue Officiel <br />
              <span className="text-white bg-[#2563EB] px-2 py-0.5 inline-block shadow-[4px_4px_0px_#0F2A6A]">
                certi-market
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#1E40AF] font-medium max-w-2xl leading-relaxed">
              Explorez nos collections certifiées par le réseau W3C avec paiement instantané CertiPay.
              Chaque produit est tracé, inspecté et classé par catégorie avec des spécifications complètes.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="border-2 border-[#2563EB] bg-white p-3 shadow-[2px_2px_0px_#2563EB]">
                <div className="text-2xl font-black font-mono text-[#2563EB]">{productsCount}</div>
                <div className="text-[10px] uppercase font-bold text-[#3B5DB5] tracking-wider">Produits Actifs</div>
              </div>

              <div className="border-2 border-[#2563EB] bg-white p-3 shadow-[2px_2px_0px_#2563EB]">
                <div className="text-2xl font-black font-mono text-[#0F2A6A]">{categories.length}</div>
                <div className="text-[10px] uppercase font-bold text-[#3B5DB5] tracking-wider">Catégories</div>
              </div>

              <div className="border-2 border-[#2563EB] bg-white p-3 shadow-[2px_2px_0px_#2563EB]">
                <div className="text-2xl font-black font-mono text-emerald-600">100%</div>
                <div className="text-[10px] uppercase font-bold text-[#3B5DB5] tracking-wider">Certifié W3C</div>
              </div>

              <div className="border-2 border-[#2563EB] bg-white p-3 shadow-[2px_2px_0px_#2563EB]">
                <div className="text-2xl font-black font-mono text-amber-600">{scrapedCount}</div>
                <div className="text-[10px] uppercase font-bold text-[#3B5DB5] tracking-wider">Importés Admin</div>
              </div>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div className="lg:col-span-4 border-2 border-[#2563EB] bg-white p-5 shadow-[6px_6px_0px_#2563EB] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#BFDBFE] pb-3">
              <div className="flex items-center gap-2">
                <img 
                  src="/assets/aistudio/certified-logo_b9de136c.png" 
                  alt="Certified" 
                  className="w-6 h-6 object-contain" 
                />
                <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#0F2A6A]">
                  Certified Node W3C
                </span>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 border border-emerald-300">
                ACTIF
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#3B5DB5]">
              <p className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">▪</span>
                <span>Bordures rectilignes à angles droits stricts (0px radius).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">▪</span>
                <span>Paiement marchand W3C via SDK CertiPay intégré.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold">▪</span>
                <span>Synchronisation automatique du crawler administrateur.</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-4 bg-[#0F2A6A] hover:bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#0F2A6A] shadow-[2px_2px_0px_#2563EB] flex items-center justify-center gap-2 transition-all"
              >
                <Database className="w-4 h-4 text-amber-400" />
                <span>Ouvrir Scraper Admin (Clé requise)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Bar */}
        <div className="mt-8 pt-6 border-t-2 border-[#BFDBFE]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              Explorer par catégorie :
            </span>
            {selectedCategory && (
              <button
                onClick={() => onSelectCategory(null)}
                className="text-xs font-mono font-bold text-[#2563EB] hover:underline"
              >
                Afficher toutes les catégories [✕]
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                selectedCategory === null
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[2px_2px_0px_#0F2A6A]'
                  : 'bg-white text-[#0F2A6A] border-[#2563EB] hover:bg-[#E0F2FE]'
              }`}
            >
              Tous les produits ({productsCount})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[2px_2px_0px_#0F2A6A]'
                      : 'bg-white text-[#0F2A6A] border-[#2563EB] hover:bg-[#E0F2FE]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
