import apiClient from '../../api/axios';
import { CustomerLocationRes, LocationReq, APIRes } from '../../types';
import { locationService } from '../locationService';

export const locationApi = {
  async getAddresses(): Promise<CustomerLocationRes[]> {
    try {
      const response = await apiClient.get<APIRes<CustomerLocationRes[]>>('/customer/address');
      return response.data?.data || (await locationService.getCustomersAddress()).data || [];
    } catch {
      const res = await locationService.getCustomersAddress();
      return res.data || [];
    }
  },

  async addAddress(req: LocationReq, isDefault = false): Promise<CustomerLocationRes> {
    try {
      const response = await apiClient.post<APIRes<CustomerLocationRes>>('/customer/address', {
        ...req,
        defaultAddress: isDefault,
      });
      return response.data?.data || (await locationService.saveCustomerAddress(req, isDefault)).data!;
    } catch {
      const res = await locationService.saveCustomerAddress(req, isDefault);
      return res.data!;
    }
  },

  async updateAddress(id: number, req: Partial<LocationReq>): Promise<CustomerLocationRes> {
    try {
      const response = await apiClient.put<APIRes<CustomerLocationRes>>(`/customer/address/${id}`, req);
      return response.data?.data || (await locationService.updateCustomerAddress(id, req)).data!;
    } catch {
      const res = await locationService.updateCustomerAddress(id, req);
      return res.data!;
    }
  },

  async setDefaultAddress(id: number): Promise<void> {
    try {
      await apiClient.patch(`/customer/address/${id}/default`);
    } catch {
      await locationService.updateDefaultCustomerAddress(id);
    }
  },

  async deleteAddress(id: number): Promise<void> {
    try {
      await apiClient.delete(`/customer/address/${id}`);
    } catch {
      await locationService.deleteCustomerAddress(id);
    }
  },
};

export default locationApi;
