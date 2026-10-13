import {
  CustomerLocationRes,
  AdminLocationRes,
  LocationReq,
  PincodeRes,
  APIRes,
} from '../types';
import {
  INITIAL_CUSTOMER_ADDRESSES,
  INITIAL_ADMIN_ADDRESSES,
  PINCODE_DATABASE,
} from '../data/mockAddresses';

const CUSTOMER_ADDR_KEY = 'lune_customer_addresses_v1';
const ADMIN_ADDR_KEY = 'lune_admin_addresses_v1';

// Helpers to load / save local persistence
function loadCustomerAddresses(): CustomerLocationRes[] {
  try {
    const raw = localStorage.getItem(CUSTOMER_ADDR_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load customer addresses from localStorage', e);
  }
  return [...INITIAL_CUSTOMER_ADDRESSES];
}

function saveCustomerAddressesToStorage(list: CustomerLocationRes[]) {
  try {
    localStorage.setItem(CUSTOMER_ADDR_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save customer addresses', e);
  }
}

function loadAdminAddresses(): AdminLocationRes[] {
  try {
    const raw = localStorage.getItem(ADMIN_ADDR_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load admin addresses', e);
  }
  return [...INITIAL_ADMIN_ADDRESSES];
}

function saveAdminAddressesToStorage(list: AdminLocationRes[]) {
  try {
    localStorage.setItem(ADMIN_ADDR_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save admin addresses', e);
  }
}

/**
 * Service mimicking Spring Boot LocationController and PincodeController
 */
export const locationService = {
  /**
   * POST /api/pincode
   * Resolves pincode into country, state, district information
   */
  async resolvePincode(pincode: string): Promise<APIRes<PincodeRes>> {
    // Artificial small delay for network realism
    await new Promise((r) => setTimeout(r, 200));

    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      return {
        success: false,
        status: '400',
        message: 'Invalid 6-digit PIN code format',
        data: null as any,
      };
    }

    // Direct match from directory
    if (PINCODE_DATABASE[cleanPin]) {
      return {
        success: true,
        status: '200',
        message: 'PIN code resolved successfully',
        data: PINCODE_DATABASE[cleanPin],
      };
    }

    // Fallback resolution for any other valid 6-digit Indian PIN code based on Postal circles
    const prefix2 = cleanPin.substring(0, 2);
    let stateName = 'Andhra Pradesh';
    let stateId = 28;
    let districtName = 'Guntur District';
    let districtId = 504;

    if (prefix2 === '11') {
      stateName = 'Delhi';
      stateId = 7;
      districtName = 'New Delhi';
      districtId = 90;
    } else if (['12', '13'].includes(prefix2)) {
      stateName = 'Haryana';
      stateId = 6;
      districtName = 'Gurugram';
      districtId = 85;
    } else if (['14', '15', '16'].includes(prefix2)) {
      stateName = 'Punjab';
      stateId = 3;
      districtName = 'Amritsar';
      districtId = 40;
    } else if (['20', '21', '22', '24', '25', '26', '27', '28'].includes(prefix2)) {
      stateName = 'Uttar Pradesh';
      stateId = 9;
      districtName = 'Lucknow';
      districtId = 150;
    } else if (['30', '31', '32', '33', '34'].includes(prefix2)) {
      stateName = 'Rajasthan';
      stateId = 8;
      districtName = 'Jaipur';
      districtId = 110;
    } else if (['36', '37', '38', '39'].includes(prefix2)) {
      stateName = 'Gujarat';
      stateId = 24;
      districtName = 'Ahmedabad';
      districtId = 470;
    } else if (['40', '41', '42', '43', '44'].includes(prefix2)) {
      stateName = 'Maharashtra';
      stateId = 27;
      districtName = 'Mumbai / Pune';
      districtId = 518;
    } else if (['45', '46', '47', '48', '49'].includes(prefix2)) {
      stateName = 'Madhya Pradesh';
      stateId = 23;
      districtName = 'Bhopal';
      districtId = 440;
    } else if (['50', '51', '52', '53'].includes(prefix2)) {
      if (['50'].includes(prefix2)) {
        stateName = 'Telangana';
        stateId = 36;
        districtName = 'Hyderabad';
        districtId = 540;
      } else {
        stateName = 'Andhra Pradesh';
        stateId = 28;
        districtName = 'Guntur / Vijayawada';
        districtId = 504;
      }
    } else if (['56', '57', '58', '59'].includes(prefix2)) {
      stateName = 'Karnataka';
      stateId = 29;
      districtName = 'Bengaluru Urban';
      districtId = 572;
    } else if (['60', '61', '62', '63', '64'].includes(prefix2)) {
      stateName = 'Tamil Nadu';
      stateId = 33;
      districtName = 'Chennai';
      districtId = 602;
    } else if (['67', '68', '69'].includes(prefix2)) {
      stateName = 'Kerala';
      stateId = 32;
      districtName = 'Kochi / Ernakulam';
      districtId = 590;
    } else if (['70', '71', '72', '73', '74'].includes(prefix2)) {
      stateName = 'West Bengal';
      stateId = 19;
      districtName = 'Kolkata';
      districtId = 340;
    }

    const resolved: PincodeRes = {
      countryId: 1,
      countryName: 'India',
      stateId,
      stateName,
      districtId,
      districtName,
      pincode: cleanPin,
    };

    return {
      success: true,
      status: '200',
      message: 'PIN code resolved successfully',
      data: resolved,
    };
  },

  /**
   * GET /api/customer/address
   */
  async getCustomersAddress(): Promise<APIRes<CustomerLocationRes[]>> {
    await new Promise((r) => setTimeout(r, 100));
    const list = loadCustomerAddresses();
    return {
      success: true,
      status: '200',
      message: 'Customer addresses fetched successfully',
      data: list,
    };
  },

  /**
   * POST /api/customer/address
   */
  async saveCustomerAddress(
    req: LocationReq,
    isDefaultRequested = false
  ): Promise<APIRes<CustomerLocationRes>> {
    await new Promise((r) => setTimeout(r, 150));
    const current = loadCustomerAddresses();

    // Auto resolve pincode details if stateName / districtName not supplied
    let countryName = 'India';
    let countryId = req.countryId || 1;
    let stateName = 'Andhra Pradesh';
    let stateId = req.stateId || 28;
    let districtName = 'Guntur';
    let districtId = req.districtId || 504;

    if (PINCODE_DATABASE[req.pincode]) {
      const p = PINCODE_DATABASE[req.pincode];
      countryName = p.countryName;
      countryId = p.countryId;
      stateName = p.stateName;
      stateId = p.stateId;
      districtName = p.districtName;
      districtId = p.districtId;
    }

    // Determine if this should be default
    const shouldBeDefault = isDefaultRequested || current.length === 0;

    let updatedList = current;
    if (shouldBeDefault) {
      updatedList = current.map((a) => ({ ...a, defaultAddress: false }));
    }

    const newAddress: CustomerLocationRes = {
      id: Date.now(),
      customerId: 1,
      countryId,
      countryName,
      stateId,
      stateName,
      districtId,
      districtName,
      pincode: req.pincode,
      addressLine1: req.addressLine1,
      addressLine2: req.addressLine2 || '',
      cityVillage: req.cityVillage,
      landmark: req.landmark || '',
      mobileNumber: req.mobileNumber,
      alternatePhone: req.alternatePhone || '',
      addressType: req.customerAddressType || 'HOME',
      latitude: req.latitude || 16.3067,
      longitude: req.longitude || 80.4365,
      defaultAddress: shouldBeDefault,
    };

    updatedList.unshift(newAddress);
    saveCustomerAddressesToStorage(updatedList);

    return {
      success: true,
      status: '201',
      message: 'Address saved successfully',
      data: newAddress,
    };
  },

  /**
   * PUT /api/customer/address/{customerAddressId}
   * Sets the address as default
   */
  async updateDefaultCustomerAddress(
    customerAddressId: number
  ): Promise<APIRes<CustomerLocationRes>> {
    await new Promise((r) => setTimeout(r, 100));
    const current = loadCustomerAddresses();
    let updatedTarget: CustomerLocationRes | null = null;

    const updatedList = current.map((addr) => {
      if (addr.id === customerAddressId) {
        updatedTarget = { ...addr, defaultAddress: true };
        return updatedTarget;
      }
      return { ...addr, defaultAddress: false };
    });

    if (!updatedTarget) {
      return {
        success: false,
        status: '404',
        message: `Customer address with ID ${customerAddressId} not found`,
        data: null as any,
      };
    }

    saveCustomerAddressesToStorage(updatedList);

    return {
      success: true,
      status: '200',
      message: 'Default address updated successfully',
      data: updatedTarget,
    };
  },

  /**
   * PUT /api/customer/address/update/{customerAddressId}
   */
  async updateCustomerAddress(
    customerAddressId: number,
    req: Partial<LocationReq>
  ): Promise<APIRes<CustomerLocationRes>> {
    await new Promise((r) => setTimeout(r, 120));
    const current = loadCustomerAddresses();
    let target = current.find((a) => a.id === customerAddressId);

    if (!target) {
      return {
        success: false,
        status: '404',
        message: 'Address not found',
        data: null as any,
      };
    }

    const updatedTarget: CustomerLocationRes = {
      ...target,
      addressLine1: req.addressLine1 ?? target.addressLine1,
      addressLine2: req.addressLine2 ?? target.addressLine2,
      cityVillage: req.cityVillage ?? target.cityVillage,
      landmark: req.landmark ?? target.landmark,
      mobileNumber: req.mobileNumber ?? target.mobileNumber,
      alternatePhone: req.alternatePhone ?? target.alternatePhone,
      pincode: req.pincode ?? target.pincode,
      addressType: req.customerAddressType ?? target.addressType,
      latitude: req.latitude ?? target.latitude,
      longitude: req.longitude ?? target.longitude,
    };

    const updatedList = current.map((a) => (a.id === customerAddressId ? updatedTarget : a));
    saveCustomerAddressesToStorage(updatedList);

    return {
      success: true,
      status: '200',
      message: 'Address updated successfully',
      data: updatedTarget,
    };
  },

  /**
   * DELETE /api/customer/address/{customerAddressId}
   */
  async deleteCustomerAddress(customerAddressId: number): Promise<APIRes<boolean>> {
    await new Promise((r) => setTimeout(r, 100));
    const current = loadCustomerAddresses();
    const filtered = current.filter((a) => a.id !== customerAddressId);

    // If deleted was default, make the first one default
    if (filtered.length > 0 && !filtered.some((a) => a.defaultAddress)) {
      filtered[0].defaultAddress = true;
    }

    saveCustomerAddressesToStorage(filtered);

    return {
      success: true,
      status: '200',
      message: 'Address deleted successfully',
      data: true,
    };
  },

  /**
   * GET /api/admin/address
   */
  async getAdminAddress(): Promise<APIRes<AdminLocationRes[]>> {
    await new Promise((r) => setTimeout(r, 100));
    const list = loadAdminAddresses();
    return {
      success: true,
      status: '200',
      message: 'Admin addresses retrieved successfully',
      data: list,
    };
  },

  /**
   * POST /api/admin/address
   */
  async saveAdminAddress(req: LocationReq): Promise<APIRes<AdminLocationRes>> {
    await new Promise((r) => setTimeout(r, 150));
    const current = loadAdminAddresses();

    let countryName = 'India';
    let stateName = 'Maharashtra';
    let districtName = 'Mumbai';

    if (PINCODE_DATABASE[req.pincode]) {
      const p = PINCODE_DATABASE[req.pincode];
      countryName = p.countryName;
      stateName = p.stateName;
      districtName = p.districtName;
    }

    const newAdminAddr: AdminLocationRes = {
      id: Date.now(),
      countryId: req.countryId || 1,
      countryName,
      stateId: req.stateId || 27,
      stateName,
      districtId: req.districtId || 519,
      districtName,
      pincode: req.pincode,
      addressLine1: req.addressLine1,
      addressLine2: req.addressLine2 || '',
      cityVillage: req.cityVillage,
      landmark: req.landmark || '',
      mobileNumber: req.mobileNumber,
      alternatePhone: req.alternatePhone || '',
      addressType: req.adminAddressType || 'WAREHOUSE',
      latitude: req.latitude || 19.1197,
      longitude: req.longitude || 72.8826,
      defaultAddress: current.length === 0,
    };

    current.push(newAdminAddr);
    saveAdminAddressesToStorage(current);

    return {
      success: true,
      status: '201',
      message: 'Admin location registered',
      data: newAdminAddr,
    };
  },

  /**
   * PUT /api/admin/address/{adminAddressId}
   */
  async updateDefaultAdminAddress(adminAddressId: number): Promise<APIRes<AdminLocationRes>> {
    await new Promise((r) => setTimeout(r, 100));
    const current = loadAdminAddresses();
    let target: AdminLocationRes | null = null;

    const updated = current.map((addr) => {
      if (addr.id === adminAddressId) {
        target = { ...addr, defaultAddress: true };
        return target;
      }
      return { ...addr, defaultAddress: false };
    });

    if (!target) {
      return {
        success: false,
        status: '404',
        message: 'Admin location not found',
        data: null as any,
      };
    }

    saveAdminAddressesToStorage(updated);
    return {
      success: true,
      status: '200',
      message: 'Default admin dispatch center updated',
      data: target,
    };
  },

  /**
   * GET /api/admin/address/defaultAddress
   */
  async getDefaultAdminAddress(): Promise<AdminLocationRes> {
    const list = loadAdminAddresses();
    return list.find((a) => a.defaultAddress) || list[0];
  },
};
