import { handleError } from '@/utils/helpers/errorHandler';
import { privateAPI } from './config/api.config';

export const CreateNotification = async (payload: TNewNotification) => {
  try {
    const response = await privateAPI.post(
      'admin/notifications/create/',
      payload
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const GetNotifications = async ({
  page,
  page_size,
}: {
  data?: string;
  page?: number;
  page_size?: number;
}) => {
  try {
    const response = await privateAPI.get(
      `/employee/notifications/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const DeleteNotification = async (payload: string[]) => {
  try {
    const response = await privateAPI.post(`admin/notifications/delete/`, {
      notification_ids: payload,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
