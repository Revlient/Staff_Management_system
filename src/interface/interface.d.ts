interface ILogin {
  password: string;
  username: string;
}
interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
  is_agent: boolean;
  is_employee: boolean;
  is_agent: boolean;
  work_location?: string;
}
interface IListTableData {
  page: number;
  limit: number;
  type?: string;
  search?: string;
}

interface IListEmployees_R {
  count: number;
  results: IEmployee[];
}
interface IEmployee {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_employee: boolean;
  is_agent: boolean;
  work_location: string;
  is_admin: boolean;
}
interface IBulkRegister_R {
  download_link: string;
  successful_registrations: number;
  failed_registrations: number;
}
interface IStudent {
  id: string;
  name: string;
  email: null | string;
  phone_number: string;
  address: string;
  course: string;
  staff_assigned_full_name: string;
  status: string;
  is_admitted: boolean;
  student_response: string;
  approval_status: string;
  passport_photo: string;
  SSLC: string;
  plus_two: string;
  aadhar: string;
  other_documents: string;
  first_year: string;
  second_year: string;
  third_year: string;
  fourth_year: string;
  admin_messages: string;
  mode_of_payment: string;
  amount_paid_to_agent: string;
  amount_paid_to_college: string;
  date_of_payment: string;
  commision: string;
  payments: IPayment[];
}

interface IStudent_R {
  count: number;
  results: IStudent[];
}

interface IAddStudent {
  name: string;
  email: string;
  phone_number: string;
  place: string;
  course: string;
  college: string;
  assigned_employee: OptionType;
}

interface IListStudents extends IListTableData {
  id?: { employee_id: string } | '';
  type?: TAdmissionStatus;
  student_status: TStudentStatus;
}

interface IUserDetails {
  email: string;
  first_name: string;
  id: string;
  is_agent: boolean;
  is_admin: boolean;
  is_employee: boolean;
  is_agent: boolean;
  last_name: string;
  phone_number: string;
  username: string;
  checked_in: boolean;
  checked_out: boolean;
  work_location: string;
  password_changed: boolean;
}
interface OptionType {
  label: string;
  value: string;
}
interface IAddCollege {
  college_name: string;
  course_name: string[];
  college_location: string;
  course_description: string;
  brochure: File | null;
}

interface ICollege extends IAddCollege {
  id: string;
  brochure: string;
}

interface IDashboardEmployee {
  rank: number;
  employee_id: string;
  employee_reference_number: string;
  employee_name: string;
  number_of_admitted_students: number;
  last_admitted_student_at: string;
  profile_photo: string;
}

interface INotification {
  id: string;
  notification_message: string;
  created_at?: Date;
  updated_at: Date;
  created_by_full_name?: string;
}

interface ILocationDetails {
  office_name: string;
  center_latitude: number | null;
  center_longitude: number | null;
  radius: number | null;
}

interface ICheckInDetails {
  check_in_location: string;
  check_in_time: string | null;
  check_out_location: string | null;
  check_out_time: null | string;
  name: string;
  status: string;
  user_id: string;
  username: string;
  work_location: string;
}

interface IPayment {
  id: number;
  account_details: string;
  amount_received_from_student: string;
  amount_paid_to_college: string;
  date_of_payment: string;
  payment_screenshot: string;
  remarks: string;
  isNew?: boolean;
}

interface IAdmittedStudent {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  father_name: string;
  father_contact_no: string;
  mother_name: string;
  mother_contact_no: string;
  gender: string;
  blood_group: string;
  course: string;
  college: string;
  course_status: string;
  passport_photo: string;
  SSLC: string;
  plus_two: string;
  aadhar: string;
  other_documents: string;
  uniform_fee: string;
  extra_fee: string;
  first_year: string;
  second_year: string;
  third_year: string;
  fourth_year: string;
  fifth_year: string;
  KEA_id: string;
  password: string;
  m_code: string;
  f_code: string;
}
