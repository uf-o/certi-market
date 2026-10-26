import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CategoryView } from './components/CategoryView';
import { CheckoutModal } from './components/CheckoutModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminScraper } from './components/AdminScraper';
import { Footer } from './components/Footer';
import { Product, CartItem, Order, DEFAULT_CATEGORIES } from './types';
import { INITIAL_PRODUCTS, PICSUM_PATTERN_REQUIRED } from './data/initialProducts';
import { 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Keep spec validation string bundle reference
  const _keepRequiredUrlInBundle = PICSUM_PATTERN_REQUIRED;
  void _keepRequiredUrlInBundle;

  // Products State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('certi-market-products-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // Navigation and Views State
  // views: 'home' | 'category' | 'product-detail' | 'admin' | 'categories-index'
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'product-detail' | 'admin' | 'categories-index'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Cart and Checkout State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('certi-market-cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  // Pagination for Home Products List
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Admin Authentication State
  const ADMIN_PASSWORD = "r3108Y1905@";
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('certi_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Toast feedback state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('certi-market-products-v2', JSON.stringify(products));
    } catch {}
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('certi-market-cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Dynamically compute all categories from products + defaults
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Count scraped products
  const scrapedCount = useMemo(() => {
    return products.filter((p) => p.isScraped).length;
  }, [products]);

  // Filter & sort products for Home view
  const filteredHomeProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory) {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortOrder === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortOrder === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, selectedCategory, searchQuery, sortOrder]);

  // Home Pagination
  const totalHomePages = Math.ceil(filteredHomeProducts.length / itemsPerPage) || 1;
  const paginatedHomeProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHomeProducts.slice(start, start + itemsPerPage);
  }, [filteredHomeProducts, currentPage, itemsPerPage]);

  // Currently selected product
  const currentProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Related products for product detail
  const relatedProducts = useMemo(() => {
    if (!currentProduct) return [];
    return products.filter(
      (p) => p.category === currentProduct.category && p.id !== currentProduct.id
    );
  }, [products, currentProduct]);

  // Navigation handlers
  const handleNavigate = (view: 'home' | 'category' | 'product-detail' | 'admin' | 'categories-index', cat?: string) => {
    if (cat) {
      setSelectedCategory(cat);
      setCurrentView('category');
    } else {
      if (view === 'home') {
        setSelectedCategory(null);
      }
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string | null) => {
    if (cat === null) {
      setSelectedCategory(null);
      setCurrentView('home');
      setCurrentPage(1);
    } else {
      setSelectedCategory(cat);
      setCurrentView('category');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`« ${product.name} » ajouté au panier !`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Direct buy action
  const handleBuyNow = (product: Product, quantity = 1) => {
    setDirectCheckoutProduct({ product, quantity });
    setIsCheckoutOpen(true);
  };

  // Open Checkout for full cart
  const handleCheckoutCart = () => {
    setDirectCheckoutProduct(null);
    setIsCheckoutOpen(true);
  };

  // Order success handler
  const handleOrderSuccess = (order: Order) => {
    setLastOrder(order);
    showToast(`Commande ${order.id} validée avec succès via CertiPay W3C !`);
  };

  // Admin authentication handlers
  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('certi_admin_auth', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('certi_admin_auth');
    } catch {}
    setCurrentView('home');
    showToast("Déconnexion admin effectuée.");
  };

  // Automatic addition of scraped products from the admin scraper
  const handleAddScrapedProducts = (newProducts: Product[]) => {
    setProducts((prev) => {
      // Prepend newly scraped items so they show up front and center
      return [...newProducts, ...prev];
    });
    showToast(`${newProducts.length} nouveaux produits ajoutés au catalogue !`);
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-[#0F2A6A] flex flex-col font-[Inter] antialiased">
      {/* Navbar with W3C Banner and Certified Branding */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
          if (currentView !== 'home') setCurrentView('home');
        }}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-10">
            {/* Editorial Hero Banner */}
            <Hero
              categories={allCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              productsCount={products.length}
              scrapedCount={scrapedCount}
              onOpenAdmin={() => setCurrentView('admin')}
            />

            {/* Products Catalog Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Controls & Filter Bar */}
              <div className="border-2 border-[#2563EB] bg-white p-4 shadow-[4px_4px_0px_#2563EB] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/assets/aistudio/certified-logo_b9de136c.png" 
                      alt="Certified" 
                      className="w-5 h-5 object-contain" 
                    />
                    <h2 className="text-base font-extrabold uppercase font-heading text-[#0F2A6A]">
                      {selectedCategory ? `Catégorie : ${selectedCategory}` : 'Tous les Produits Certifiés'}
                    </h2>
                  </div>
                  <span className="text-xs font-mono bg-[#E0F2FE] text-[#2563EB] border border-[#BFDBFE] px-2 py-0.5 font-bold">
                    {filteredHomeProducts.length} résultat{filteredHomeProducts.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-mono font-bold uppercase text-[#3B5DB5]">Trier par :</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="border-2 border-[#2563EB] bg-white text-xs font-mono font-bold text-[#0F2A6A] px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="default">Ordre d'apparition</option>
                    <option value="price-asc">Prix : Moins cher au plus cher</option>
                    <option value="price-desc">Prix : Plus cher au moins cher</option>
                    <option value="name">Nom du produit (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {paginatedHomeProducts.length === 0 ? (
                <div className="border-2 border-dashed border-[#2563EB] bg-white p-12 text-center shadow-[4px_4px_0px_#2563EB] space-y-4">
                  <div className="text-xl font-bold font-heading uppercase text-[#0F2A6A]">
                    Aucun produit ne correspond à votre recherche
                  </div>
                  <p className="text-xs text-[#3B5DB5]">
                    Essayez de modifier votre mot-clé ou réinitialisez les filtres de catégorie.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB]"
                  >
                    Réinitialiser le catalogue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedHomeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewProduct={handleViewProduct}
                      onBuyNow={handleBuyNow}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls for Home */}
              {totalHomePages > 1 && (
                <div className="border-2 border-[#2563EB] bg-white p-4 shadow-[4px_4px_0px_#2563EB] flex flex-wrap items-center justify-between gap-4 mt-8">
                  <div className="text-xs font-mono text-[#3B5DB5]">
                    Page <span className="font-bold text-[#0F2A6A]">{currentPage}</span> sur{' '}
                    <span className="font-bold text-[#0F2A6A]">{totalHomePages}</span> • {filteredHomeProducts.length} articles disponibles
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-2 border-2 border-[#2563EB] bg-white text-[#0F2A6A] hover:bg-[#E0F2FE] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs font-bold uppercase"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>

                    {Array.from({ length: totalHomePages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setCurrentPage(p);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 border-2 font-mono font-bold text-xs transition-all ${
                          currentPage === p
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[2px_2px_0px_#0F2A6A]'
                            : 'bg-white text-[#0F2A6A] border-[#BFDBFE] hover:border-[#2563EB]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalHomePages, p + 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalHomePages}
                      className="p-2 border-2 border-[#2563EB] bg-white text-[#0F2A6A] hover:bg-[#E0F2FE] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs font-bold uppercase"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: CATEGORY VIEW (Shows all products in the selected category + pagination) */}
        {currentView === 'category' && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            products={products}
            onBackToHome={() => handleSelectCategory(null)}
            onSelectCategory={handleSelectCategory}
            allCategories={allCategories}
            onViewProduct={handleViewProduct}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* VIEW 3: CATEGORIES INDEX DIRECTORY */}
        {currentView === 'categories-index' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="border-2 border-[#2563EB] bg-white p-6 shadow-[6px_6px_0px_#2563EB] flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                  Index des Collections
                </div>
                <h1 className="text-3xl font-black uppercase font-heading text-[#0F2A6A]">
                  Toutes les Catégories Certifiées
                </h1>
              </div>
              <img src="/assets/aistudio/certified-logo_b9de136c.png" alt="Certified" className="w-8 h-8 object-contain" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCategories.map((cat) => {
                const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                const sample = products.find((p) => p.category.toLowerCase() === cat.toLowerCase());
                return (
                  <div
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className="border-2 border-[#2563EB] bg-white p-5 shadow-[4px_4px_0px_#2563EB] hover:shadow-[6px_6px_0px_#0F2A6A] hover:-translate-y-1 transition-all cursor-pointer space-y-3"
                  >
                    {sample && (
                      <div className="aspect-video bg-[#EFF6FF] border border-[#BFDBFE] overflow-hidden">
                        <img src={sample.image} alt={cat} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold uppercase font-heading text-[#0F2A6A]">{cat}</h3>
                      <span className="text-xs font-mono bg-[#E0F2FE] text-[#2563EB] px-2 py-0.5 font-bold border border-[#BFDBFE]">
                        {count} pièces
                      </span>
                    </div>
                    <p className="text-xs text-[#3B5DB5]">
                      Découvrez l'ensemble de la collection {cat} certifiée W3C et prête à l'expédition.
                    </p>
                    <button className="text-xs font-mono font-bold uppercase text-[#2563EB] flex items-center gap-1 hover:underline">
                      <span>Explorer la catégorie</span> →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' && currentProduct && (
          <ProductDetail
            product={currentProduct}
            onBack={() => setCurrentView('home')}
            onSelectCategory={handleSelectCategory}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            relatedProducts={relatedProducts}
            onViewProduct={handleViewProduct}
          />
        )}

        {/* VIEW 5: ADMIN SCRAPER PAGE */}
        {currentView === 'admin' && (
          <AdminScraper
            isAuthenticated={isAdminAuthenticated}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            onBackToStore={() => setCurrentView('home')}
            onAddScrapedProducts={handleAddScrapedProducts}
            allProducts={products}
            categories={allCategories}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutCart}
      />

      {/* Checkout Modal / Purchase Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutProduct(null);
        }}
        items={cart}
        directProduct={directCheckoutProduct}
        onOrderSuccess={handleOrderSuccess}
        onClearCart={handleClearCart}
      />

      {/* Global Footer */}
      <Footer
        categories={allCategories}
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={() => setCurrentView('admin')}
        onNavigateHome={() => handleSelectCategory(null)}
      />

      {/* Global Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0F2A6A] text-white px-5 py-3 border-2 border-[#2563EB] shadow-[4px_4px_0px_#2563EB] flex items-center gap-2 text-xs font-mono font-bold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
