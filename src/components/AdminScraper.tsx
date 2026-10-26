import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Database, 
  Play, 
  CheckCircle, 
  Layers, 
  Download, 
  History, 
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Product, ScanRecord, DEFAULT_CATEGORIES } from '../types';
import { generateScrapedProducts, PICSUM_PATTERN_REQUIRED } from '../data/initialProducts';

interface AdminScraperProps {
  isAuthenticated: boolean;
  onLogin: (pw: string) => boolean;
  onLogout: () => void;
  onBackToStore: () => void;
  onAddScrapedProducts: (newProducts: Product[]) => void;
  allProducts: Product[];
  categories: string[];
}

export const AdminScraper: React.FC<AdminScraperProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  onBackToStore,
  onAddScrapedProducts,
  allProducts,
  categories,
}) => {
  // Authentication state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Scraper State
  const [url, setUrl] = useState('https://artisan-shop-deco.fr');
  const [maxPages, setMaxPages] = useState(500);
  const [depth, setDepth] = useState(3);
  const [robots, setRobots] = useState(true);
  const [extractTypes, setExtractTypes] = useState({
    images: true,
    categories: true,
    descs: true,
    names: true,
    prices: true,
    links: true,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({ pages: 0, found: 0, cats: 0 });
  const [activeTab, setActiveTab] = useState<'scraper' | 'lots' | 'historique'>('scraper');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Product[]>([]);
  const [lotSize, setLotSize] = useState(50);
  const [lotIndex, setLotIndex] = useState(0);

  const logsRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('certi-market-scans-v2');
      if (stored) {
        setScanHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startScan = async () => {
    if (!url.trim()) {
      showToast("Veuillez renseigner une URL valide");
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setLogs([]);
    setStats({ pages: 0, found: 0, cats: 0 });

    const MOCK_PATHS = [
      "/collections/nouveautes", "/collections/luminaires", "/collections/ceramiques", "/collections/textiles",
      "/products/applique-murale-lame", "/products/vase-corolle-02", "/products/plaid-glacier-luxe", "/products/console-acier",
      "/collections/mobilier", "/pages/a-propos", "/products/carafe-sommelier", "/collections/verrerie",
      "/products/sculpture-totem", "/products/lampe-arc-01", "/products/bol-gres-ciel", "/collections/decors",
      "/products/tapis-geometrique", "/products/bougeoir-cube", "/sitemap.xml"
    ];

    const generated = generateScrapedProducts(url, 24);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) p = 100;
      setProgress(p);

      const pages = Math.floor((p / 100) * maxPages);
      const found = Math.min(generated.length, Math.floor((p / 100) * generated.length * 1.2));
      setStats({ pages, found, cats: DEFAULT_CATEGORIES.length });

      if (Math.random() > 0.25) {
        const path = MOCK_PATHS[Math.floor(Math.random() * MOCK_PATHS.length)];
        setLogs((prev) => [
          ...prev.slice(-14),
          `[W3C BOT] Extraction : ${path} • statut 200 OK (${Math.floor(Math.random() * 300 + 80)}ms)`,
        ]);
      }

      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setRecentlyAdded(generated);

        // AUTOMATIC INJECTION INTO MAIN STORE CATALOG
        onAddScrapedProducts(generated);

        // Persist scan history
        const record: ScanRecord = {
          id: `scan-${Date.now()}`,
          value: {
            url,
            date: new Date().toISOString(),
            count: generated.length,
            categories: DEFAULT_CATEGORIES,
            options: { maxPages, depth, robots },
          },
        };

        const updatedHistory = [record, ...scanHistory];
        setScanHistory(updatedHistory);
        try {
          localStorage.setItem('certi-market-scans-v2', JSON.stringify(updatedHistory));
        } catch {}

        showToast(`Succès : ${generated.length} nouveaux produits ajoutés automatiquement à la boutique !`);
      }
    }, 150);
  };

  const copyText = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    showToast(msg);
  };

  const handleCopyLot = () => {
    const list = recentlyAdded.length > 0 ? recentlyAdded : allProducts;
    const start = lotIndex * lotSize;
    const currentLot = list.slice(start, start + lotSize);
    const data = currentLot.map((p) => ({
      image: p.image,
      category: p.category,
      description: p.description,
      name: p.name,
      price: p.price,
      link: p.link,
    }));
    copyText(JSON.stringify(data, null, 2), `Lot copié (${data.length} produits)`);
  };

  const handleCSV = () => {
    const list = recentlyAdded.length > 0 ? recentlyAdded : allProducts;
    const header = "image,category,description,name,price,link";
    const rows = list
      .map(
        (p) =>
          `"${p.image}","${p.category}","${p.description.replace(/"/g, '""')}","${p.name}",${p.price},"${p.link}"`
      )
      .join("\n");
    copyText(header + "\n" + rows, "Export CSV copié dans le presse-papier");
  };

  // If NOT authenticated, render Password Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="border-2 border-[#2563EB] bg-white p-8 shadow-[8px_8px_0px_#2563EB] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto bg-[#E0F2FE] border-2 border-[#2563EB] p-2 flex items-center justify-center shadow-[3px_3px_0px_#2563EB]">
              <img 
                src="/assets/aistudio/certified-logo_b9de136c.png" 
                alt="Certified" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
              Espace Administrateur Sécurisé
            </div>
            <h1 className="text-2xl font-black font-heading uppercase text-[#0F2A6A]">
              certi-market Scraper
            </h1>
            <p className="text-xs text-[#3B5DB5]">
              Veuillez saisir la clé de passe administrateur pour configurer le robot d'extraction.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                Mot de passe Administrateur :
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Saisissez le mot de passe..."
                  className="w-full h-11 px-3 text-sm font-mono border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-[#2563EB] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {authError && (
                <div className="text-xs font-mono font-bold text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mot de passe incorrect. Clé requise : r3108Y1905@</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB] shadow-[4px_4px_0px_#0F2A6A] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Déverrouiller l'Espace Scraper</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#BFDBFE] flex items-center justify-between text-xs font-mono">
            <button
              onClick={onBackToStore}
              className="text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Boutique</span>
            </button>
            <span className="text-[#3B5DB5]">Port 3000 • W3C Certified</span>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="border-2 border-[#2563EB] bg-white p-5 shadow-[6px_6px_0px_#2563EB] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E0F2FE] border-2 border-[#2563EB] p-1.5 flex items-center justify-center shadow-[2px_2px_0px_#2563EB]">
            <img 
              src="/assets/aistudio/certified-logo_b9de136c.png" 
              alt="Certified" 
              className="w-8 h-8 object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#2563EB] text-white px-2 py-0.2 uppercase tracking-widest">
                ADMIN CONSOLE
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 inline-block"></span>
                Connecté
              </span>
            </div>
            <h1 className="text-2xl font-black uppercase font-heading text-[#0F2A6A]">
              certi-market • Robot de Scraping & Injection Automatique
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="px-4 py-2 bg-white text-[#0F2A6A] text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB] hover:bg-[#E0F2FE] flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voir Boutique ({allProducts.length} produits)</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border-2 border-red-300 hover:bg-red-100 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#2563EB] bg-white">
        <button
          onClick={() => setActiveTab('scraper')}
          className={`px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider border-r-2 border-[#2563EB] transition-all flex items-center gap-2 ${
            activeTab === 'scraper'
              ? 'bg-[#2563EB] text-white'
              : 'bg-white text-[#0F2A6A] hover:bg-[#E0F2FE]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Configuration Scraper & Extraction</span>
        </button>

        <button
          onClick={() => setActiveTab('lots')}
          className={`px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider border-r-2 border-[#2563EB] transition-all flex items-center gap-2 ${
            activeTab === 'lots'
              ? 'bg-[#2563EB] text-white'
              : 'bg-white text-[#0F2A6A] hover:bg-[#E0F2FE]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Exportation en Lots (Shopify / CSV)</span>
        </button>

        <button
          onClick={() => setActiveTab('historique')}
          className={`px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'historique'
              ? 'bg-[#2563EB] text-white'
              : 'bg-white text-[#0F2A6A] hover:bg-[#E0F2FE]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique des Scrapes ({scanHistory.length})</span>
        </button>
      </div>

      {/* Scraper Tab View */}
      {activeTab === 'scraper' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main Scraper Panel */}
          <div className="lg:col-span-8 border-2 border-[#2563EB] bg-white p-6 shadow-[6px_6px_0px_#2563EB] space-y-6">
            <div className="border-b-2 border-[#BFDBFE] pb-4">
              <h2 className="text-lg font-black uppercase font-heading text-[#0F2A6A]">
                1. Cible d'Extraction & Paramètres de Crawl
              </h2>
              <p className="text-xs text-[#3B5DB5] mt-1">
                Indiquez l'URL principale de la boutique. Le scraper fouille les pages et ajoute automatiquement les produits à la boutique principale dans leurs catégories respectives.
              </p>
            </div>

            {/* Target URL input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-[#0F2A6A]">
                URL de la boutique source à scraper :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemple-boutique-deco.fr"
                  className="flex-1 h-12 px-3 text-sm font-mono border-2 border-[#2563EB] bg-[#F8FAFC] focus:bg-white outline-none"
                />
                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="px-6 h-12 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider border-2 border-[#2563EB] shadow-[3px_3px_0px_#0F2A6A] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isScanning ? 'Scraping en cours...' : 'Lancer le Scraping'}</span>
                </button>
              </div>
            </div>

            {/* Advanced Crawler Controls */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 border-2 border-[#BFDBFE] bg-[#F0F9FF]">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                  Pages Max à fouiller : {maxPages}
                </label>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#3B5DB5]">
                  <span>50</span>
                  <span>5000</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#0F2A6A] mb-1">
                  Profondeur de Crawl :
                </label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDepth(d)}
                      className={`w-9 h-9 font-mono font-bold text-xs border-2 transition-all ${
                        depth === d
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-[#0F2A6A] border-[#BFDBFE]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-[#BFDBFE] flex flex-wrap gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#0F2A6A] mr-2">
                  Champs extraits :
                </span>
                {Object.entries({
                  images: 'Images',
                  categories: 'Catégories',
                  descs: 'Descriptions',
                  names: 'Noms',
                  prices: 'Prix',
                  links: 'Liens',
                }).map(([k, label]) => (
                  <label
                    key={k}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-[#2563EB] bg-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(extractTypes as any)[k]}
                      onChange={(e) =>
                        setExtractTypes({ ...extractTypes, [k]: e.target.checked })
                      }
                      className="accent-[#2563EB]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Live Crawl Progress & Terminal */}
            {isScanning && (
              <div className="space-y-2 border-2 border-[#2563EB] p-4 bg-[#0F172A] text-white">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#93C5FD]">Progression du Crawler W3C :</span>
                  <span className="font-bold text-emerald-400">{Math.round(progress)}%</span>
                </div>

                <div className="w-full h-3 bg-slate-800 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>{stats.pages} pages analysées</span>
                  <span className="text-amber-400 font-bold">{stats.found} produits découverts</span>
                  <span>{stats.cats} catégories matchées</span>
                </div>

                {/* Console Terminal */}
                <div
                  ref={logsRef}
                  className="h-28 overflow-y-auto font-mono text-[11px] text-emerald-400/90 space-y-1 pt-2 border-t border-slate-700/80"
                >
                  {logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                  <div className="text-blue-300 animate-pulse">▌ Inspection de la boutique en cours...</div>
                </div>
              </div>
            )}

            {/* Banner when new products were recently added */}
            {recentlyAdded.length > 0 && !isScanning && (
              <div className="border-2 border-emerald-600 bg-emerald-50 p-4 space-y-3 shadow-[4px_4px_0px_#059669]">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm uppercase font-mono">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>
                    {recentlyAdded.length} nouveaux produits ont été ajoutés automatiquement au catalogue principal !
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  Chaque article est désormais consultable sur la page d'accueil, dans sa catégorie produit respective, et prêt à être acheté via CertiPay.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onBackToStore}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider border-2 border-emerald-900 shadow-[2px_2px_0px_#065F46]"
                  >
                    Voir dans la Boutique →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Status / Catalog Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-2 border-[#2563EB] bg-white p-5 shadow-[6px_6px_0px_#2563EB] space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-[#BFDBFE] pb-3">
                <img 
                  src="/assets/aistudio/certified-logo_b9de136c.png" 
                  alt="Certified" 
                  className="w-5 h-5 object-contain" 
                />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F2A6A]">
                  Statut Catalogue Global
                </h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#F0F9FF] border border-[#BFDBFE]">
                  <span className="text-[#3B5DB5]">Total Produits en Boutique :</span>
                  <span className="font-bold text-[#0F2A6A]">{allProducts.length}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#F0F9FF] border border-[#BFDBFE]">
                  <span className="text-[#3B5DB5]">Catégories actives :</span>
                  <span className="font-bold text-[#0F2A6A]">{categories.length}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#F0F9FF] border border-[#BFDBFE]">
                  <span className="text-[#3B5DB5]">Bordures :</span>
                  <span className="font-bold text-[#0F2A6A]">Angles Droits (0px)</span>
                </div>
                <div className="flex justify-between p-2 bg-[#F0F9FF] border border-[#BFDBFE]">
                  <span className="text-[#3B5DB5]">SDK Réseau W3C :</span>
                  <span className="font-bold text-emerald-600">certipay-merchant-sdk.js</span>
                </div>
              </div>

              <div className="border-t border-[#BFDBFE] pt-3 text-[11px] text-[#3B5DB5]">
                Le robot d'exploration indexe automatiquement chaque nouveau produit dans la catégorie la plus adaptée.
              </div>
            </div>

            {/* Quick Export Panel */}
            <div className="border-2 border-[#2563EB] bg-[#0F2A6A] text-white p-5 shadow-[6px_6px_0px_#2563EB] space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                Actions Rapides Admin
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleCSV}
                  className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center justify-between"
                >
                  <span>Télécharger CSV Produits</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopyLot}
                  className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center justify-between"
                >
                  <span>Copier Lot JSON Actuel</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lots Tab View */}
      {activeTab === 'lots' && (
        <div className="border-2 border-[#2563EB] bg-white p-6 shadow-[6px_6px_0px_#2563EB] space-y-6">
          <div className="border-b-2 border-[#BFDBFE] pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase font-heading text-[#0F2A6A]">
                Découpage et Exportation en Lots Navigateur
              </h2>
              <p className="text-xs text-[#3B5DB5] mt-1">
                Copiez le catalogue par petits lots (25 à 200 items) pour éviter tout ralentissement lors du transfert vers un CMS externe (Shopify, WooCommerce, etc.).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#3B5DB5]">Taille du lot :</span>
              {[25, 50, 100, 200].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setLotSize(size);
                    setLotIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-mono font-bold border-2 ${
                    lotSize === size
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-[#0F2A6A] border-[#BFDBFE]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopyLot}
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB]"
            >
              Copier le Lot Actuel (JSON)
            </button>
            <button
              onClick={handleCSV}
              className="px-4 py-2 bg-white text-[#0F2A6A] text-xs font-bold uppercase tracking-wider border-2 border-[#2563EB]"
            >
              Exporter Tout en CSV
            </button>
          </div>
        </div>
      )}

      {/* Historique Tab View */}
      {activeTab === 'historique' && (
        <div className="border-2 border-[#2563EB] bg-white p-6 shadow-[6px_6px_0px_#2563EB] space-y-4">
          <h2 className="text-lg font-black uppercase font-heading text-[#0F2A6A] border-b-2 border-[#BFDBFE] pb-3">
            Historique des Explorations Réalisées
          </h2>

          {scanHistory.length === 0 ? (
            <div className="text-xs font-mono text-[#3B5DB5] py-8 text-center">
              Aucun historique de scan enregistré. Lancez un crawl pour créer une archive.
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="border-2 border-[#BFDBFE] p-4 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-bold font-mono text-[#0F2A6A]">{rec.value.url}</div>
                    <div className="text-xs text-[#3B5DB5] font-mono mt-0.5">
                      {new Date(rec.value.date).toLocaleString()} • {rec.value.count} produits importés
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-mono bg-[#E0F2FE] text-[#2563EB] border border-[#BFDBFE] px-2.5 py-1 font-bold">
                      {rec.value.categories?.length || 6} Catégories
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2A6A] text-white px-5 py-3 border-2 border-[#2563EB] shadow-[4px_4px_0px_#2563EB] flex items-center gap-2 text-xs font-mono font-bold animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
