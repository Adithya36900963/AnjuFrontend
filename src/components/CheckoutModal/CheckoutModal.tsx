import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useCheckout } from '../../hooks/checkout/checkoutHook';
import { usePayment } from '../../hooks/payment/paymentHook';
import { CustomerLocationRes } from '../../types';
import { AddressModal } from '../AddressModal';
import './CheckoutModal.css';
import {
  X,
  Lock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Smartphone,
  Building,
  Wallet,
  AlertCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  Plus,
  Home,
  Briefcase,
  MoreHorizontal,
  Navigation,
  Edit2,
  Check,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    formatPrice,
    currency,
    user,
    createOrder,
    openOrders,
    isCheckoutOpen,
    setIsCheckoutOpen,
    customerAddresses,
    selectedAddress,
    selectDeliveryAddress,
    showToast,
  } = useShop();

  // Connect dedicated checkout & payment hooks
  const { couponCode, applyCoupon, removeCoupon } = useCheckout(cart, selectedAddress);
  const { methods: paymentMethods, processPayment: hookProcessPayment } = usePayment();

  // Multi-step checkout: 1: Cart, 2: Address, 3: Delivery, 4: Payment, 5: Review
  // Default to Step 2 (Address Selection) so the user is directly asked which address to deliver to!
  const [step, setStep] = useState<number>(2);

  // Address Modal state for adding a new address on the fly
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [editingModalAddress, setEditingModalAddress] = useState<CustomerLocationRes | null>(null);

  // Payment method selection: 'online' vs 'cod'
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');

  // Gateway Simulation State
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [gatewayTab, setGatewayTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [gatewayProcessing, setGatewayProcessing] = useState<boolean>(false);

  // Result state after payment attempt
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [createdOrderResult, setCreatedOrderResult] = useState<any>(null);

  if (!isCheckoutOpen) return null;

  // Active delivery address from context or first available customer address
  const activeAddress: CustomerLocationRes =
    selectedAddress ||
    customerAddresses.find((a) => a.defaultAddress) ||
    customerAddresses[0] || {
      id: 101,
      customerId: 1,
      countryId: 1,
      countryName: 'India',
      stateId: 28,
      stateName: 'Andhra Pradesh',
      districtId: 504,
      districtName: 'Guntur',
      pincode: '522002',
      addressLine1: 'Flat 402, Sri Krishna Residency',
      addressLine2: '12-45 Main Road, Arundelpet',
      cityVillage: 'Guntur',
      landmark: 'Opp. Hindu College Grounds',
      mobileNumber: '+91 98765 43210',
      addressType: 'HOME',
      defaultAddress: true,
    };

  // Pricing calculations
  const hasItems = cart.length > 0;
  const itemsCount = hasItems
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 3;

  const isINR = currency === 'INR';
  const deliveryFee = 150;
  const codFee = paymentMethod === 'cod' ? 40 : 0;
  const productSubtotal = hasItems
    ? (isINR ? Math.round(cartTotal * 85) : Math.round(cartTotal))
    : 5497;
  const discount = 0;
  const grandTotal = productSubtotal + deliveryFee + codFee - discount;

  const getShippingPayload = () => {
    const fullLine = `${activeAddress.addressLine1}${
      activeAddress.addressLine2 ? ', ' + activeAddress.addressLine2 : ''
    }${activeAddress.landmark ? ', Near ' + activeAddress.landmark : ''}`;

    return {
      name: user?.name || 'Ravi Kumar',
      phone: activeAddress.mobileNumber,
      email: user?.email || 'ravi.kumar@gmail.com',
      addressLine: fullLine,
      city: activeAddress.cityVillage,
      state: activeAddress.stateName,
      pin: activeAddress.pincode,
      country: activeAddress.countryName,
    };
  };

  const handlePlaceOrder = () => {
    const shippingInfo = getShippingPayload();

    if (paymentMethod === 'cod') {
      const orderItems = hasItems
        ? cart.map((item, idx) => ({
            id: `item-${idx + 1}`,
            product: item.product,
            sku: `LN-${item.product.category.substring(0, 2).toUpperCase()}-00${idx + 1}`,
            name: item.product.name,
            selectedColor: item.selectedColor,
            unitPrice: isINR ? Math.round(item.product.price * 85) : Math.round(item.product.price),
            quantity: item.quantity,
            total:
              (isINR ? Math.round(item.product.price * 85) : Math.round(item.product.price)) *
              item.quantity,
            image: item.product.image,
          }))
        : [
            {
              id: 'item-1',
              product: cart[0]?.product,
              sku: 'DS001-MRN',
              name: 'Designer Silk Saree',
              unitPrice: 2499,
              quantity: 1,
              total: 2499,
              image:
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=480&q=75',
            },
          ];

      const newOrder = createOrder({
        customer: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
        },
        shippingAddress: shippingInfo,
        items: orderItems as any,
        pricing: {
          subtotal: productSubtotal,
          discount,
          productTotal: productSubtotal,
          deliveryCharges: deliveryFee,
          codCharges: codFee,
          grandTotal,
        },
        payment: {
          type: 'cod',
          status: 'pending',
          attempts: 1,
        },
      });

      setCreatedOrderResult(newOrder);
      setPaymentResult('success');
    } else {
      setIsGatewayOpen(true);
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    setGatewayProcessing(true);
    setTimeout(() => {
      setGatewayProcessing(false);
      setIsGatewayOpen(false);

      const shippingInfo = getShippingPayload();

      const orderItems = hasItems
        ? cart.map((item, idx) => ({
            id: `item-${idx + 1}`,
            product: item.product,
            sku: `LN-${item.product.category.substring(0, 2).toUpperCase()}-00${idx + 1}`,
            name: item.product.name,
            selectedColor: item.selectedColor,
            unitPrice: isINR ? Math.round(item.product.price * 85) : Math.round(item.product.price),
            quantity: item.quantity,
            total:
              (isINR ? Math.round(item.product.price * 85) : Math.round(item.product.price)) *
              item.quantity,
            image: item.product.image,
          }))
        : [];

      const txId = success ? `pay_${Math.random().toString(36).substring(2, 14)}` : undefined;

      const newOrder = createOrder({
        customer: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
        },
        shippingAddress: shippingInfo,
        items: orderItems as any,
        pricing: {
          subtotal: productSubtotal,
          discount,
          productTotal: productSubtotal,
          deliveryCharges: deliveryFee,
          codCharges: 0,
          grandTotal,
        },
        status: success ? 'confirmed' : 'pending',
        payment: {
          type: 'online',
          status: success ? 'success' : 'failed',
          transactionId: txId,
          paidAt: success ? 'Just now' : undefined,
          attempts: 1,
          methodDetail: 'Online Payment (Razorpay/UPI)',
        },
      });

      setCreatedOrderResult(newOrder);
      setPaymentResult(success ? 'success' : 'failed');
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setPaymentResult(null);
    setCreatedOrderResult(null);
  };

  const handleViewOrderDetails = () => {
    const orderIdToOpen = createdOrderResult?.id || 'ORD-10025';
    handleClose();
    openOrders(orderIdToOpen);
  };

  const handleAddNewAddress = () => {
    setEditingModalAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (addr: CustomerLocationRes, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingModalAddress(addr);
    setIsAddressModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header with Brand Mark and Secure Checkout */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-2xl font-bold tracking-tight text-slate-900">
              Luné
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold pl-1">
              HAUTE ATELIER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Secure Checkout</span>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Step Stepper Progress Bar with Interactive Click Navigation */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { num: 1, label: 'Cart' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'Review' },
            ].map((s) => {
              const isCurrent = s.num === step;
              const isPast = s.num < step;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    // Allow navigating between Address and Payment easily
                    if (s.num === 2 || s.num === 4 || s.num === 1) {
                      setStep(s.num);
                    }
                  }}
                  className="flex flex-col items-center flex-1 cursor-pointer transition-transform hover:scale-105"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#881337] text-white ring-4 ring-[#881337]/15'
                        : isPast
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1 font-medium transition-colors ${
                      isCurrent
                        ? 'text-[#881337] font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {paymentResult === 'success' ? (
            /* =========================================================================
               PAYMENT SUCCESSFUL
               ========================================================================= */
            <div className="py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                Payment Successful!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your order has been placed and confirmed successfully.
              </p>

              <div className="mt-6 max-w-sm mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-2.5 text-left">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Order Number</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {createdOrderResult?.id || 'ORD-10025'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Delivering To</span>
                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                    {activeAddress.cityVillage} ({activeAddress.pincode})
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>

                {createdOrderResult?.payment?.transactionId && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono text-slate-700 text-[11px] truncate max-w-[170px]">
                      {createdOrderResult.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleViewOrderDetails}
                  className="w-full py-3 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  View Order Details
                </button>
              </div>
            </div>
          ) : paymentResult === 'failed' ? (
            /* =========================================================================
               PAYMENT FAILED
               ========================================================================= */
            <div className="py-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50">
                <AlertCircle className="w-10 h-10 text-rose-600" />
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
                Payment Failed
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your order has been created, but the payment was not completed.
              </p>

              <div className="mt-6 max-w-sm mx-auto bg-rose-50/60 border border-rose-100 rounded-2xl p-4 text-xs text-left">
                <div className="text-rose-800 font-medium">
                  Reason: Payment cancelled by user or bank timeout
                </div>
                <div className="text-slate-400 text-[11px] mt-1 font-mono">
                  Order saved as #ORD-10025 with status "Payment Pending"
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsGatewayOpen(true)}
                  className="w-full py-3 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Try Payment Again
                </button>
                <button
                  onClick={handleViewOrderDetails}
                  className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  View Order Details
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            /* =========================================================================
               STEP 2: SELECT DELIVERY ADDRESS (Asked: "which address" & saved list)
               ========================================================================= */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                    Select Delivery Address
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Which saved address should we deliver this package to?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewAddress}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-[#881337] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Saved Address List (Matches CustomerLocationRes DTO from Spring Boot) */}
              <div className="space-y-3 mt-3">
                {customerAddresses.map((addr) => {
                  const isSelected = activeAddress.id === addr.id;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => selectDeliveryAddress(addr)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/40 ring-2 ring-sky-200 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Radio selection circle */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-sky-600 bg-sky-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Address Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  addr.addressType === 'HOME'
                                    ? 'bg-sky-100 text-sky-800'
                                    : addr.addressType === 'WORK'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-slate-200 text-slate-800'
                                }`}
                              >
                                {addr.addressType === 'HOME' ? (
                                  <Home className="w-2.5 h-2.5" />
                                ) : addr.addressType === 'WORK' ? (
                                  <Briefcase className="w-2.5 h-2.5" />
                                ) : (
                                  <MoreHorizontal className="w-2.5 h-2.5" />
                                )}
                                <span>{addr.addressType}</span>
                              </span>

                              {addr.defaultAddress && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Default
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleEditAddress(addr, e)}
                              className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 p-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          </div>

                          <p className="font-bold text-slate-900 text-xs sm:text-sm">
                            {addr.addressLine1}
                          </p>
                          {addr.addressLine2 && (
                            <p className="text-xs text-slate-600 mt-0.5">{addr.addressLine2}</p>
                          )}
                          {addr.landmark && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-xs text-slate-700 font-medium mt-1">
                            {addr.cityVillage}, {addr.districtName}, {addr.stateName} -{' '}
                            <span className="font-mono font-bold text-slate-900">
                              {addr.pincode}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-1">
                            Contact: {addr.mobileNumber}
                          </p>
                        </div>
                      </div>

                      {/* Visual Selected Badge */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-sky-100 flex items-center justify-between text-xs text-sky-700">
                          <span className="font-semibold flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Package will be delivered here</span>
                          </span>
                          <span className="text-[11px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded-lg">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Continue to Payment */}
              <div className="mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full py-3.5 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Deliver to This Address &amp; Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* =========================================================================
               STEP 1: CART REVIEW
               ========================================================================= */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                    Review Bag ({itemsCount} items)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Check your selected accessories</p>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center gap-3 text-xs"
                  >
                    <img
                      src={item.selectedVariantImage || item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl bg-white border border-slate-200/60"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span>Qty: {item.quantity}</span>
                        {item.selectedSize && (
                          <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-sky-700 font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ₹{Math.round(item.product.price * 85 * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 w-full py-3 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Select Delivery Address</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* =========================================================================
               STEP 4: PAYMENT METHOD SELECTION (Image 2 style with Selected Address Banner)
               ========================================================================= */
            <div>
              {/* Selected Delivery Address Highlight Banner with 1-Click "Change Address" */}
              <div className="mb-5 p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl text-xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Delivering to</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-200 text-sky-900">
                        {activeAddress.addressType}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium truncate text-xs mt-0.5">
                      {activeAddress.addressLine1}, {activeAddress.cityVillage} ({activeAddress.pincode})
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Ph: {activeAddress.mobileNumber}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-1.5 bg-white border border-sky-200 hover:bg-sky-100 text-sky-800 text-[11px] font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Change Address
                </button>
              </div>

              {/* Payment Method Section Heading */}
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                  Payment Method
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose how you want to pay</p>
              </div>

              {/* Payment Options (Radio Selection Cards) */}
              <div className="mt-4 space-y-3">
                {/* Option 1: Online Payment */}
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`block relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'border-[#881337] bg-[#881337]/3 ring-1 ring-[#881337]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1 w-4 h-4 text-[#881337] focus:ring-[#881337] cursor-pointer"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-700" />
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            Online Payment
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-800">
                            UPI
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded">
                            VISA
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-800 rounded">
                            MC
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-50 text-sky-800 rounded">
                            Paytm
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        UPI, Cards, Net Banking, Wallets
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`block relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#881337] bg-[#881337]/3 ring-1 ring-[#881337]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 w-4 h-4 text-[#881337] focus:ring-[#881337] cursor-pointer"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-700" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pay when your order arrives at your doorstep
                      </p>

                      {paymentMethod === 'cod' && (
                        <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-900 animate-in fade-in duration-200">
                          <span className="font-bold text-[#881337]">COD charges (₹40)</span>{' '}
                          will be added to your order for cash handling convenience.
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Order Summary Box */}
              <div className="mt-6 p-4.5 bg-[#FAF7F5] border border-slate-200/80 rounded-2xl text-xs space-y-2.5">
                <h4 className="font-serif-luxury font-bold text-sm text-[#881337] pb-1 border-b border-slate-200/60">
                  Order Summary
                </h4>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Product Total ({itemsCount} items)</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    ₹{productSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium text-slate-900 tabular-nums">₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>COD Charges</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      paymentMethod === 'cod' ? 'text-rose-700 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {paymentMethod === 'cod' ? '₹40' : '₹0'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm text-slate-900">Total</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">(Taxes included)</span>
                  </div>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="mt-6">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {paymentMethod === 'cod'
                      ? 'Place Order (COD)'
                      : `Make Payment (₹${grandTotal.toLocaleString()})`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>256-bit encrypted checkout with instant order confirmation</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      {isGatewayOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Gateway Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block">
                  LUNÉ ATELIER
                </span>
                <h4 className="font-semibold text-sm">Order #ORD-10025</h4>
              </div>

              <div className="text-right">
                <span className="text-base font-bold tabular-nums">
                  ₹{grandTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">INR</span>
              </div>
            </div>

            {/* Gateway Body */}
            <div className="p-5">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Choose a payment method
              </h5>

              {/* Gateway Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-medium">
                <button
                  onClick={() => setGatewayTab('upi')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gatewayTab === 'upi'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setGatewayTab('card')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gatewayTab === 'card'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  Card
                </button>
                <button
                  onClick={() => setGatewayTab('netbanking')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gatewayTab === 'netbanking'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  NetBanking
                </button>
                <button
                  onClick={() => setGatewayTab('wallet')}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    gatewayTab === 'wallet'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  Wallet
                </button>
              </div>

              {/* UPI Tab */}
              {gatewayTab === 'upi' && (
                <div className="space-y-3">
                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-500 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                        GPay
                      </div>
                      <span className="text-xs font-medium text-slate-800">Google Pay UPI</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-500 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                        Pe
                      </div>
                      <span className="text-xs font-medium text-slate-800">PhonePe UPI</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-500 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                        Paytm
                      </div>
                      <span className="text-xs font-medium text-slate-800">Paytm UPI</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {gatewayTab === 'card' && (
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4532 •••• •••• 8920"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08 / 29"
                      className="p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="•••"
                      className="p-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {gatewayTab === 'netbanking' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank) => (
                    <div
                      key={bank}
                      className="p-2.5 border border-slate-200 rounded-xl text-center hover:border-sky-500 font-medium cursor-pointer"
                    >
                      {bank}
                    </div>
                  ))}
                </div>
              )}

              {/* Wallet Tab */}
              {gatewayTab === 'wallet' && (
                <div className="space-y-2 text-xs">
                  {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map((w) => (
                    <div
                      key={w}
                      className="p-2.5 border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-500 cursor-pointer"
                    >
                      <span>{w}</span>
                      <span className="text-sky-600 font-bold">Link &amp; Pay</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Simulation Controls */}
              <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Payment Simulation Controls
                </span>

                <button
                  disabled={gatewayProcessing}
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{gatewayProcessing ? 'Processing...' : 'Simulate Payment Success'}</span>
                </button>

                <button
                  disabled={gatewayProcessing}
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Simulate Payment Failure / Cancel</span>
                </button>
              </div>

              <div className="mt-3 text-center text-[10px] text-slate-400">
                Secured by Razorpay • Test Environment
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Add / Edit Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingModalAddress(null);
        }}
        editingAddress={editingModalAddress}
        onAddressSaved={(newAddr) => {
          selectDeliveryAddress(newAddr);
          showToast(`Delivering to ${newAddr.addressLine1}, ${newAddr.cityVillage}`);
        }}
      />
    </div>
  );
};
