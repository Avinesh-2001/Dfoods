export interface Product {
  id: number;
  name: string;
  category: 'plain-jaggery' | 'jaggery-powder' | 'jaggery-cubes' | 'flavoured-jaggery' | 'gud-combo';
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  sizes: string[];
  description: string;
  benefits: string[];
  ingredients?: string[];
  storageConditions?: string[];
  inStock: boolean;
  flavor?: string;
  weight?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FilterOptions {
  category: string;
  priceRange: [number, number];
  flavor?: string;
  inStock: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}
