import GetIcons from '@/assets/icons';
import AsyncSelect from '@/components/asyncSelect';
import Button from '@/components/button';
import Input from '@/components/input';
import PhoneNumberInput from '@/components/phoneNumberInput';
import TextArea from '@/components/textArea';
import { ListCollegeNames, ListCourses } from '@/services/collegeService';
import {
  AddBulkStudents,
  AddStudent as AddStudentApi,
} from '@/services/studentService';
import { notify } from '@/utils/helpers/helpers';
import { AddStudentSchema } from '@/utils/validationSchemas';
import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { ListEmployeeNames } from '@/services/employeeService';

/**
 * @namespace {AddEmployee}
 * @description renders add employee form
 * @returns {React.JSX.Element}
 */
const AddStudents: React.FC = (): React.JSX.Element => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);

  /************************************************************* */

  const loadOptions = async (search: string, _loadedOptions: any) => {
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

  const loadCourseOptions = async (search: string, _loadedOptions: any) => {
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

  const loadEmployeeOptions = async (
    search: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    try {
      console.log('here');

      const response = await ListEmployeeNames({ limit: 10, page, search });

      return {
        options: response.results.map(
          ({ name: label, id: value }: { name: string; id: string }) => ({
            label,
            value,
          })
        ),
        hasMore: Math.ceil(response.count / 3) > page,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error('Failed to load employee options:', error);
      return { options: [], hasMore: false };
    }
  };

  /*************************************************************** */

  /**
   * @function handleEmployeeRegister
   * @description submit form
   * @param values
   */
  const handleAddStudent = async (
    values: IAddStudent,
    actions: FormikHelpers<IAddStudent>
  ) => {
    AddStudentApi({
      ...values,
      assigned_employee: values.assigned_employee.value,
    }).then((resp) => {
      notify(resp.message, { type: 'success' });
      actions.resetForm();
      actions.setFieldValue('phone_number', '');
    });
  };

  const handleBulkRegister = async () => {
    setUploadingFile(true);
    const formData = new FormData();
    file && formData.append('file', file);
    AddBulkStudents(formData)
      .then((resp) =>
        notify(
          `${resp.failed_registrations} failed \n ${resp.successful_registrations} success`,
          { type: 'success' }
        )
      )
      .finally(() => setUploadingFile(false));
  };

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-white p-2 overflow-hidden slideIn">
      <div className="rounded-md bg-slate-300 p-3">
        <div className="flex items-center gap-4">
          <p className={file?.name && 'text-primary'}>
            {file ? (
              file.name
            ) : (
              <>
                Multiple Students can be added through a Excel file(.xlsx).{' '}
                <a
                  className="text-blue-500 text-small"
                  href={`${import.meta.env.VITE_BASE_URL}/media/sample_files/sample_students_file.xlsx`}
                >
                  Click here for Sample File
                </a>
              </>
            )}
          </p>
          {file && (
            <Button
              label="Upload"
              startContent={GetIcons('upload')}
              color="success"
              onClick={handleBulkRegister}
              isLoading={uploadingFile}
            />
          )}
          <label
            htmlFor="bulk_upload"
            className="ml-auto cursor-pointer rounded-lg border-1 bg-primary-800 p-2 font-medium text-white"
          >
            {file ? 'Change' : 'Select'} File
          </label>

          <input
            type="file"
            id="bulk_upload"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => setFile(e?.target?.files?.[0])}
          />
        </div>
      </div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone_number: '',
          place: '',
          course: '',
          college: '',
          assigned_employee: { label: '', value: '' },
        }}
        onSubmit={handleAddStudent}
        validationSchema={AddStudentSchema}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          handleChange,
          resetForm,
          handleBlur,
          handleSubmit,
        }) => (
          <form
            className="grid grid-cols-1 gap-4 gap-y-8 p-4 lg:grid-cols-2 overflow-auto flex-1 auto-rows-min"
            onSubmit={handleSubmit}
          >
            <Input
              label="Name*"
              name="name"
              placeholder="Name"
              labelPlacement="outside"
              isInvalid={touched.name && !!errors.name}
              value={values.name}
              errorText={errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Input
              label="Email*"
              name="email"
              labelPlacement="outside"
              placeholder="Email"
              isInvalid={touched.email && !!errors.email}
              errorText={errors.email}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <PhoneNumberInput
              label="Phone Number*"
              name="phone_number"
              onBlur={handleBlur}
              value={values.phone_number}
              error={errors.phone_number}
              isInvalid={touched.phone_number && !!errors.phone_number}
              handleChange={(value) => setFieldValue('phone_number', value)}
            />
            <TextArea
              label="Address"
              name="place"
              placeholder="Address"
              labelPlacement="outside"
              maxRows={3}
              errorText={errors.place}
              isInvalid={touched.place && !!errors.place}
              value={values.place}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <AsyncSelect
              label="College Name*"
              showError={true}
              errorText={errors.college}
              loadOptions={loadOptions}
              value={{ label: values.college, value: values.college }}
              onChange={(e) => setFieldValue('college', e?.label)}
            />
            <AsyncSelect
              label="Course Name*"
              loadOptions={loadCourseOptions}
              value={{ label: values.course, value: values.course }}
              onChange={(e) => setFieldValue('course', e?.label)}
            />
            <AsyncSelect
              label="Employee Name*"
              loadOptions={loadEmployeeOptions}
              value={values.assigned_employee}
              onChange={(e) => setFieldValue('assigned_employee', e)}
              additional={{ page: 1 }}
            />

            <div className="col-span-1 lg:col-span-2 flex items-center gap-3">
              <Button
                label="Discard"
                color="danger"
                type="button"
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

export default AddStudents;
