import { useState, useCallback, useEffect } from 'react';
import { checkoutApi, CheckoutCalculation, CouponValidation } from '../../services/checkout/checkoutApi';
import { CartItem, CustomerLocationRes } from '../../types';

export function useCheckout(cart: CartItem[], selectedAddress?: CustomerLocationRes | null) {
  const [totals, setTotals] = useState<CheckoutCalculation>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    currency: 'USD',
  });
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponStatus, setCouponStatus] = useState<CouponValidation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const result = await checkoutApi.calculateTotals(cart, selectedAddress, couponStatus?.valid ? couponCode : undefined);
      setTotals(result);
    } finally {
      setLoading(false);
    }
  }, [cart, selectedAddress, couponCode, couponStatus]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const applyCoupon = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const res = await checkoutApi.validateCoupon(code);
      setCouponStatus(res);
      if (res.valid) {
        setCouponCode(code);
      }
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    setCouponStatus(null);
  }, []);

  return {
    totals,
    couponCode,
    couponStatus,
    loading,
    applyCoupon,
    removeCoupon,
    recalculate: calculate,
  };
}

export default useCheckout;
