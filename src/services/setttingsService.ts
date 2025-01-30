import { handleError } from '@/utils/helpers/errorHandler';
import { privateAPI } from './config/api.config';

export const GetLocationDetails = async () => {
  try {
    const response = await privateAPI.get('admin/geofence-settings/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const SetLocationDetails = async (payload: ILocationDetails[]) => {
  try {
    const response = await privateAPI.put('admin/geofence-settings/', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const CheckInApi = async (payload: { location: string }) => {
  try {
    const response = await privateAPI.post(`admin/check-in/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const CheckOutApi = async (payload: { location: string }) => {
  try {
    const response = await privateAPI.post(`admin/check-out/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const ListAttendence = async ({
  date = '',
  end_date = '',
  start_date = '',
  status = '',
  username = '',
  count = '10',
  page,
}: TAttendenceList) => {
  try {
    const response = await privateAPI.get(
      `admin/attendance-list/?username=${username}&date=${date}&start_date=${start_date}&end_date=${end_date}&status=${status}&page_size=${count}&page=${page}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const ChangePassword = async (payload: TResetPassword) => {
  try {
    const response = await privateAPI.post(`auth/change-password/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const ResetPassword = async (payload: { email: string }) => {
  try {
    const response = await privateAPI.post(`auth/reset-password/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
