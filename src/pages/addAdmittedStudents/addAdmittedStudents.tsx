import GetIcons from '@/assets/icons';
import AsyncSelect from '@/components/asyncSelect';
import Button from '@/components/button';
import Menu from '@/components/dropdown';
import Input from '@/components/input';
import PhoneNumberInput from '@/components/phoneNumberInput';
import TextArea from '@/components/textArea';
import { ListCollegeNames, ListCourses } from '@/services/collegeService';
import { AddAdmittedStudents } from '@/services/studentService';
import useStore from '@/store/store';
import {
  basicInfo,
  docFields,
  mapDropDownOptions,
  paymentFields,
} from '@/utils/constants';
import { notify } from '@/utils/helpers/helpers';
import { AddAdmittedStudentSchema } from '@/utils/validationSchemas';
import { Formik, FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
//@ts-ignore
interface InitialValueTypes extends IStudent {
  student_response?: string[];
}
/**
 * @namespace {AddStudent}
 * @description ADD Admitted students
 * @returns {React.JSX.Element}
 */
const AddStudent: React.FC = (): React.JSX.Element => {
  const {
    userDetails: { is_admin, is_agent, is_employee },
  } = useStore((state) => state);

  /*******************************SERVICES********************************************* */
  /**
   * @function handleNewStudent
   * @description create a new student
   * @param values
   */
  const handleNewStudent = (
    values: IAdmittedStudent,
    action: FormikHelpers<IAdmittedStudent>
  ) => {
    const formData = new FormData();

    Object.keys(values).forEach((field) => {
      if (['f_code', 'm_code'].includes(field)) return;

      //@ts-ignore
      formData.set(field, values[field]);
    });

    AddAdmittedStudents(formData)
      .then((value) => {
        notify(value?.message, { type: 'success' });
        action.resetForm();
      })
      .finally(() => action.setSubmitting(false));
  };

  const loadCollegeOptions = async (search: string) => {
    try {
      const response = await ListCollegeNames({ search });
      return {
        options: response?.map((clg: string) => ({
          label: clg,
          value: clg,
        })),
        hasMore: false,
      };
    } catch (error) {
      console.error('Failed to load options:', error);
      return { options: [], hasMore: false };
    }
  };

  const loadCourseOptions = async (search: string) => {
    try {
      const response = await ListCourses({ search });
      return {
        options: response?.map((clg: string) => ({
          label: clg,
          value: clg,
        })),
        hasMore: false,
      };
    } catch (error) {
      console.error('Failed to load options:', error);
      return { options: [], hasMore: false };
    }
  };
  /*******************************CUSTOM METHODS********************************************* */

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    setFieldValue: FormikHelpers<any>['setFieldValue']
  ) => {
    const max_limit =
      e?.target?.files?.[0]?.type === 'application/pdf'
        ? 1 * 1024 * 1024
        : 2 * 1024 * 1024;

    //@ts-ignore
    if (e?.target?.files?.[0]?.size > max_limit) {
      alert('File size exceeded');
      e.target.value = '';
      return;
    }
    const file = e?.target?.files?.[0] || null;
    setFieldValue(field, file);
  };

  const isFieldViewable: (f: string) => boolean = useCallback(
    (f) =>
      [
        ...(is_employee
          ? [
              'balance_service_charge',
              'total_service_charge',
              'service_charge_withdrawn',
            ]
          : ['employee_incentive']),
      ].includes(f),
    [is_admin, is_agent, is_employee]
  );

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-white p-2 slideIn overflow-auto">
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone_number: '',
          address: '',
          father_name: '',
          father_contact_no: '',
          mother_name: '',
          mother_contact_no: '',
          gender: '',
          blood_group: '',
          course: '',
          college: '',
          course_status: '',
          passport_photo: '',
          SSLC: '',
          plus_two: '',
          aadhar: '',
          other_documents: '',
          uniform_fee: '',
          extra_fee: '',
          first_year: '',
          second_year: '',
          third_year: '',
          fourth_year: '',
          fifth_year: '',
          KEA_id: '',
          password: '',
          m_code: '',
          f_code: '',
        }}
        //@ts-ignore
        onSubmit={handleNewStudent}
        validationSchema={AddAdmittedStudentSchema}
      >
        {({
          dirty,
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          resetForm,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
            <h5 className="font-bold text-primary border-b py-1">Basic Info</h5>
            <section className="grid grid-cols-1 gap-4 gap-y-8  md:grid-cols-2">
              {Object.keys(values)
                .filter((field) => basicInfo.includes(field))
                .map((field, index) =>
                  field === 'address' ? (
                    <TextArea
                      key={index}
                      label={field.replace('_', ' ')}
                      name={field}
                      placeholder={field}
                      labelPlacement="outside"
                      maxRows={3}
                      value={values?.[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : ['course', 'college'].includes(field) ? (
                    <AsyncSelect
                      label={`${field} Name*`}
                      loadOptions={
                        field === 'college'
                          ? loadCollegeOptions
                          : loadCourseOptions
                      }
                      value={{
                        //@ts-ignore
                        label: values?.[field],
                        //@ts-ignore
                        value: values?.[field],
                      }}
                      onChange={(e) => setFieldValue(field, e?.label)}
                      //@ts-ignore
                      isInvalid={touched?.[field] && !!errors?.[field]}
                      showError={true}
                      //@ts-ignore
                      errorText={errors?.[field]}
                    />
                  ) : field === 'phone_number' ? (
                    <PhoneNumberInput
                      label="Phone Number*"
                      name="phone_number"
                      onBlur={handleBlur}
                      value={values.phone_number}
                      error={errors.phone_number}
                      isInvalid={touched.phone_number && !!errors.phone_number}
                      handleChange={(value) =>
                        setFieldValue('phone_number', value)
                      }
                    />
                  ) : (
                    <Input
                      key={index}
                      //@ts-ignore
                      label={field.replaceAll('_', ' ')}
                      name={field}
                      placeholder={field}
                      labelPlacement="outside"
                      //@ts-ignore
                      isInvalid={touched?.[field] && !!errors?.[field]}
                      //@ts-ignore
                      value={values?.[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )
                )}
            </section>
            <h5 className="font-bold text-primary border-b py-1">Fees Info</h5>
            <section className="grid grid-cols-1 gap-4 gap-y-8  md:grid-cols-2">
              {Object.keys(values)
                .filter((_fileld) => paymentFields.includes(_fileld))
                .map((field, index) => {
                  return (
                    <Input
                      key={index}
                      className={isFieldViewable(field) ? 'hidden' : ''}
                      //@ts-ignore
                      label={field.replaceAll('_', ' ')}
                      name={field}
                      placeholder={field}
                      labelPlacement="outside"
                      //@ts-ignore
                      isInvalid={touched?.[field] && !!errors?.[field]}
                      //@ts-ignore
                      value={values?.[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  );
                })}
            </section>

            <h5 className="font-bold text-primary border-b py-1">Others</h5>
            <section className="grid grid-cols-1 gap-4 gap-y-8  md:grid-cols-2">
              {Object.keys(values)
                .filter(
                  (_fileld) =>
                    ![
                      ...basicInfo,
                      ...docFields,
                      ...paymentFields,
                      ...(values?.course !== 'Bsc Nursing'
                        ? ['KEA_id', 'password']
                        : ''),
                    ].includes(_fileld)
                )
                .map((field, index) => {
                  if (
                    ['course_status', 'gender', 'blood_group'].includes(field)
                  ) {
                    return (
                      <Menu
                        //@ts-ignore
                        label={field.replaceAll('_', ' ')}
                        //@ts-ignore
                        options={mapDropDownOptions?.[field] || []}
                        onSelectItem={({ value }) =>
                          setFieldValue(field, value)
                        }
                        menuClass="w-full"
                        isSelectable={true}
                        selectedItem={
                          //@ts-ignore
                          mapDropDownOptions?.[field]?.find(
                            (options: { value: any }) =>
                              //@ts-ignore
                              options.value === values?.[field]
                          )?.label
                        }
                      />
                    );
                  } else if (
                    ['father_contact_no', 'mother_contact_no'].includes(field)
                  ) {
                    return (
                      <PhoneNumberInput
                        //@ts-ignore
                        label={field.replaceAll('_', ' ')}
                        name={field}
                        onBlur={handleBlur}
                        //@ts-ignore
                        value={values?.[field]}
                        //@ts-ignore
                        error={errors?.[field]}
                        isInvalid={
                          //@ts-ignore
                          touched?.[field] && !!errors?.[field]
                        }
                        handleChange={(value, _code) => {
                          setFieldValue(field, value);
                          const code =
                            field === 'father_contact_no' ? 'f_code' : 'm_code';
                          setFieldValue(code, _code);
                        }}
                      />
                    );
                  } else
                    return (
                      <Input
                        key={index}
                        //@ts-ignore
                        label={field.replaceAll('_', ' ')}
                        name={field}
                        placeholder={field}
                        labelPlacement="outside"
                        //@ts-ignore
                        isInvalid={touched?.[field] && !!errors?.[field]}
                        //@ts-ignore

                        value={values?.[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    );
                })}
            </section>

            <>
              <h5 className="font-bold text-primary border-b py-1">
                Documnets
              </h5>
              <div className="flex gap-2 items-center text-red-500 text-sm">
                <span>{GetIcons('info')} </span>
                File size is limited to 4MB for pdf and 2MB for images
              </div>
              <section className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2">
                {Object.keys(values)
                  .filter((field) => docFields.includes(field))
                  .map((field, index) => (
                    <div className="flex flex-col gap-2">
                      <label key={index} htmlFor={field} className="capitalize">
                        {field.replace('_', ' ')}
                      </label>
                      {/*@ts-ignore  */}
                      {values[field] && (
                        <a
                          href={`${import.meta.env.VITE_BASE_URL}/${values?.[field as keyof typeof values]}`}
                          target="_blank"
                          className="text-blue-600"
                        >
                          Click to view
                        </a>
                      )}
                      <input
                        type="file"
                        name={field}
                        id={field}
                        className="font-medium p-2 border-1 rounded-lg cursor-pointer text-primary flex gap-2 items-center"
                        accept={
                          field === 'passport_photo'
                            ? '.jpg,.jpeg'
                            : '.pdf,.jpg,.jpeg'
                        }
                        onChange={(e) =>
                          handleFileUpload(e, field, setFieldValue)
                        }
                        onBlur={handleBlur}
                      />
                    </div>
                  ))}
              </section>
            </>

            <div className="col-span-2 flex items-center gap-3">
              <Button
                label="Discard"
                color="danger"
                type="button"
                disabled={!dirty}
                onClick={() => resetForm()}
              />
              <Button
                label="Submit"
                color="success"
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddStudent;
