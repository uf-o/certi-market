export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  link: string;
  sourceUrl?: string;
  isScraped?: boolean;
  createdAt?: string;
  stock?: number;
  featured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'certipay' | 'card' | 'applepay';
  date: string;
  status: 'confirmed' | 'processing';
};

export type ScanRecord = {
  id: string;
  value: {
    url: string;
    date: string;
    count: number;
    categories: string[];
    options?: {
      maxPages: number;
      depth: number;
      robots: boolean;
    };
  };
};

export const DEFAULT_CATEGORIES = [
  "Luminaires",
  "Textiles",
  "Céramiques",
  "Mobilier",
  "Verrerie",
  "Décors"
];
