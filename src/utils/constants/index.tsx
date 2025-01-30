import GetIcons from '@/assets/icons';

export const navItems: string[] = [
  'dashboard',
  'employees',
  'agents',
  'students',
  'colleges',
  'attendence-list',
];
export const swrKeys = {
  EMPLOYEES: 'employees',
  AGENTS: 'agents',
  STUDENTS: 'students',
  VIEW_STUDENT: 'view_student',
  USER_DETAILS: 'user_details',
  COLLEGES: 'colleges',
  DASHBOARD: 'dashoboard',
  ATTENDENCE: 'attendence',
  COURSES: 'courses',
};
export const employeeColums: TColumn[] = [
  { title: { label: 'FIRST NAME' }, d_name: 'first_name', type: 'string' },
  {
    title: { label: 'LAST NAME' },
    d_name: 'last_name',

    type: 'string',
  },
  {
    title: {
      label: 'EMAIL',
    },
    d_name: 'email',
    type: 'string',
  },
  {
    title: {
      label: 'PHONE NUMBER',
    },
    d_name: 'phone_number',
    type: 'string',
  },
];
export const studentColums: TColumn[] = [
  {
    title: { label: 'NAME' },
    type: 'string',
    d_name: 'name',
  },
  {
    title: { label: 'EMAIL' },
    type: 'string',
    d_name: 'email',
  },
  {
    title: { label: 'PHONE NUMBER' },
    type: 'string',
    d_name: 'phone_number',
  },
  {
    title: { label: 'COURSE' },
    type: 'string',
    d_name: 'course',
  },
  {
    title: { label: 'COURSE STATUS' },
    type: 'status',
    d_name: 'course_status',
  },
  {
    title: {
      label: 'STAFF ASSIGNED',
    },
    type: 'string',
    d_name: 'staff_assigned_full_name',
  },
  {
    d_name: 'status',
    type: 'status',
    title: { label: 'STATUS' },
  },
  {
    d_name: 'admission_status',
    type: 'string',
    title: { label: 'ADMISSION STATUS' },
  },
];

export const headerMenuOptions = [
  { label: 'Settings', value: 'settings' },
  { label: 'Logout', value: 'logout' },
];
export const paymentModeOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'UPI', value: 'upi' },
  { label: 'Net Banking', value: 'net_banking' },
];
export const workModeOptions = [
  {
    label: 'Work From Office',
    value: 'work_from_office',
  },
  {
    label: 'Work From Home',
    value: 'work_from_home',
  },
];

export const studentStatusOption = [
  {
    label: 'Interested',
    value: 'interested',
  },
  {
    label: 'Not Interested',
    value: 'not_interested',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Accepted',
    value: 'accepted',
  },
  {
    label: 'Follow Up',
    value: 'follow_up',
  },
];

export const approvalStatus = [
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Not Approved',
    value: 'not_approved',
  },
];

export const courseStatus = [
  {
    label: 'Ongoing',
    value: 'ongoing',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];
export const gender = [
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

export const bloodGroupOptions = [
  {
    label: 'A Positive (A+)',
    value: 'A+',
  },
  {
    label: 'A Negative (A-)',
    value: 'A-',
  },
  {
    label: 'B Positive (B+)',
    value: 'B+',
  },
  {
    label: 'B Negative (B-)',
    value: 'B-',
  },
  {
    label: 'AB Positive (AB+)',
    value: 'AB+',
  },
  {
    label: 'AB Negative (AB-)',
    value: 'AB-',
  },
  {
    label: 'O Positive (O+)',
    value: 'O+',
  },
  {
    label: 'O Negative (O-)',
    value: 'O-',
  },
];
export const studentFilterOptions = [
  {
    label: 'Admission Status',
    iterables: [
      { label: 'All Students', value: 'all' },
      { label: 'Admitted', value: 'admitted_students' },
      { label: 'Not Admitted', value: 'not_admitted_students' },
    ],
  },
  {
    label: 'Student Status',
    iterables: [
      { label: 'Interested', value: 'interested' },
      { label: 'Not Interested', value: 'not_interested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'Follow Up', value: 'follow_up' },
    ],
  },
];

export const attendenceOptions = [
  {
    label: 'Status',
    iterables: [
      { label: 'Absent', value: 'Absent' },
      { label: 'Present', value: 'Present' },
    ],
  },
];

export const colorMapping: { [status: string]: string } = {
  PENDING: 'warning',
  ADMITTED: 'success',
  'NOT ADMITTED': 'danger',
  INTERESTED: 'primary',
  'NOT INTERESTED': 'grey',
  ACCEPTED: 'success',
  'Follow Up': 'warning',
  APPROVED: 'success',
  NOT_APPROVED: 'danger',
  ONGOING: 'warning',
  CANCELLED: 'danger',
  COMPLETED: 'success',
};
export const colorMappingAttendence: { [status: string]: string } = {
  PRESENT: 'success',
  ABSENT: 'danger',
};

export const prohibittedStudentFields = [];

export const mapDropDownOptions = {
  status: studentStatusOption,
  mode_of_payment: paymentModeOptions,
  approval_status: approvalStatus,
  course_status: courseStatus,
  gender,
  blood_group: bloodGroupOptions,
};
export const basicInfo = [
  'name',
  'email',
  'phone_number',
  'address',
  'course',
  'college',
];

export const adminEditableFields = [...basicInfo, 'course_status'];

export const adminFields = [
  'employee_incentive',
  'balance_service_charge',
  'service_charge_withdrawn',
  'total_service_charge',
  'admin_notes',
  'admin_messages',
  'approval_status',
  'staff_assigned_full_name',
];
export const autoCalculatedFields: string[] = [
  'total_fees',
  'balance_service_charge',
  'service_charge_withdrawn',
];
export const employeeRestrictedFields: string[] = [
  ...autoCalculatedFields,
  ...adminFields,
  'id',
  'staff_assigned',
  'admitted_by_full_name',
  'commision',
];

export const docFields: string[] = [
  'passport_photo',
  'SSLC',
  'plus_two',
  'aadhar',
  'other_documents',
];
export const paymentFields: string[] = [
  'total_fees',
  'extra_fee',
  'uniform_fee',
  'first_year',
  'second_year',
  'third_year',
  'fourth_year',
  'fifth_year',
];

export const tableHeaderOptions = [
  {
    label: (
      <span className="flex items-center gap-2">
        {GetIcons('delete')} Delete All
      </span>
    ),
    value: 'delete',
  },
];

export const collegeColums: TColumn[] = [
  {
    title: { label: 'COLLEGE' },
    type: 'string',
    d_name: 'college_name',
  },
  {
    title: { label: 'COURSE' },
    type: 'string',
    d_name: 'course_name',
  },
  {
    title: { label: 'lOCATION' },
    type: 'string',
    d_name: 'college_location',
  },
  {
    title: { label: 'BROCHURE' },
    type: 'string',
    d_name: 'brochure',
  },
];

export const AttendenceColums: TColumn[] = [
  {
    title: { label: 'Name' },
    type: 'string',
    d_name: 'name',
  },
  {
    title: { label: 'Status' },
    type: 'status',
    d_name: 'status',
  },
  {
    title: { label: 'Check in Location' },
    type: 'string',
    d_name: 'check_in_location',
  },
  {
    title: { label: 'Check out Location' },
    type: 'string',
    d_name: 'check_out_location',
  },
  {
    title: { label: 'Check In' },
    type: 'string',
    d_name: 'check_in_time',
  },
  {
    title: { label: 'Check Out' },
    type: 'string',
    d_name: 'check_out_time',
  },
  {
    title: {
      label: 'Work Mode',
    },
    type: 'string',
    d_name: 'work_location',
  },
];
export const TableOptions = ({
  isEdit,
  isView,
  isDownload,
  isDelete,
}: {
  isEdit: boolean;
  isView: boolean;
  isDownload: boolean;
  isDelete: boolean;
}) => {
  const options = [];

  if (isEdit) {
    options.push({ label: 'Edit', value: 'edit' });
  }
  if (isView) {
    options.push({ label: 'View', value: 'view' });
  }
  if (isDownload) {
    options.push({ label: 'Download', value: 'download' });
  }
  if (isDelete) {
    options.push({ label: 'Delete', value: 'delete' });
  }

  return options;
};
