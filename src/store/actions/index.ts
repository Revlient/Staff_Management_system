import { IStore } from '../store';

const appStore = (
  set: (
    partial: Partial<IStore> | ((state: IStore) => Partial<IStore>),
    replace?: boolean
  ) => void
) => ({
  bulkRegisterData: {
    download_link: '',
    successful_registrations: 0,
    failed_registrations: 0,
  },
  userDetails: {
    email: '',
    first_name: '',
    id: '',
    is_admin: false,
    is_agent: false,
    is_employee: false,
    last_name: '',
    phone_number: '',
    username: '',
    checked_in: false,
    checked_out: false,
    work_location: '',
    password_changed: true,
  },
  selectedRowIds: {},
  courseDetails: {
    college_name: '',
    course_name: [],
    college_location: '',
    course_description: '',
    brochure: null,
  },
  filterSearch: [],
  notifications: { count: 0, results: [] },
  setNotifications: (data: { count: number; results: INotification[] }) => {
    set(() => ({ notifications: data }));
  },
  setCourseDetails: (data: IAddCollege) => {
    set(() => ({ courseDetails: data }));
  },
  setSelectedRowIds: (idObj: { [page: number | string]: string[] }) => {
    set(() => ({ selectedRowIds: idObj }));
  },
  setBulkRegisterData: (data: IBulkRegister_R) =>
    set(() => ({ bulkRegisterData: data })),
  setUserDetails: (data: IUserDetails) => set(() => ({ userDetails: data })),
  setFilterSearch: (data: { label: string; key: string }[]) =>
    set(() => ({ filterSearch: data })),
});

export default appStore;
