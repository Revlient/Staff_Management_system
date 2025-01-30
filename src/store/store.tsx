import { create } from 'zustand';
import appStore from './actions';

export interface IStore {
  bulkRegisterData: IBulkRegister_R;
  userDetails: IUserDetails;
  selectedRowIds: { [page: number | string]: string[] };
  courseDetails: IAddCollege;
  filterSearch: { label: string; key: string }[];
  notifications: {
    count: number;
    results: INotification[];
  };
  setCourseDetails: (data: IAddCollege) => void;
  setSelectedRowIds: (id: { [page: number | string]: string[] }) => void;
  setBulkRegisterData: (data: IBulkRegister_R) => void;
  setUserDetails: (data: IUserDetails) => void;
  setFilterSearch: (data: { label: string; key: string }[]) => void;
  setNotifications: (data: { count: number; results: INotification[] }) => void;
}

const useStore = create<IStore>()(appStore);

export default useStore;
