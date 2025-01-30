import { AxiosError } from 'axios';
import { notify } from './helpers';

export const handleError = (error: any) => {
  const _error = { message: 'Something went wrong' };
  if (error instanceof AxiosError && error.response?.data.message) {
    _error.message = error.response?.data.message;
  }
  notify(_error.message, { type: 'error' });
};
