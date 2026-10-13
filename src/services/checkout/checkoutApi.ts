import apiClient from '../../api/axios';
import { CartItem, CustomerLocationRes } from '../../types';

export interface CheckoutCalculation {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  message: string;
}

export const checkoutApi = {
  async calculateTotals(cart: CartItem[], address?: CustomerLocationRes | null, couponCode?: string): Promise<CheckoutCalculation> {
    try {
      const response = await apiClient.post<CheckoutCalculation>('/checkout/calculate', {
        cart,
        addressId: address?.id,
        couponCode,
      });
      return response.data;
    } catch {
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
      const tax = Number((subtotal * 0.08).toFixed(2));
      let discount = 0;
      if (couponCode && couponCode.toUpperCase() === 'LUNE20') {
        discount = Number((subtotal * 0.2).toFixed(2));
      }
      const total = Number((subtotal + tax + shipping - discount).toFixed(2));
      return {
        subtotal,
        tax,
        shipping,
        discount,
        total,
        currency: 'USD',
      };
    }
  },

  async validateCoupon(code: string): Promise<CouponValidation> {
    try {
      const response = await apiClient.post<CouponValidation>('/checkout/coupon', { code });
      return response.data;
    } catch {
      if (code.trim().toUpperCase() === 'LUNE20') {
        return {
          valid: true,
          code: 'LUNE20',
          discountPercent: 20,
          message: '20% VIP Atelier Discount Applied!',
        };
      }
      return {
        valid: false,
        code,
        message: 'Invalid or expired promotional code.',
      };
    }
  },
};

export default checkoutApi;
