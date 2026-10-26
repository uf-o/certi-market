import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l-2 border-[#2563EB] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#2563EB] text-white p-4 flex items-center justify-between border-b-2 border-[#0F2A6A]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider">
              Votre Panier ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-white/40 hover:bg-white hover:text-[#2563EB] flex items-center justify-center font-bold text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#BFDBFE]" />
              <div className="font-heading font-bold uppercase text-[#0F2A6A]">Votre panier est vide</div>
              <p className="text-xs text-[#3B5DB5]">
                Découvrez nos collections certifiées et ajoutez vos pièces coup de cœur.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB]"
              >
                Explorer la boutique
              </button>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.product.id}
                className="border-2 border-[#BFDBFE] p-3 flex gap-3 bg-[#F8FAFC] relative group hover:border-[#2563EB] transition-all"
              >
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="w-16 h-16 object-cover border border-[#BFDBFE] bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
                    {it.product.category}
                  </div>
                  <h4 className="text-xs font-bold text-[#0F2A6A] uppercase truncate">
                    {it.product.name}
                  </h4>
                  <div className="text-xs font-black font-mono text-[#0F2A6A] mt-1">
                    {it.product.price.toFixed(2)} €
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex border border-[#2563EB] bg-white">
                      <button
                        onClick={() => onUpdateQuantity(it.product.id, it.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold border-r border-[#2563EB] hover:bg-[#E0F2FE]"
                      >
                        -
                      </button>
                      <span className="w-8 h-6 flex items-center justify-center font-mono text-xs font-bold text-[#0F2A6A]">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(it.product.id, it.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold border-l border-[#2563EB] hover:bg-[#E0F2FE]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(it.product.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-[#2563EB] bg-[#F0F9FF] p-4 space-y-3">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-xs uppercase font-bold text-[#3B5DB5]">Total Panier :</span>
              <span className="text-xl font-black text-[#0F2A6A]">{total.toFixed(2)} €</span>
            </div>

            <div className="text-[10px] text-[#3B5DB5] flex items-center gap-1.5 font-mono">
              <img src="/assets/aistudio/certified-logo_b9de136c.png" alt="Certified" className="w-4 h-4" />
              <span>Conforme W3C • Paiement CertiPay sécurisé</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black uppercase tracking-wider border-2 border-[#2563EB] shadow-[3px_3px_0px_#0F2A6A] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
