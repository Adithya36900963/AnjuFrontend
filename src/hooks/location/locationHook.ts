import { useState, useEffect, useCallback } from 'react';
import { locationApi } from '../../services/location/locationApi';
import { CustomerLocationRes, LocationReq } from '../../types';

export function useLocation() {
  const [addresses, setAddresses] = useState<CustomerLocationRes[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerLocationRes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await locationApi.getAddresses();
      setAddresses(data);
      const def = data.find((a) => a.defaultAddress) || data[0] || null;
      setSelectedAddress(def);
    } catch (err: any) {
      setError(err?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = useCallback(
    async (req: LocationReq, isDefault = false) => {
      try {
        const created = await locationApi.addAddress(req, isDefault);
        await fetchAddresses();
        if (isDefault || !selectedAddress) {
          setSelectedAddress(created);
        }
        return created;
      } catch (err: any) {
        setError(err?.message || 'Failed to save address');
        throw err;
      }
    },
    [fetchAddresses, selectedAddress]
  );

  const updateAddress = useCallback(
    async (id: number, req: Partial<LocationReq>) => {
      try {
        const updated = await locationApi.updateAddress(id, req);
        await fetchAddresses();
        return updated;
      } catch (err: any) {
        setError(err?.message || 'Failed to update address');
        throw err;
      }
    },
    [fetchAddresses]
  );

  const setDefaultAddress = useCallback(
    async (id: number) => {
      try {
        await locationApi.setDefaultAddress(id);
        await fetchAddresses();
      } catch (err: any) {
        setError(err?.message || 'Failed to set default address');
      }
    },
    [fetchAddresses]
  );

  const deleteAddress = useCallback(
    async (id: number) => {
      try {
        await locationApi.deleteAddress(id);
        await fetchAddresses();
      } catch (err: any) {
        setError(err?.message || 'Failed to delete address');
      }
    },
    [fetchAddresses]
  );

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    loading,
    error,
    addAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
    refreshAddresses: fetchAddresses,
  };
}

export default useLocation;
