// Product type definitions

export interface Product {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  description?: string;
  ingredients?: string[];
  productInfo?: string;
  variants?: string[];
  tags?: string[];
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  quantity: number;
  status: 'in-stock' | 'out-of-stock' | 'limited';
  inStock: boolean;
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  ingredients: string[];
  productInfo: string;
  variants: string[];
  tags: string[];
  category: string;
  price: number;
  originalPrice: number;
  quantity: number;
  images: string[];
}

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

