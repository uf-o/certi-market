import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  PackageCheck,
  ShoppingBag
} from 'lucide-react';
import { CartItem, Product, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  directProduct?: { product: Product; quantity: number } | null;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  directProduct,
  onOrderSuccess,
  onClearCart,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'certipay' | 'card' | 'applepay'>('certipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [fullName, setFullName] = useState('Jean-Christophe');
  const [email, setEmail] = useState('contact@certi-market.com');
  const [address, setAddress] = useState('12 Avenue des Gobelins');
  const [city, setCity] = useState('Paris');
  const [postalCode, setPostalCode] = useState('75005');
  const [phone, setPhone] = useState('06 12 34 56 78');

  if (!isOpen) return null;

  // Determine active checkout items
  const checkoutItems: CartItem[] = directProduct 
    ? [{ product: directProduct.product, quantity: directProduct.quantity }]
    : items;

  const subtotal = checkoutItems.reduce(
    (acc, it) => acc + it.product.price * it.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 9.90;
  const total = subtotal + shipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate W3C CertiPay Merchant payment transaction
    setTimeout(() => {
      const newOrder: Order = {
        id: `CM-W3C-${Math.floor(100000 + Math.random() * 900000)}`,
        items: checkoutItems,
        total,
        customer: {
          fullName,
          email,
          address,
          city,
          postalCode,
          phone,
        },
        paymentMethod,
        date: new Date().toISOString(),
        status: 'confirmed',
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      if (!directProduct) {
        onClearCart();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-2 border-[#2563EB] shadow-[10px_10px_0px_#0F2A6A] my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#2563EB] text-white p-4 flex items-center justify-between border-b-2 border-[#0F2A6A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white p-1 flex items-center justify-center border border-white">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h2 className="text-sm font-extrabold font-mono tracking-wider uppercase">
                Passerelle d'Achat Sécurisée • CertiPay W3C
              </h2>
              <div className="text-[10px] text-blue-200 font-mono">
                SDK certipay-merchant-sdk.js • Connexion active
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-white/50 hover:bg-white hover:text-[#2563EB] flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Order Completed View */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center shadow-[4px_4px_0px_#059669]">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 uppercase tracking-widest inline-block">
                Paiement W3C Validé & Confirmé
              </span>
              <h3 className="text-2xl font-black font-heading uppercase text-[#0F2A6A] pt-2">
                Merci pour votre commande !
              </h3>
              <p className="text-xs font-mono text-[#3B5DB5]">
                Référence Certifiée : <span className="font-bold text-[#0F2A6A]">{completedOrder.id}</span>
              </p>
            </div>

            {/* Order Details Recap */}
            <div className="border-2 border-[#2563EB] bg-[#F0F9FF] p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-[#BFDBFE] pb-2 font-bold text-[#0F2A6A]">
                <span>Articles commandés ({completedOrder.items.length}) :</span>
                <span>Total : {completedOrder.total.toFixed(2)} €</span>
              </div>
              {completedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[#3B5DB5]">
                  <span>{it.quantity}x {it.product.name} ({it.product.category})</span>
                  <span className="font-bold text-[#0F2A6A]">{(it.product.price * it.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <div className="border-t border-[#BFDBFE] pt-2 text-[#0F2A6A]">
                <div><span className="text-[#3B5DB5]">Livraison :</span> {completedOrder.customer.fullName}, {completedOrder.customer.address}, {completedOrder.customer.postalCode} {completedOrder.customer.city}</div>
                <div><span className="text-[#3B5DB5]">Protocole :</span> CertiPay W3C Network (Transmutation Silica Active)</div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB] shadow-[4px_4px_0px_#0F2A6A] transition-all"
              >
                Continuer mes achats sur certi-market
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Customer and Shipping details */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-[#BFDBFE] pb-2">
                  <Truck className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A]">
                    1. Coordonnées et Livraison
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                      Nom complet :
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                        Email :
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                        Téléphone :
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                      Adresse de livraison :
                    </label>
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                        Code Postal :
                      </label>
                      <input
                        required
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                        Ville :
                      </label>
                      <input
                        required
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 px-3 text-xs border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-[#BFDBFE] pb-2">
                    <Lock className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A]">
                      2. Mode de Règlement Sécurisé
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('certipay')}
                      className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'certipay'
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[2px_2px_0px_#2563EB]'
                          : 'border-[#BFDBFE] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src="/assets/aistudio/certified-logo_b9de136c.png" 
                          alt="CertiPay" 
                          className="w-6 h-6 object-contain" 
                        />
                        <div>
                          <div className="text-xs font-mono font-bold uppercase text-[#0F2A6A]">
                            CertiPay Merchant (Réseau W3C)
                          </div>
                          <div className="text-[10px] text-[#3B5DB5]">
                            Paiement instantané certifié sans frais
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-[#2563EB] text-white px-2 py-0.5 font-bold uppercase">
                        Recommandé
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[2px_2px_0px_#2563EB]'
                          : 'border-[#BFDBFE] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#2563EB]" />
                        <div>
                          <div className="text-xs font-mono font-bold uppercase text-[#0F2A6A]">
                            Carte Bancaire / Visa / Mastercard
                          </div>
                          <div className="text-[10px] text-[#3B5DB5]">
                            Chiffrement bancaire 3D Secure
                          </div>
                        </div>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('applepay')}
                      className={`flex items-center justify-between p-3 border-2 cursor-pointer transition-all ${
                        paymentMethod === 'applepay'
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-[2px_2px_0px_#2563EB]'
                          : 'border-[#BFDBFE] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold"> / G Pay</span>
                        <div>
                          <div className="text-xs font-mono font-bold uppercase text-[#0F2A6A]">
                            Apple Pay / Google Wallet
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 border-2 border-[#2563EB] bg-[#F0F9FF] p-4 space-y-4 shadow-[4px_4px_0px_#2563EB]">
                <div className="flex items-center gap-2 border-b-2 border-[#BFDBFE] pb-2">
                  <ShoppingBag className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A]">
                    Récapitulatif Panier
                  </h3>
                </div>

                {/* Items List */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {checkoutItems.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 border border-[#BFDBFE] bg-white p-2 text-xs">
                      <img src={it.product.image} alt={it.product.name} className="w-10 h-10 object-cover border border-[#BFDBFE]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#0F2A6A] truncate uppercase">{it.product.name}</div>
                        <div className="text-[10px] text-[#3B5DB5]">{it.quantity} × {it.product.price.toFixed(2)} €</div>
                      </div>
                      <div className="font-mono font-bold text-[#0F2A6A]">
                        {(it.product.price * it.quantity).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation */}
                <div className="border-t-2 border-[#BFDBFE] pt-3 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-[#3B5DB5]">
                    <span>Sous-total articles :</span>
                    <span className="font-bold text-[#0F2A6A]">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-[#3B5DB5]">
                    <span>Frais de port certifiés :</span>
                    <span className="font-bold text-[#0F2A6A]">
                      {shipping === 0 ? 'Offerts' : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="border-t border-[#BFDBFE] pt-2 flex justify-between text-sm font-black text-[#0F2A6A]">
                    <span>TOTAL À RÉGLER :</span>
                    <span className="text-[#2563EB] text-base">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="border border-[#BFDBFE] bg-white p-2.5 flex items-center gap-2 text-[10px] text-[#3B5DB5]">
                  <img 
                    src="/assets/aistudio/certified-logo_b9de136c.png" 
                    alt="Certified" 
                    className="w-5 h-5 object-contain" 
                  />
                  <span>
                    Conformité W3C & SDK CertiPay actif. Protection acheteur garantie.
                  </span>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider border-2 border-[#2563EB] shadow-[4px_4px_0px_#0F2A6A] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Traitement W3C CertiPay en cours...</span>
                  ) : (
                    <>
                      <span>Confirmer et Payer • {total.toFixed(2)} €</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
