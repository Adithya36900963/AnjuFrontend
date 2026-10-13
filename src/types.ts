export interface ProductVariant {
  name: string;
  image: string;
  colorHex?: string;
  images?: string[]; // Multiple photos for this specific variant (front, angle, close-up, back)
}

export interface Product {
  id: string;
  name: string;
  category: 'dresses' | 'sunglasses' | 'bags' | 'jewellery' | 'watches' | 'hair' | 'hats' | 'necklaces' | 'tech';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  images?: string[]; // Multiple photos for the product
  badge?: string;
  isBestSeller?: boolean;
  colors?: string[];
  colorVariants?: ProductVariant[];
  sizes?: string[]; // Sizing for dresses & apparel, e.g. ['XS', 'S', 'M', 'L', 'XL']
  description: string;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariantImage?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVip: boolean;
  tier: string;
  joinedDate: string;
}

// -------------------------------------------------------------
// Address & Location Types matching Spring Boot Backend DTOs
// -------------------------------------------------------------
export type CustomerAddressType = 'HOME' | 'WORK' | 'OTHER';
export type AdminAddressType = 'WAREHOUSE' | 'HEADQUARTERS' | 'STORE' | 'DISPATCH_CENTER';

export interface CustomerLocationRes {
  id: number;
  customerId: number;
  // Basic location
  countryId: number;
  stateId: number;
  districtId: number;
  countryName: string;
  stateName: string;
  districtName: string;
  pincode: string;
  // Customer address
  addressLine1: string;
  addressLine2?: string;
  cityVillage: string;
  landmark?: string;
  // Contact
  mobileNumber: string;
  alternatePhone?: string;
  // Address type
  addressType: CustomerAddressType;
  // GPS
  latitude?: number;
  longitude?: number;
  // Default address
  defaultAddress: boolean;
}

export interface AdminLocationRes {
  id: number;
  countryId: number;
  stateId: number;
  districtId: number;
  countryName: string;
  stateName: string;
  districtName: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  cityVillage: string;
  landmark?: string;
  mobileNumber: string;
  alternatePhone?: string;
  addressType: AdminAddressType;
  latitude?: number;
  longitude?: number;
  defaultAddress: boolean;
}

export interface LocationReq {
  countryId?: number;
  stateId?: number;
  districtId?: number;
  customerAddressType?: CustomerAddressType;
  adminAddressType?: AdminAddressType;
  addressLine1: string;
  addressLine2?: string;
  cityVillage: string;
  landmark?: string;
  pincode: string;
  mobileNumber: string;
  alternatePhone?: string;
  latitude?: number;
  longitude?: number;
}

export interface PincodeReq {
  pincode: string;
}

export interface PincodeRes {
  countryId: number;
  stateId: number;
  districtId: number;
  countryName: string;
  stateName: string;
  districtName: string;
  pincode: string;
}

export interface APIRes<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'online' | 'cod';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface OrderItem {
  id: string;
  product: Product;
  sku: string;
  name: string;
  selectedColor?: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  total: number;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  productTotal: number;
  deliveryCharges: number;
  codCharges: number;
  grandTotal: number;
}

export interface OrderTimelineStep {
  label: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
}

export interface PaymentLog {
  title: string;
  timestamp: string;
  details?: string;
  transactionId?: string;
  amount?: number;
  type: 'init' | 'success' | 'failed';
}

export interface Order {
  id: string;
  hash: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    name: string;
    addressLine: string;
    city: string;
    state: string;
    pin: string;
    country: string;
  };
  items: OrderItem[];
  pricing: OrderPricing;
  status: OrderStatus;
  payment: {
    type: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
    attempts: number;
    methodDetail?: string;
  };
  delivery: {
    carrier: string;
    awbNumber?: string;
    status: string;
  };
  timeline: OrderTimelineStep[];
  paymentLogs: PaymentLog[];
}
