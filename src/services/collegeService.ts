import { handleError } from '@/utils/helpers/errorHandler';
import { privateAPI } from './config/api.config';

export const ListColleges = async ({
  college = '',
  course = '',
  limit,
  page,
}: {
  course: string;
  college: string;
  limit: number;
  page: number;
}) => {
  try {
    const response = await privateAPI.get(
      `admin/colleges-courses/?course_name=${course}&search=${college}&page_size=${limit}&page=${page}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const RegisterCollege = async (payload: FormData, _id?: string) => {
  try {
    const response = await privateAPI.post(
      'admin/colleges-courses/add/',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const DeleteCollege = async (ids: string[]) => {
  try {
    const response = await privateAPI.delete('admin/colleges-courses/delete/', {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const UpdateCollege = async (payload: FormData, id: string) => {
  try {
    const response = await privateAPI.patch(
      `admin/colleges-courses/update/${id}/`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const GetCourseDetails = async (id: string) => {
  try {
    const response = await privateAPI.get(
      `admin/colleges-courses/details/${id}/`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const ListCourses = async ({ search }: { search?: string }) => {
  try {
    const response = await privateAPI.get(
      `admin/courses/${search ? `?search=${search}` : ''}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const ListCollegeNames = async ({ search }: { search?: string }) => {
  try {
    const response = await privateAPI.get(
      `admin/colleges/${search ? `?search=${search}` : ''}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
