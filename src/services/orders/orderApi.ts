import apiClient from '../../api/axios';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { INITIAL_ORDERS } from '../../data/mockOrders';

const ORDERS_STORAGE_KEY = 'lune_orders_v2';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveStoredOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

export const orderApi = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>('/orders');
      return response.data?.length ? response.data : getStoredOrders();
    } catch {
      return getStoredOrders();
    }
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await apiClient.get<Order>(`/orders/${orderId}`);
      return response.data;
    } catch {
      return getStoredOrders().find((o) => o.id === orderId) || null;
    }
  },

  async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/orders', orderPayload);
      return response.data;
    } catch {
      const orders = getStoredOrders();
      const nextNum = 10025 + orders.length + 1;
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const hash = Math.random().toString(36).substring(2, 12).toUpperCase();

      const newOrder: Order = {
        id: `ORD-${nextNum}`,
        hash,
        createdAt: formattedDate,
        customer: orderPayload.customer || {
          name: 'Valued Customer',
          phone: '+91 98765 43210',
          email: 'customer@lifestyle.com',
        },
        shippingAddress: orderPayload.shippingAddress || {
          name: 'Valued Customer',
          addressLine: 'Villa 42, Palm Meadows Luxury Enclave',
          city: 'Bengaluru',
          state: 'Karnataka',
          pin: '560001',
          country: 'India',
        },
        items: orderPayload.items || [],
        pricing: orderPayload.pricing || {
          subtotal: 100,
          discount: 0,
          productTotal: 100,
          deliveryCharges: 0,
          codCharges: 0,
          grandTotal: 100,
        },
        status: orderPayload.status || 'confirmed',
        payment: orderPayload.payment || {
          type: 'online',
          status: 'success',
          transactionId: `TXN-${Date.now()}`,
          paidAt: formattedDate,
          attempts: 1,
        },
        delivery: orderPayload.delivery || {
          carrier: 'DELHIVERY',
          awbNumber: `DEL-${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: 'Order Placed',
        },
        timeline: orderPayload.timeline || [
          { label: 'Order Placed', timestamp: formattedDate, completed: true, current: true },
          { label: 'Confirmed', timestamp: formattedDate, completed: true },
          { label: 'Shipped', completed: false },
          { label: 'Out for Delivery', completed: false },
          { label: 'Delivered', completed: false },
        ],
        paymentLogs: orderPayload.paymentLogs || [
          {
            title: 'Payment Successful',
            timestamp: formattedDate,
            transactionId: `TXN-${Date.now()}`,
            amount: orderPayload.pricing?.grandTotal || 100,
            type: 'success',
          },
        ],
      };
      orders.unshift(newOrder);
      saveStoredOrders(orders);
      return newOrder;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    try {
      const response = await apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch {
      const orders = getStoredOrders();
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], status };
        saveStoredOrders(orders);
        return orders[idx];
      }
      return null;
    }
  },

  async cancelOrder(orderId: string, reason?: string): Promise<Order | null> {
    try {
      const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch {
      return this.updateOrderStatus(orderId, 'cancelled');
    }
  },
};

export default orderApi;
