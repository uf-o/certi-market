import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Truck, RotateCcw, Lock, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onSelectCategory: (cat: string) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  relatedProducts: Product[];
  onViewProduct: (productId: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onSelectCategory,
  onBuyNow,
  onAddToCart,
  relatedProducts,
  onViewProduct,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#3B5DB5] mb-6 border-b border-[#BFDBFE] pb-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 font-bold text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour Boutique
        </button>
        <span>/</span>
        <button 
          onClick={() => onSelectCategory(product.category)}
          className="hover:underline font-bold text-[#0F2A6A]"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#3B5DB5] truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Gallery / Images Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full bg-white border-2 border-[#2563EB] shadow-[6px_6px_0px_#2563EB] overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Certified Seal on Image */}
            <div className="absolute top-4 right-4 bg-white/95 border-2 border-[#2563EB] p-2 flex items-center gap-2 shadow-[3px_3px_0px_#2563EB]">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified Logo" 
                className="w-7 h-7 object-contain" 
              />
              <div>
                <div className="text-[10px] font-mono font-black text-[#0F2A6A] uppercase leading-none">
                  CERTIFIED
                </div>
                <div className="text-[8px] font-mono text-[#3B5DB5]">
                  W3C NODE VERIFIED
                </div>
              </div>
            </div>

            {/* Category tag */}
            <div className="absolute top-4 left-4 bg-[#2563EB] text-white border-2 border-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0F2A6A]">
              {product.category}
            </div>
          </div>

          {/* Thumbnails row */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 shrink-0 bg-white border-2 overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'border-[#2563EB] shadow-[3px_3px_0px_#0F2A6A]'
                      : 'border-[#BFDBFE] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* W3C & Security Certification Strip */}
          <div className="border-2 border-[#2563EB] bg-[#F0F9FF] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_#BFDBFE]">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified" 
                className="w-8 h-8 object-contain" 
              />
              <div>
                <div className="text-xs font-mono font-black uppercase text-[#0F2A6A]">
                  Protocole de Certification W3C CertiPay
                </div>
                <div className="text-[11px] text-[#3B5DB5]">
                  Certificat d'authenticité horodaté • Hachage vérifié
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-white border border-[#2563EB] px-2.5 py-1 font-bold text-[#0F2A6A]">
              ID: W3C-{product.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}
            </div>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-[#2563EB] bg-white p-6 shadow-[6px_6px_0px_#2563EB] space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-bold">
                  En Stock ({product.stock || 8} ex.)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-heading text-[#0F2A6A] mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="border-y-2 border-[#BFDBFE] py-3 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#3B5DB5]">Prix d'acquisition</div>
                <div className="text-3xl font-black font-mono text-[#0F2A6A]">
                  {product.price.toFixed(2)} €
                </div>
              </div>
              <div className="text-right text-[11px] font-mono text-[#3B5DB5]">
                TVA incluse • Port calculé au paiement
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A]">Description Officielle :</h3>
              <p className="text-xs sm:text-sm text-[#1E40AF] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications list */}
            <div className="border border-[#BFDBFE] bg-[#F8FAFC] p-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#3B5DB5]">Conformité :</span>
                <span className="font-bold text-[#0F2A6A]">Réseau W3C & CertiPay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3B5DB5]">Finitions :</span>
                <span className="font-bold text-[#0F2A6A]">Angles Droits Architecturaux</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3B5DB5]">Expédition :</span>
                <span className="font-bold text-emerald-700">Sous 24h avec suivi sécurisé</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A] mb-2">
                Quantité :
              </label>
              <div className="flex items-center gap-3">
                <div className="flex border-2 border-[#2563EB] bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-base hover:bg-[#E0F2FE] border-r-2 border-[#2563EB]"
                  >
                    -
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center font-mono font-bold text-sm text-[#0F2A6A]">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-base hover:bg-[#E0F2FE] border-l-2 border-[#2563EB]"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs font-mono text-[#3B5DB5]">
                  Total : <span className="font-bold text-[#0F2A6A]">{(product.price * quantity).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => onBuyNow(product, quantity)}
                className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-extrabold uppercase tracking-wider border-2 border-[#2563EB] shadow-[4px_4px_0px_#0F2A6A] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Acheter maintenant • {(product.price * quantity).toFixed(2)} €</span>
              </button>

              <button
                onClick={() => onAddToCart(product, quantity)}
                className="w-full py-3 px-4 bg-white hover:bg-[#E0F2FE] text-[#0F2A6A] text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ajouter au panier</span>
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="pt-3 border-t border-[#BFDBFE] grid grid-cols-2 gap-3 text-[11px] text-[#3B5DB5]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Livraison express</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Retours 30 jours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>CertiPay W3C Crypté</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#2563EB]" onClick={handleShare}>
                <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{copied ? 'Lien copié !' : 'Partager la fiche'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same Category */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t-2 border-[#2563EB] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                Même catégorie
              </span>
              <h2 className="text-2xl font-extrabold uppercase font-heading text-[#0F2A6A]">
                Autres produits dans {product.category}
              </h2>
            </div>
            <button
              onClick={() => onSelectCategory(product.category)}
              className="text-xs font-bold uppercase font-mono text-[#2563EB] hover:underline"
            >
              Voir toute la catégorie ({product.category}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.slice(0, 4).map((rp) => (
              <div
                key={rp.id}
                onClick={() => onViewProduct(rp.id)}
                className="cursor-pointer border-2 border-[#2563EB] bg-white p-3 shadow-[3px_3px_0px_#2563EB] hover:shadow-[5px_5px_0px_#0F2A6A] hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square bg-[#EFF6FF] border border-[#BFDBFE] overflow-hidden mb-2">
                  <img src={rp.image} alt={rp.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] font-mono text-[#2563EB] uppercase font-bold">{rp.category}</div>
                <div className="text-xs font-bold text-[#0F2A6A] truncate uppercase">{rp.name}</div>
                <div className="text-sm font-black font-mono text-[#0F2A6A] mt-1">{rp.price.toFixed(2)} €</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
