import apiClient from '../../api/axios';
import { PincodeRes, APIRes } from '../../types';
import { locationService } from '../locationService';

export const pincodeApi = {
  async lookupPincode(pincode: string): Promise<PincodeRes | null> {
    try {
      const response = await apiClient.post<APIRes<PincodeRes>>('/pincode', { pincode });
      return response.data?.data || (await locationService.resolvePincode(pincode)).data || null;
    } catch {
      const res = await locationService.resolvePincode(pincode);
      return res.data || null;
    }
  },
};

export default pincodeApi;
