import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useLocation as useLocationData } from '../../hooks/location/locationHook';
import { CustomerLocationRes, AdminLocationRes } from '../../types';
import { AddressModal } from '../AddressModal';
import './AddressBookPage.css';
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  MoreHorizontal,
  CheckCircle2,
  Edit2,
  Trash2,
  ArrowLeft,
  Navigation,
  Phone,
  ShieldCheck,
  Building2,
  Warehouse,
  Truck,
  Search,
  Code2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const AddressBookPage: React.FC = () => {
  const {
    customerAddresses,
    adminAddresses,
    selectedAddress,
    selectDeliveryAddress,
    updateDefaultCustomerAddress,
    deleteCustomerAddress,
    setViewMode,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<CustomerLocationRes | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);

  // Hook-connected address list
  const { addresses: hookAddresses } = useLocationData();
  const activeCustomerAddresses = hookAddresses.length > 0 ? hookAddresses : customerAddresses;

  // Filtered customer addresses
  const filteredCustomerAddresses = activeCustomerAddresses.filter((addr) => {
    const matchesSearch =
      addr.addressLine1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.cityVillage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.pincode.includes(searchQuery) ||
      addr.mobileNumber.includes(searchQuery);

    const matchesType =
      filterType === 'ALL' || addr.addressType === filterType;

    return matchesSearch && matchesType;
  });

  const handleEdit = (addr: CustomerLocationRes) => {
    setEditingAddr(addr);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddr(null);
    setIsModalOpen(true);
  };

  const handleDeliverHere = (addr: CustomerLocationRes) => {
    selectDeliveryAddress(addr);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('desktop')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Address Book &amp; Locations
                </span>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Spring Boot REST API
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage saved delivery destinations &amp; fulfillment dispatch hubs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{showCodePreview ? 'Hide DTO API' : 'View DTO API'}</span>
            </button>

            <button
              onClick={handleAddNew}
              className="px-4 py-2 text-xs font-semibold bg-[#881337] hover:bg-[#6b0f2b] text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Backend DTO Code Accordion (Matches user prompt Java classes) */}
        {showCodePreview && (
          <div className="mb-8 p-5 bg-slate-900 text-slate-100 rounded-3xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Spring Boot API Contract: LocationController &amp; PincodeController</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">/api/customer/address | /api/pincode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto">
                <div className="text-emerald-400 font-semibold mb-1">
                  POST /api/pincode {'->'} resolvePincode(pincode)
                </div>
                <div className="text-slate-400 text-[11px]">
                  Resolves 6-digit PIN code into countryId, stateId, districtId, countryName, stateName, districtName.
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto">
                <div className="text-sky-400 font-semibold mb-1">
                  GET &amp; POST /api/customer/address
                </div>
                <div className="text-slate-400 text-[11px]">
                  Returns APIRes&lt;List&lt;CustomerLocationRes&gt;&gt; with GPS coordinates &amp; defaultAddress flag.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs max-w-fit">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Customer Addresses</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'customer'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {customerAddresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Admin Dispatch Hubs</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'admin'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {adminAddresses.length}
              </span>
            </button>
          </div>

          {/* Search & Filter */}
          {activeTab === 'customer' && (
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search city, PIN, street..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 text-slate-800 placeholder-slate-400"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="HOME">Home</option>
                <option value="WORK">Work</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}
        </div>

        {/* =========================================================================
            CUSTOMER SAVED ADDRESSES TAB
            ========================================================================= */}
        {activeTab === 'customer' ? (
          <div>
            {filteredCustomerAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-slate-900">
                  No Saved Addresses Found
                </h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  {searchQuery
                    ? 'No saved address matches your search filter.'
                    : 'Add your primary delivery address for fast 1-click checkout.'}
                </p>
                <button
                  onClick={handleAddNew}
                  className="mt-6 px-5 py-2.5 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCustomerAddresses.map((addr) => {
                  const isCurrentDefault = addr.defaultAddress;
                  const isCurrentlySelected = selectedAddress?.id === addr.id;

                  return (
                    <div
                      key={addr.id}
                      className={`relative bg-white rounded-3xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden p-6 ${
                        isCurrentlySelected
                          ? 'border-sky-500 ring-2 ring-sky-100 shadow-md'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Badges */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                addr.addressType === 'HOME'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-100'
                                  : addr.addressType === 'WORK'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {addr.addressType === 'HOME' ? (
                                <Home className="w-3 h-3" />
                              ) : addr.addressType === 'WORK' ? (
                                <Briefcase className="w-3 h-3" />
                              ) : (
                                <MoreHorizontal className="w-3 h-3" />
                              )}
                              <span>{addr.addressType}</span>
                            </span>

                            {isCurrentDefault && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Default</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(addr)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                              title="Edit Address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCustomerAddress(addr.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Address Lines */}
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-slate-900 text-sm leading-snug">
                            {addr.addressLine1}
                          </p>
                          {addr.addressLine2 && (
                            <p className="text-slate-600">{addr.addressLine2}</p>
                          )}
                          {addr.landmark && (
                            <p className="text-slate-500 text-[11px]">
                              <span className="font-semibold text-slate-700">Landmark:</span>{' '}
                              {addr.landmark}
                            </p>
                          )}
                          <p className="text-slate-800 font-medium pt-1">
                            {addr.cityVillage}, {addr.districtName}
                          </p>
                          <p className="text-slate-600">
                            {addr.stateName}, {addr.countryName} -{' '}
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded">
                              {addr.pincode}
                            </span>
                          </p>
                        </div>

                        {/* Contact & GPS Details */}
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="font-mono font-medium">{addr.mobileNumber}</span>
                            {addr.alternatePhone && (
                              <span className="text-slate-400 font-mono">/ {addr.alternatePhone}</span>
                            )}
                          </div>

                          {addr.latitude && addr.longitude && (
                            <div className="flex items-center gap-2 text-slate-500">
                              <Navigation className="w-3 h-3 text-sky-500" />
                              <span className="font-mono text-[10px]">
                                {addr.latitude.toFixed(4)}° N, {addr.longitude.toFixed(4)}° E
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 rounded">
                                GPS Pin
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={() => handleDeliverHere(addr)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isCurrentlySelected
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-900 hover:bg-[#881337] text-white shadow-xs'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{isCurrentlySelected ? 'Selected for Delivery' : 'Deliver to Here'}</span>
                        </button>

                        {!isCurrentDefault && (
                          <button
                            onClick={() => updateDefaultCustomerAddress(addr.id)}
                            className="w-full sm:w-auto py-2.5 px-3 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              ADMIN DISPATCH HUBS TAB (Matches /api/admin/address endpoints)
              ========================================================================= */
          <div>
            <div className="mb-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">
                  Admin Fulfillment &amp; Dispatch Nodes (/api/admin/address)
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  These locations are managed via the Spring Boot LocationController to handle warehouse dispatch, AWB routing, and regional inventory.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {adminAddresses.map((hub) => (
                <div
                  key={hub.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-100">
                      <Warehouse className="w-3.5 h-3.5" />
                      <span>{hub.addressType}</span>
                    </span>

                    {hub.defaultAddress && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Central Primary Hub</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{hub.addressLine1}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{hub.addressLine2}</p>
                  <p className="text-xs text-slate-800 font-medium mt-1">
                    {hub.cityVillage}, {hub.districtName}, {hub.stateName} -{' '}
                    <span className="font-mono font-bold text-slate-900">{hub.pincode}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{hub.mobileNumber}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      GPS: {hub.latitude?.toFixed(4)}°, {hub.longitude?.toFixed(4)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Address Add/Edit Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddr(null);
        }}
        editingAddress={editingAddr}
      />
    </div>
  );
};
