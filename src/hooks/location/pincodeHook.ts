import { useState, useCallback } from 'react';
import { pincodeApi } from '../../services/location/pincodeApi';
import { PincodeRes } from '../../types';

export function usePincode() {
  const [data, setData] = useState<PincodeRes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (pincode: string) => {
    if (!pincode || pincode.trim().length < 4) {
      setData(null);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await pincodeApi.lookupPincode(pincode);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Pincode not found');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    lookup,
    clear: () => setData(null),
  };
}

export default usePincode;
