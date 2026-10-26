import React from 'react';
import { ShoppingBag, Eye, ExternalLink, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewProduct: (productId: string) => void;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onBuyNow,
  onAddToCart,
}) => {
  return (
    <article className="group relative bg-white border-2 border-[#2563EB] shadow-[4px_4px_0px_#2563EB] hover:shadow-[6px_6px_0px_#0F2A6A] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-[#EFF6FF] border-b-2 border-[#2563EB] overflow-hidden cursor-pointer" onClick={() => onViewProduct(product.id)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Certified Badge - Top Right */}
        <div className="absolute top-2 right-2 bg-white/95 border-2 border-[#2563EB] px-2 py-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#2563EB] z-10">
          <img 
            src="/assets/aistudio/certified-logo_b9de136c.png" 
            alt="Certified" 
            className="w-4 h-4 object-contain" 
          />
          <span className="text-[9px] font-mono font-black text-[#0F2A6A] tracking-wider uppercase">
            CERTIFIED
          </span>
        </div>

        {/* Category Badge - Top Left */}
        <div className="absolute top-2 left-2 bg-[#2563EB] text-white border-2 border-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0F2A6A]">
          {product.category}
        </div>

        {/* Scraped origin indicator if applicable */}
        {product.isScraped && (
          <div className="absolute bottom-2 left-2 bg-amber-400 text-[#0F2A6A] border-2 border-[#0F2A6A] px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider shadow-[1px_1px_0px_#0F2A6A]">
            Importé Admin
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onViewProduct(product.id)}
              className="text-base font-bold text-[#0F2A6A] font-heading hover:text-[#2563EB] cursor-pointer line-clamp-1 uppercase tracking-tight"
            >
              {product.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-[#3B5DB5] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Stock info */}
        <div className="pt-2 border-t border-[#BFDBFE] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#3B5DB5]">Prix Certifié</div>
            <div className="text-xl font-black font-mono text-[#0F2A6A]">
              {product.price.toFixed(2)} €
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-600 inline-block"></span>
              En stock
            </div>
            <div className="text-[10px] text-[#3B5DB5] font-mono">Expédition 24h</div>
          </div>
        </div>

        {/* Action Buttons with strict sharp angles */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onViewProduct(product.id)}
            className="py-2 px-3 text-xs font-bold uppercase tracking-wider bg-white text-[#0F2A6A] border-2 border-[#2563EB] hover:bg-[#E0F2FE] flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fiche</span>
          </button>

          <button
            onClick={() => onBuyNow(product)}
            className="py-2 px-3 text-xs font-bold uppercase tracking-wider bg-[#2563EB] text-white border-2 border-[#2563EB] hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#0F2A6A] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Acheter</span>
          </button>
        </div>
      </div>
    </article>
  );
};
