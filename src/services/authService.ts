import { getLocalStorage, setLocalStorage } from '@/utils/helpers/helpers';
import { api, privateAPI } from './config/api.config';
import { handleError } from '@/utils/helpers/errorHandler';

export const Login = async (payload: ILogin) => {
  try {
    const response = await api.post('auth/login/', payload);
    setLocalStorage({ key: '_at', value: response.data.access });
    setLocalStorage({ key: '_rt', value: response.data.refresh });
    return true;
  } catch (error) {
    throw error;
  }
};

export const ValidateToken = async () => {
  try {
    const response = await privateAPI.post('auth/validate-token/', {
      access: getLocalStorage('_at'),
    });
    return response.data;
  } catch (error) {
    return false;
  }
};

export const GetUserDetails = async () => {
  try {
    const response = await privateAPI.get('auth/user-details/');
    return response.data;
  } catch (error) {
    return false;
  }
};
export const ForgetPassword = async (payload: { email: string }) => {
  try {
    const response = await api.post(`auth/forget-password/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
