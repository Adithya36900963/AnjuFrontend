export interface Product {
  id: string;
  name: string;
  category: 'sunglasses' | 'bags' | 'jewellery' | 'watches' | 'hair' | 'hats' | 'necklaces' | 'tech';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  badge?: string;
  isBestSeller?: boolean;
  colors?: string[];
  description: string;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}
