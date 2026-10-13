import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '../../services/orders/orderApi';
import { Order, OrderStatus } from '../../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const list = await orderApi.getOrders();
      setOrders(list);
      if (!selectedOrder && list.length > 0) {
        setSelectedOrder(list[0]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (orderData: Partial<Order>) => {
      try {
        const created = await orderApi.createOrder(orderData);
        setOrders((prev) => [created, ...prev]);
        setSelectedOrder(created);
        return created;
      } catch (err: any) {
        setError(err?.message || 'Failed to place order');
        throw err;
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      try {
        const updated = await orderApi.updateOrderStatus(orderId, status);
        if (updated) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updated);
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to update order status');
      }
    },
    [selectedOrder]
  );

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string) => {
      try {
        const cancelled = await orderApi.cancelOrder(orderId, reason);
        if (cancelled) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? cancelled : o)));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to cancel order');
      }
    },
    []
  );

  return {
    orders,
    selectedOrder,
    setSelectedOrder,
    loading,
    error,
    createOrder,
    updateStatus,
    cancelOrder,
    refreshOrders: fetchOrders,
  };
}

export default useOrders;
