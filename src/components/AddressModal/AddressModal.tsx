import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { usePincode } from '../../hooks/location/pincodeHook';
import { CustomerLocationRes, LocationReq, CustomerAddressType } from '../../types';
import './AddressModal.css';
import {
  X,
  MapPin,
  Home,
  Briefcase,
  MoreHorizontal,
  Navigation,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress?: CustomerLocationRes | null;
  onAddressSaved?: (savedAddress: CustomerLocationRes) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  editingAddress,
  onAddressSaved,
}) => {
  const {
    saveCustomerAddress,
    updateCustomerAddress,
    resolvePincode,
    user,
    showToast,
  } = useShop();

  const { lookup: lookupPincode } = usePincode();

  const [formData, setFormData] = useState<LocationReq>({
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    cityVillage: '',
    landmark: '',
    mobileNumber: '',
    alternatePhone: '',
    customerAddressType: 'HOME',
    countryId: 1,
    stateId: 28,
    districtId: 504,
    latitude: 16.3067,
    longitude: 80.4365,
  });

  const [resolvedLocation, setResolvedLocation] = useState<{
    countryName: string;
    stateName: string;
    districtName: string;
    pincode: string;
  } | null>(null);

  const [isResolvingPin, setIsResolvingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        pincode: editingAddress.pincode,
        addressLine1: editingAddress.addressLine1,
        addressLine2: editingAddress.addressLine2 || '',
        cityVillage: editingAddress.cityVillage,
        landmark: editingAddress.landmark || '',
        mobileNumber: editingAddress.mobileNumber,
        alternatePhone: editingAddress.alternatePhone || '',
        customerAddressType: editingAddress.addressType,
        countryId: editingAddress.countryId,
        stateId: editingAddress.stateId,
        districtId: editingAddress.districtId,
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude,
      });
      setResolvedLocation({
        countryName: editingAddress.countryName,
        stateName: editingAddress.stateName,
        districtName: editingAddress.districtName,
        pincode: editingAddress.pincode,
      });
      setIsDefault(editingAddress.defaultAddress);
    } else {
      // Default initial form
      setFormData({
        pincode: '522002',
        addressLine1: '',
        addressLine2: '',
        cityVillage: 'Guntur',
        landmark: '',
        mobileNumber: '+91 98765 43210',
        alternatePhone: '',
        customerAddressType: 'HOME',
        countryId: 1,
        stateId: 28,
        districtId: 504,
        latitude: 16.3067,
        longitude: 80.4365,
      });
      setResolvedLocation({
        countryName: 'India',
        stateName: 'Andhra Pradesh',
        districtName: 'Guntur',
        pincode: '522002',
      });
      setIsDefault(false);
    }
  }, [editingAddress, isOpen]);

  if (!isOpen) return null;

  // Auto resolve when 6 digits entered
  const handlePincodeChange = async (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: clean }));
    setPinError(null);

    if (clean.length === 6) {
      setIsResolvingPin(true);
      try {
        const res = await resolvePincode(clean);
        if (res) {
          setResolvedLocation({
            countryName: res.countryName,
            stateName: res.stateName,
            districtName: res.districtName,
            pincode: res.pincode,
          });
          setFormData((prev) => ({
            ...prev,
            countryId: res.countryId,
            stateId: res.stateId,
            districtId: res.districtId,
            cityVillage: prev.cityVillage || res.districtName.split(' ')[0],
          }));
        } else {
          setPinError('Could not verify PIN code. Please enter city/state manually.');
        }
      } catch (err) {
        setPinError('Error resolving PIN code');
      } finally {
        setIsResolvingPin(false);
      }
    } else {
      if (clean.length < 6) {
        setResolvedLocation(null);
      }
    }
  };

  const handleManualResolve = async () => {
    if (formData.pincode.length !== 6) {
      setPinError('Enter a complete 6-digit Indian PIN code');
      return;
    }
    setIsResolvingPin(true);
    const res = await resolvePincode(formData.pincode);
    setIsResolvingPin(false);
    if (res) {
      setResolvedLocation({
        countryName: res.countryName,
        stateName: res.stateName,
        districtName: res.districtName,
        pincode: res.pincode,
      });
      setFormData((prev) => ({
        ...prev,
        countryId: res.countryId,
        stateId: res.stateId,
        districtId: res.districtId,
        cityVillage: prev.cityVillage || res.districtName.split(' ')[0],
      }));
    } else {
      setPinError('Could not resolve PIN code');
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(pos.coords.latitude.toFixed(5)),
          longitude: parseFloat(pos.coords.longitude.toFixed(5)),
        }));
        setIsDetectingGps(false);
        showToast('GPS coordinates captured accurately!');
      },
      (err) => {
        // Fallback default coordinates
        setFormData((prev) => ({
          ...prev,
          latitude: 16.3067,
          longitude: 80.4365,
        }));
        setIsDetectingGps(false);
        showToast('Using pinned location coordinates (16.3067° N, 80.4365° E).');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.addressLine1.trim()) {
      showToast('Please enter House/Flat No. & Building Name.');
      return;
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      showToast('Please enter a contact mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      let savedResult: CustomerLocationRes;
      if (editingAddress) {
        savedResult = await updateCustomerAddress(editingAddress.id, formData);
      } else {
        savedResult = await saveCustomerAddress(formData, isDefault);
      }

      if (onAddressSaved) {
        onAddressSaved(savedResult);
      }
      onClose();
    } catch (err) {
      showToast('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <MapPin className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Matches Java CustomerLocationRes / LocationReq DTO
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Pincode Resolver Row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>PIN Code</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-sky-700 font-medium">
                Auto-resolves City, District &amp; State
              </span>
            </div>

            <div className="relative flex items-center gap-2">
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="e.g. 522002 or 560038"
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono tracking-wider font-semibold text-slate-900"
                required
              />

              <button
                type="button"
                onClick={handleManualResolve}
                disabled={isResolvingPin || formData.pincode.length !== 6}
                className="px-3.5 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isResolvingPin ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lookup</span>
                  </>
                )}
              </button>
            </div>

            {pinError && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{pinError}</span>
              </p>
            )}

            {/* Resolved Location Pill Badge */}
            {resolvedLocation && (
              <div className="mt-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold">{resolvedLocation.districtName}</span>
                    <span className="text-emerald-700">, {resolvedLocation.stateName}</span>
                    <span className="text-emerald-600 font-medium ml-1">
                      ({resolvedLocation.countryName})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                  PIN {resolvedLocation.pincode}
                </span>
              </div>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Flat / House No. / Apartment / Building <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              placeholder="e.g. Flat 402, Sri Krishna Residency"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-900"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Area / Street / Sector / Layout
            </label>
            <input
              type="text"
              value={formData.addressLine2 || ''}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              placeholder="e.g. 12-45 Main Road, Arundelpet"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-900"
            />
          </div>

          {/* City / Village & Landmark Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Town / Village <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cityVillage}
                onChange={(e) => setFormData({ ...formData, cityVillage: e.target.value })}
                placeholder="e.g. Guntur"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Opp. Hindu College Grounds"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-900"
              />
            </div>
          </div>

          {/* Contact Numbers Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alternate Phone
              </label>
              <input
                type="tel"
                value={formData.alternatePhone || ''}
                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                placeholder="Optional secondary phone"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Address Type Selector (HOME, WORK, OTHER) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Address Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'HOME' as CustomerAddressType, label: 'Home', icon: Home, desc: 'All Day' },
                {
                  type: 'WORK' as CustomerAddressType,
                  label: 'Work / Office',
                  icon: Briefcase,
                  desc: '10am - 6pm',
                },
                {
                  type: 'OTHER' as CustomerAddressType,
                  label: 'Other',
                  icon: MoreHorizontal,
                  desc: 'Custom',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = formData.customerAddressType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, customerAddressType: item.type })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/80 text-sky-950 ring-2 ring-sky-200'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 mb-1.5 ${
                        isSelected ? 'text-sky-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GPS Coordinates Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-800">GPS Pin: </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {formData.latitude?.toFixed(4)}°, {formData.longitude?.toFixed(4)}°
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {isDetectingGps ? 'Detecting...' : 'Use My GPS'}
            </button>
          </div>

          {/* Set as Default Checkbox */}
          <label className="flex items-center gap-2.5 p-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700">
              Make this my default delivery address
            </span>
          </label>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-[#881337] hover:bg-[#6b0f2b] disabled:bg-slate-300 text-white text-xs font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Server...</span>
                </>
              ) : (
                <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
