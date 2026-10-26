import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  categories: string[];
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
  onOpenAdmin,
  onNavigateHome,
}) => {
  return (
    <footer className="mt-20 border-t-2 border-[#2563EB] bg-[#0F2A6A] text-white">
      {/* Top Banner */}
      <div className="border-b border-blue-900/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white p-1 flex items-center justify-center border border-white">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                Boutique Officielle certi-market
              </span>
              <p className="text-[10px] text-blue-300 font-mono">
                Réseau W3C Actif • SDK CertiPay Merchant Intégré • Angles Droits Architecturaux
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Accès Scraper Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
              <div className="w-6 h-6 bg-white p-0.5 flex items-center justify-center border border-white">
                <img src="/assets/aistudio/certified-logo_b9de136c.png" alt="Certified" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-black font-heading uppercase tracking-tight">certi-market</span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed font-mono">
              Plateforme certifiée garantissant l'authenticité et la traçabilité de chaque pièce de mobilier, luminaire, céramique et décor.
            </p>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300 border-b border-blue-800 pb-1">
              Catégories Produits
            </div>
            <ul className="space-y-1 text-xs font-mono text-blue-100">
              {categories.slice(0, 6).map((c) => (
                <li key={c}>
                  <button
                    onClick={() => onSelectCategory(c)}
                    className="hover:text-blue-300 hover:underline"
                  >
                    ▪ {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: W3C & Security */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300 border-b border-blue-800 pb-1">
              Réseau W3C & CertiPay
            </div>
            <div className="text-xs font-mono text-blue-200 space-y-1.5">
              <p>• Compatible standard W3C Merchant</p>
              <p>• Script certipay-merchant-sdk.js intégré</p>
              <p>• Règlements cryptés 256-bit</p>
              <p>• Scraper et injection automatique</p>
            </div>
          </div>

          {/* Col 4: Design Rules */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300 border-b border-blue-800 pb-1">
              Architecture Visuelle
            </div>
            <div className="text-xs font-mono text-blue-200 space-y-1">
              <p>Angles droits stricts (0px border-radius).</p>
              <p>Contraste haute fidélité bleu glacier & cobalt.</p>
              <p>Pagination intégrée par lots et catégories.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-900/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-blue-300 gap-4">
          <div>
            certi-market © 2025 • Tous droits réservés • Certified W3C Protocol
          </div>
          <div className="flex gap-4">
            <button onClick={onNavigateHome} className="hover:underline">Boutique</button>
            <button onClick={onOpenAdmin} className="hover:underline">Admin (r3108Y1905@)</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
