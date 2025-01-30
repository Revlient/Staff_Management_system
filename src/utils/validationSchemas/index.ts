import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Yup from 'yup';

export const AuthSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const NewEmployeeSchema = Yup.object({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  phone_number: Yup.string().required('Required'),
  is_admin: Yup.boolean().required(),
  is_employee: Yup.boolean().required(),
});

const commmonStudentSchema = {
  name: Yup.string().required('Required').max(50),
  email: Yup.string().email('Enter a valid email'),
  phone_number: Yup.string()
    .test('is-valid-phone', 'Enter a valid number', (value) => {
      return typeof value == 'string' && isValidPhoneNumber(value);
    })
    .required('Required'),
  address: Yup.string().max(250, 'Character limit exceeded'),
  course: Yup.string().max(100),
};
export const AddStudentSchema = Yup.object(commmonStudentSchema);

export const editStudentValidationSchema = Yup.object().shape({
  ...commmonStudentSchema,
  phone_number: Yup.string().required(),
  approval_status: Yup.string().oneOf(
    ['approved', 'not_approved'],
    'Invalid approval status'
  ),
  course_status: Yup.string().oneOf(
    ['ongoing', 'completed', 'cancelled'],
    'Invalid course status'
  ),
  admin_messages: Yup.string().nullable(), // Can be null
  mode_of_payment: Yup.string().oneOf(
    ['upi', 'cash', 'net_banking'],
    'Invalid mode of payment'
  ),
  student_status: Yup.object({
    label: Yup.string(),
    value: Yup.string().oneOf(
      ['interested', 'not_interested', 'pending', 'accepted', 'follow_up'],
      'Invalid status'
    ),
  }),
  amount_paid_to_agent: Yup.number()
    .nullable()
    .typeError('Amount must be a number')
    .min(0, 'Amount cannot be negative'),
  amount_paid_to_college: Yup.number()
    .nullable()
    .typeError('Amount must be a number')
    .min(0, 'Amount cannot be negative'),
  first_year: Yup.string().nullable(),
  second_year: Yup.string().nullable(),
  third_year: Yup.string().nullable(),
  fourth_year: Yup.string().nullable(),
  date_of_payment: Yup.date().nullable(),
  passport_photo: Yup.mixed().nullable(),
  SSLC: Yup.mixed().nullable(),
  plus_two: Yup.mixed().nullable(),
  aadhar: Yup.mixed().nullable(),
  other_documents: Yup.mixed().nullable(),
  staff_assigned: Yup.string(),
  staff_assigned_full_name: Yup.string(),
});

export const CollegeSchema = Yup.object({
  college_name: Yup.string().required('Required'),
  course_name: Yup.array()
    .of(Yup.string().required('Each course name is required'))
    .required('Course names are required')
    .min(1, 'At least one course name is required'),
  college_location: Yup.string().required('Required'),
  course_description: Yup.string(),
  brochure: Yup.mixed().nullable(),
});

export const LocationValidationSchema = Yup.object({
  locations: Yup.array().of(
    Yup.object().shape({
      center_latitude: Yup.number()
        .required('Center latitude is required')
        .min(-90, 'Latitude must be at least -90')
        .max(90, 'Latitude must be at most 90'),
      center_longitude: Yup.number()
        .required('Center longitude is required')
        .min(-180, 'Longitude must be at least -180')
        .max(180, 'Longitude must be at most 180'),
      radius: Yup.number().required('Radius is required'),
      office_name: Yup.string().required('Location is required'),
    })
  ),
});

export const EmailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});
export const ResetPasswordSchema = Yup.object().shape({
  new_password: Yup.string()
    .required('This field is required')
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[A-Z]/, 'Password should contain at least 1 capital letter.')
    .matches(/[a-z]/, 'Password should contain at least 1 lowercase letter.')
    .matches(
      /[@$!%*?&#]/,
      'Password should contain at least 1 special character.'
    ),
  confirm_password: Yup.string()
    .required('This field is required')
    .oneOf([Yup.ref('new_password')], 'Password doesn"t match.'),
  otp: Yup.string()
    .matches(/^\d+$/, 'OTP should contain only digits')
    .required('This field is required'),
});
export const PaymentDetailsSchema = Yup.object({
  account_details: Yup.string().required('Account details are required'),
  amount_paid_to_college: Yup.number()
    .min(0, 'Amount paid to college must be at least 0')
    .required('required'),
  amount_received_from_student: Yup.number()
    .required('required')
    .when('amount_paid_to_college', (amt, schema) =>
      schema.min(
        amt[0],
        'Amount from the student must be equal to or higher than amount paid to college'
      )
    ),
  date_of_payment: Yup.string().nullable(),
  payment_screenshot: Yup.mixed().nullable().notRequired(),
  remarks: Yup.string()
    .max(255, 'Remarks must be at most 255 characters')
    .nullable()
    .notRequired(),
});
export const AddAdmittedStudentSchema = Yup.object({
  ...commmonStudentSchema,
  first_year: Yup.string().nullable(),
  second_year: Yup.string().nullable(),
  third_year: Yup.string().nullable(),
  fourth_year: Yup.string().nullable(),
  fifth_year: Yup.string().nullable(),
  SSLC: Yup.mixed().nullable(),
  plus_two: Yup.mixed().nullable(),
  aadhar: Yup.mixed().nullable(),
  other_documents: Yup.mixed().nullable(),
  father_name: Yup.string(),
  father_contact_no: Yup.string().when('f_code', (f_code, schema) => {
    return schema.test('is-valid-phone', 'Enter a valid number', (value) => {
      if (!value) return true;

      // Check if value contains only the country code
      if (value.startsWith(f_code[0]) && value.length === f_code[0].length) {
        return true;
      }
      return typeof value === 'string' && isValidPhoneNumber(value);
    });
  }),
  mother_name: Yup.string(),
  mother_contact_no: Yup.string().when('m_code', (m_code, schema) => {
    return schema.test('is-valid-phone', 'Enter a valid number', (value) => {
      if (!value) return true;

      // Check if value contains only the country code
      if (value.startsWith(m_code[0]) && value.length == m_code[0].length) {
        return true;
      }
      return typeof value === 'string' && isValidPhoneNumber(value);
    });
  }),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
  blood_group: Yup.string(),
  course: Yup.string().required('Course is required'),
  college: Yup.string().required('College is required'),
  course_status: Yup.string(),
  uniform_fee: Yup.string(),
  extra_fee: Yup.string(),
  KEA_id: Yup.string(),
  password: Yup.string(),
});
