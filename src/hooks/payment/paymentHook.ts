import { useState, useEffect, useCallback } from 'react';
import {
  paymentApi,
  PaymentMethodOption,
  PaymentTransactionRequest,
  PaymentTransactionResponse,
} from '../../services/payment/paymentApi';

export function usePayment() {
  const [methods, setMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [processing, setProcessing] = useState<boolean>(false);
  const [lastTransaction, setLastTransaction] = useState<PaymentTransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentApi.getPaymentMethods().then((res) => {
      setMethods(res);
      if (res.length > 0) setSelectedMethod(res[0].id);
    });
  }, []);

  const processPayment = useCallback(async (payload: PaymentTransactionRequest) => {
    setProcessing(true);
    setError(null);
    try {
      const res = await paymentApi.processPayment(payload);
      setLastTransaction(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Payment processing failed');
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  return {
    methods,
    selectedMethod,
    setSelectedMethod,
    processing,
    lastTransaction,
    error,
    processPayment,
  };
}

export default usePayment;
