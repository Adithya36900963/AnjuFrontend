import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useOrders } from '../../hooks/order/orderHook';
import { Order, OrderStatus } from '../../types';
import './OrdersManagementPage.css';
import {
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  User,
  MapPin,
  Package,
  MoreVertical,
  X,
  ExternalLink,
  RefreshCw,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';

export const OrdersManagementPage: React.FC = () => {
  const {
    orders: contextOrders,
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    updateOrderPayment,
    updateShippingAddress,
    setViewMode,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  // Connect dedicated useOrders hook
  const { orders: hookOrders } = useOrders();
  const orders = hookOrders.length > 0 ? hookOrders : contextOrders;

  const { id: routeOrderId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // If order id passed via URL route /orders/:id, auto select it
  useEffect(() => {
    if (routeOrderId && orders.length > 0) {
      const found = orders.find((o) => o.id === routeOrderId || o.hash === routeOrderId);
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [routeOrderId, orders, setSelectedOrder]);

  // Active view: 'dashboard' (Orders List / Split) or 'detail' (focused full detail)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // View mode switcher: 'merchant' (Admin management) vs 'customer' (My Orders customer portal)
  const [viewPersona, setViewPersona] = useState<'merchant' | 'customer'>('merchant');

  // Status dropdown menu state
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  // Address edit modal state
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState({
    name: '',
    addressLine: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  });

  // Filter orders by tab & search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'pending' && order.status !== 'pending') return false;
      if (activeTab === 'confirmed' && order.status !== 'confirmed') return false;
      if (activeTab === 'shipped' && order.status !== 'shipped') return false;
      if (activeTab === 'delivered' && order.status !== 'delivered') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesName = order.customer.name.toLowerCase().includes(q);
        const matchesPhone = order.customer.phone.includes(q);
        return matchesId || matchesName || matchesPhone;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    };
  }, [orders]);

  // Pagination slice
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeOrder = selectedOrder || orders[0];

  const handleEditAddressClick = () => {
    if (activeOrder) {
      setEditAddressForm({ ...activeOrder.shippingAddress });
      setIsEditAddressOpen(true);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder) {
      updateShippingAddress(activeOrder.id, editAddressForm);
      setIsEditAddressOpen(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
            Confirmed
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
            Shipped
          </span>
        );
      case 'processing':
      case 'packed':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Packed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Top Quiet Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-lg font-bold text-slate-900">
                Luné
              </span>
              <span className="text-xs text-slate-400 font-medium">/</span>
              <span className="text-xs font-bold text-slate-700">Orders Dashboard</span>
            </div>
          </div>

          {/* Persona Switcher: Merchant Admin vs Customer My Orders */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
              <button
                onClick={() => setViewPersona('merchant')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewPersona === 'merchant'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin / Merchant View
              </button>
              <button
                onClick={() => setViewPersona('customer')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewPersona === 'customer'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer: My Orders
              </button>
            </div>

            <button
              onClick={() => setViewMode('addresses')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Test Checkout Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - Split View Matching Image 1 (Left: Orders List, Right: Order Detail) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =========================================================================
              LEFT PANEL: ORDERS LIST & TABS (Image 1 Left Side)
              ========================================================================= */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            {/* Header: Title */}
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  {viewPersona === 'merchant' ? 'Orders' : 'My Orders'}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {orders.length} total
                </span>
              </div>

              {/* Status Filter Tabs (All 24, Pending 5, Confirmed 8, Shipped 6, Delivered 5) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#881337] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tabCounts.all}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('pending');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-[#881337] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Pending</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tabCounts.pending}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('confirmed');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'confirmed'
                      ? 'bg-[#881337] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Confirmed</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === 'confirmed' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tabCounts.confirmed}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('shipped');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'shipped'
                      ? 'bg-[#881337] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Shipped</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === 'shipped' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tabCounts.shipped}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('delivered');
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'delivered'
                      ? 'bg-[#881337] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Delivered</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === 'delivered' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tabCounts.delivered}
                  </span>
                </button>
              </div>

              {/* Search input with Filter button */}
              <div className="mt-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order number, customer name..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Filter orders"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Orders Table Rows */}
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[620px]">
              {paginatedOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No orders match your filter criteria.
                </div>
              ) : (
                paginatedOrders.map((order) => {
                  const isSelected = activeOrder?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3.5 sm:p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FAF5F2] border-l-4 border-l-[#881337]'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Left: ID & Customer */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 font-mono">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                            {order.hash.substring(0, 8)}...
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {order.customer.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.customer.phone}
                        </div>
                      </div>

                      {/* Middle: Items & Price */}
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-slate-500">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items
                        </div>
                        <div className="font-bold text-xs text-slate-900 tabular-nums">
                          ₹{order.pricing.grandTotal.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {order.createdAt.split(',')[0]}
                        </div>
                      </div>

                      {/* Right: Badge & Chevron */}
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(order.status)}
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#881337]' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">
                Showing {paginatedOrders.length} of {filteredOrders.length}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 cursor-pointer text-xs"
                >
                  ‹
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-[#881337] text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40 cursor-pointer text-xs"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT PANEL: ORDER DETAIL VIEW (Image 1 Right Side & Image 3 Steps 6 & 7)
              ========================================================================= */}
          {activeOrder && (
            <div className="lg:col-span-7 space-y-4">
              {/* Order Detail Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {activeOrder.id}
                      </h2>
                      {getStatusBadge(activeOrder.status)}
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                        {activeOrder.payment.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
                      <span>{activeOrder.hash}</span>
                      <span>•</span>
                      <span>{activeOrder.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2">
                    {/* Update Status Dropdown (Admin Action) */}
                    <div className="relative">
                      <button
                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                        className="px-3.5 py-2 bg-[#881337] hover:bg-[#6b0f2b] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Update Status</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {isStatusMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs">
                          {(
                            [
                              'pending',
                              'confirmed',
                              'processing',
                              'shipped',
                              'delivered',
                              'cancelled',
                            ] as OrderStatus[]
                          ).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                updateOrderStatus(activeOrder.id, st);
                                setIsStatusMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                                activeOrder.status === st
                                  ? 'bg-rose-50 text-rose-800 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* If payment is pending: Image 3 Step 6 "Payment Pending (Online Payment)" Banner & Action */}
                {activeOrder.payment.status === 'pending' && activeOrder.payment.type === 'online' && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-rose-900 block">
                        Payment Pending
                      </span>
                      <span className="text-rose-700 text-[11px]">
                        Customer has not completed payment for this order yet.
                      </span>
                    </div>

                    <button
                      onClick={() => updateOrderPayment(activeOrder.id, 'success', `pay_${Math.random().toString(36).substring(2, 10)}`)}
                      className="px-3 py-1.5 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Make a Payment
                    </button>
                  </div>
                )}
              </div>

              {/* Order Items Table Card (Image 1 Right Side) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <h3 className="font-serif-luxury text-lg font-bold text-slate-900 mb-3.5">
                  Order Items ({activeOrder.items.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5">IMAGE</th>
                        <th className="pb-2.5">PRODUCT NAME</th>
                        <th className="pb-2.5">SKU</th>
                        <th className="pb-2.5 text-right">UNIT PRICE</th>
                        <th className="pb-2.5 text-center">QTY</th>
                        <th className="pb-2.5 text-right">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeOrder.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 pr-2">
                            <div className="font-semibold text-slate-900">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.selectedColor && `Color: ${item.selectedColor} `}
                              {item.size && `| Size: ${item.size}`}
                            </div>
                          </td>
                          <td className="py-3 text-slate-500 font-mono text-[11px]">
                            {item.sku}
                          </td>
                          <td className="py-3 text-right font-medium tabular-nums text-slate-700">
                            ₹{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-3 text-center font-medium text-slate-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right font-bold tabular-nums text-slate-900">
                            ₹{item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price Breakdown Footer matching Image 1 */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-1.5 max-w-xs ml-auto">
                  <div className="flex justify-between text-slate-600">
                    <span>Sub Total ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="tabular-nums font-medium text-slate-900">
                      ₹{activeOrder.pricing.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {activeOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span className="tabular-nums font-medium">
                        - ₹{activeOrder.pricing.discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Product Total</span>
                    <span className="tabular-nums font-medium text-slate-900">
                      ₹{activeOrder.pricing.productTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="tabular-nums font-medium text-slate-900">
                      ₹{activeOrder.pricing.deliveryCharges.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>COD Charges</span>
                    <span className="tabular-nums font-medium text-slate-900">
                      {activeOrder.pricing.codCharges > 0 ? `₹${activeOrder.pricing.codCharges}` : '-'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Grand Total</span>
                    <span className="tabular-nums">
                      ₹{activeOrder.pricing.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details & Shipping Address 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold font-serif-luxury text-base">
                    <User className="w-4 h-4 text-[#881337]" />
                    <span>Customer Details</span>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Name</span>
                      <span className="font-semibold text-slate-900">{activeOrder.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone</span>
                      <span className="font-medium text-slate-800">{activeOrder.customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="font-medium text-slate-800">{activeOrder.customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address with Edit button */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-900 font-bold font-serif-luxury text-base">
                      <MapPin className="w-4 h-4 text-[#881337]" />
                      <span>Shipping Address</span>
                    </div>

                    <button
                      onClick={handleEditAddressClick}
                      className="px-2 py-0.5 text-xs text-[#881337] hover:bg-rose-50 rounded font-semibold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-900">{activeOrder.shippingAddress.name}</div>
                    <div>{activeOrder.shippingAddress.addressLine}</div>
                    <div>
                      {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}
                    </div>
                    <div>
                      PIN - {activeOrder.shippingAddress.pin}, {activeOrder.shippingAddress.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information & Delivery Information 2-Col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment Information */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold font-serif-luxury text-base">
                    <CreditCard className="w-4 h-4 text-[#881337]" />
                    <span>Payment Information</span>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Type</span>
                      <span className="font-semibold text-slate-900 uppercase">
                        {activeOrder.payment.type}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Status</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          activeOrder.payment.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : activeOrder.payment.status === 'failed'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {activeOrder.payment.status === 'success'
                          ? 'Success'
                          : activeOrder.payment.status === 'failed'
                          ? 'Failed'
                          : 'Pending'}
                      </span>
                    </div>

                    {activeOrder.payment.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Transaction ID</span>
                        <span className="font-mono text-slate-800 text-[11px] truncate max-w-[140px]">
                          {activeOrder.payment.transactionId}
                        </span>
                      </div>
                    )}

                    {activeOrder.payment.methodDetail && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Method</span>
                        <span className="text-slate-800 font-medium">
                          {activeOrder.payment.methodDetail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold font-serif-luxury text-base">
                    <Truck className="w-4 h-4 text-[#881337]" />
                    <span>Delivery Information</span>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Delivery Type</span>
                      <span className="font-semibold text-slate-900">
                        {activeOrder.delivery.carrier}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">AWB Number</span>
                      <span className="font-mono text-slate-800 font-medium">
                        {activeOrder.delivery.awbNumber || '-'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Delivery Status</span>
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                        {activeOrder.delivery.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline Stepper (Image 1 Bottom & Image 3 Step 7) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold font-serif-luxury text-base">
                  <Clock className="w-4 h-4 text-[#881337]" />
                  <span>Order Timeline</span>
                </div>

                {/* Interactive Horizontal Timeline */}
                <div className="relative pt-2 pb-4">
                  <div className="flex items-center justify-between max-w-xl mx-auto relative">
                    {/* Background track line */}
                    <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 -z-0" />

                    {activeOrder.timeline.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            step.completed
                              ? 'bg-[#881337] text-white ring-4 ring-[#881337]/15'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        <span
                          className={`text-xs mt-2 font-medium text-center ${
                            step.completed ? 'text-slate-900 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>

                        {step.timestamp && (
                          <span className="text-[10px] text-slate-400 mt-0.5 text-center">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Log (Image 3 Step 7) */}
              {activeOrder.paymentLogs && activeOrder.paymentLogs.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-xs">
                  <h4 className="font-serif-luxury font-bold text-base text-slate-900 mb-3">
                    Payment Log
                  </h4>

                  <div className="space-y-3">
                    {activeOrder.paymentLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                            log.type === 'success'
                              ? 'bg-emerald-500'
                              : log.type === 'failed'
                              ? 'bg-rose-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{log.title}</span>
                            <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                          </div>
                          {log.transactionId && (
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Transaction ID: {log.transactionId}
                            </div>
                          )}
                          {log.details && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Address Modal */}
      {isEditAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
                Edit Shipping Address
              </h3>
              <button
                onClick={() => setIsEditAddressOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={editAddressForm.name}
                  onChange={(e) => setEditAddressForm({ ...editAddressForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={editAddressForm.addressLine}
                  onChange={(e) => setEditAddressForm({ ...editAddressForm, addressLine: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editAddressForm.city}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editAddressForm.state}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={editAddressForm.pin}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, pin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={editAddressForm.country}
                    onChange={(e) => setEditAddressForm({ ...editAddressForm, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditAddressOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#881337] hover:bg-[#6b0f2b] text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
