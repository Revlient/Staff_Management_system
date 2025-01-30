type TOption = { label: string; value: string | number };
type TBulkRegister = FormData;
type TBulkAddStudent = FormData;
type TColumn = {
  title: { label: string; additional?: string };
  type: string;
  d_name: string;
  isSort?: boolean;
};
type TStudentStatus =
  | 'interested'
  | 'not_interested'
  | 'pending'
  | 'accepted'
  | 'follow_up';

type TAdmissionStatus = 'all' | 'admitted_students' | 'not_admitted_students';
type TAdmittedStudent = {
  state: boolean;
  id: string;
};

type TOption = { label: string; value: string };
type TNewNotification = {
  notification_message: string;
  message_id?: string;
};

type TAttendenceList = {
  username: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  count: string;
  page: number;
};

type TResetPassword = {
  new_password: string;
  confirm_password: string;
  otp: string;
};

type TPasswordResetPage = {
  email: string;
} & TResetPassword;
