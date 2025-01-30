import { handleError } from '@/utils/helpers/errorHandler';
import { privateAPI } from './config/api.config';

export const Register = async (payload: IRegister) => {
  try {
    const response = await privateAPI.post('auth/register/', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const BulkRegister = async (payload: TBulkRegister) => {
  try {
    const response = await privateAPI.post('auth/bulk-register/', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const ListEmployees = async ({
  limit,
  page,
  type,
  search,
}: IListTableData) => {
  try {
    const response = await privateAPI.get(
      `admin/employees/?page=${page}&page_size=${limit}&search=${search}${type ? `&type=${type}` : ''}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const ListEmployeeNames = async ({
  limit,
  page,
  search,
}: IListTableData) => {
  try {
    const response = await privateAPI.get(
      `admin/employee-list/?page=${page}&page_size=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const GetEmployeeRanking = async ({ limit, page }: IListTableData) => {
  try {
    const response = await privateAPI.get(
      `admin/employee-ranking/?page=${page}&page_size=${limit}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const DeleteEmployee = async (id: string) => {
  try {
    const response = await privateAPI.delete(`admin/delete-employee/${id}/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const EditEmployee = async (id: string, payload: IRegister) => {
  try {
    const response = await privateAPI.put(`/admin/edit-user/${id}/`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
