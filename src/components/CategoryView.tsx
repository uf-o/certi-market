import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, Grid, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CategoryViewProps {
  category: string;
  products: Product[];
  onBackToHome: () => void;
  onSelectCategory: (cat: string) => void;
  allCategories: string[];
  onViewProduct: (productId: string) => void;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  products,
  onBackToHome,
  onSelectCategory,
  allCategories,
  onViewProduct,
  onBuyNow,
  onAddToCart,
}) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products for this specific category
  const categoryProducts = useMemo(() => {
    let list = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, category, search, sort]);

  // Pagination calculation
  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return categoryProducts.slice(start, start + itemsPerPage);
  }, [categoryProducts, currentPage, itemsPerPage]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Banner with Sharp Angles */}
      <div className="border-2 border-[#2563EB] bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#2563EB]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#BFDBFE] pb-5">
          <div className="space-y-1">
            <button
              onClick={onBackToHome}
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:underline flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au catalogue global
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-[#2563EB] text-white px-2 py-0.5 font-bold uppercase tracking-widest">
                Catégorie Officielle
              </span>
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified" 
                className="w-5 h-5 object-contain" 
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase font-heading text-[#0F2A6A]">
              {category}
            </h1>
          </div>

          <div className="border-2 border-[#2563EB] bg-[#F0F9FF] p-3 text-right">
            <div className="text-2xl font-black font-mono text-[#0F2A6A]">
              {categoryProducts.length}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#3B5DB5]">
              Produits dans cette catégorie
            </div>
          </div>
        </div>

        {/* Other Categories Switcher */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#3B5DB5] uppercase font-bold mr-1">
            Changer de catégorie :
          </span>
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => {
                onSelectCategory(c);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
                c.toLowerCase() === category.toLowerCase()
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white text-[#0F2A6A] border-[#BFDBFE] hover:border-[#2563EB]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-2 border-[#2563EB] bg-white p-4 shadow-[4px_4px_0px_#2563EB] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md border-2 border-[#2563EB] px-3 py-1.5 bg-[#F0F9FF]">
          <Search className="w-4 h-4 text-[#2563EB]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Filtrer dans ${category}...`}
            className="w-full text-xs font-medium text-[#0F2A6A] bg-transparent outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs font-bold text-[#2563EB]">
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-mono font-bold uppercase text-[#3B5DB5]">Trier :</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="border-2 border-[#2563EB] bg-white text-xs font-mono font-bold text-[#0F2A6A] px-3 py-2 outline-none cursor-pointer"
          >
            <option value="default">Par défaut</option>
            <option value="price-asc">Prix : Moins cher au plus cher</option>
            <option value="price-desc">Prix : Plus cher au moins cher</option>
            <option value="name">Alphabétique (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="border-2 border-dashed border-[#2563EB] bg-white p-12 text-center shadow-[4px_4px_0px_#2563EB] space-y-3">
          <div className="text-xl font-bold font-heading uppercase text-[#0F2A6A]">
            Aucun produit trouvé dans la catégorie « {category} »
          </div>
          <p className="text-xs text-[#3B5DB5] max-w-md mx-auto">
            Aucun résultat ne correspond à votre recherche ou aucun produit n'a encore été importé dans cette catégorie.
          </p>
          <button
            onClick={() => {
              setSearch('');
              onBackToHome();
            }}
            className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB]"
          >
            Retourner à l'accueil
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onViewProduct}
              onBuyNow={onBuyNow}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-2 border-[#2563EB] bg-white p-4 shadow-[4px_4px_0px_#2563EB] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#3B5DB5]">
            Page <span className="font-bold text-[#0F2A6A]">{currentPage}</span> sur{' '}
            <span className="font-bold text-[#0F2A6A]">{totalPages}</span> • {categoryProducts.length} produits au total
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border-2 border-[#2563EB] bg-white text-[#0F2A6A] hover:bg-[#E0F2FE] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs font-bold uppercase"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border-2 border-[#2563EB] bg-white text-[#0F2A6A] hover:bg-[#E0F2FE] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs font-bold uppercase"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
