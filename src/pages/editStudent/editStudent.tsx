import GetIcons from '@/assets/icons';
import AsyncSelect from '@/components/asyncSelect';
import Button from '@/components/button';
import CheckBox from '@/components/checkbox';
import DatePicker from '@/components/datePicker';
import Menu from '@/components/dropdown';
import Input from '@/components/input';
import TextArea from '@/components/textArea';
import { ListCollegeNames, ListCourses } from '@/services/collegeService';
import { ListEmployeeNames } from '@/services/employeeService';
import {
  CreatePayments,
  DeletePayments,
  EditPayments,
  ListAccounts,
  ListPayments,
  updateStudent,
  ViewStudentDetails,
} from '@/services/studentService';
import useStore from '@/store/store';
import {
  adminFields,
  autoCalculatedFields,
  basicInfo,
  docFields,
  employeeRestrictedFields,
  mapDropDownOptions,
  paymentFields,
  swrKeys,
} from '@/utils/constants';
import { notify } from '@/utils/helpers/helpers';
import {
  editStudentValidationSchema,
  PaymentDetailsSchema,
} from '@/utils/validationSchemas';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
//@ts-ignore
interface InitialValueTypes extends IStudent {
  student_response?: string[];
}
/**
 * @namespace {EditStudent}
 * @description renders student details form
 * @returns {React.JSX.Element}
 */
const EditStudent: React.FC = (): React.JSX.Element => {
  const location = useLocation();
  const {
    userDetails: { is_admin, is_agent, is_employee },
  } = useStore((state) => state);

  /*******************************REACT-HOOKS********************************************* */
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [paymentsList, setPaymentsList] = useState<IPayment[]>([
    {
      account_details: '',
      amount_paid_to_college: '',
      amount_received_from_student: '',
      date_of_payment: '',
      id: 0,
      payment_screenshot: '',
      remarks: '',
    },
  ]);
  const isFieldDisabled = useMemo(
    () => (field: string) => {
      if (autoCalculatedFields.includes(field)) {
        return true;
      }

      return is_employee || is_agent
        ? employeeRestrictedFields?.includes(field)
        : ['admitted_by_full_name'].includes(field);
    },
    []
  );

  useEffect(() => {
    location?.state?.is_admitted && loadPayments();
  }, []);

  /*******************************SERVICES********************************************* */
  /**
   * @function handleStudentUpdate
   * @description submit form
   * @param values
   */
  const handleStudentUpdate = (
    values: InitialValueTypes,
    action: FormikHelpers<InitialValueTypes>
  ) => {
    const formData = new FormData();
    const authorizedFields = is_admin
      ? Object.keys(values).filter(
          (val) =>
            ![
              ...autoCalculatedFields,
              'payments',
              'id',
              'staff_assigned_full_name',
              'admitted_by_full_name',
              'commision',
              'password',
              'date_of_admission',
            ].includes(val)
        )
      : Object.keys(values).filter(
          (val) =>
            ![
              ...employeeRestrictedFields,
              'date_of_admission',
              'payments',
            ].includes(val)
        );

    authorizedFields.forEach((field) => {
      if (field === 'student_response') {
        const formated = values[field]?.reduce(
          (acc, item: string, index: number) => {
            acc = { ...acc, [`call_${index}`]: item };
            return acc;
          },
          {}
        );

        formated && formData.set('student_response', JSON.stringify(formated));
      } else if (
        //@ts-ignore
        values[field] === null ||
        field === 'admitted_by'
      ) {
        return;
      } else if (field === 'date_of_payment') {
        //@ts-ignore
        formData.set(field, values[field].replaceAll('/', '-'));
      } else {
        //@ts-ignore
        formData.set(field, values[field]);
      }
    });

    updateStudent({ id: location.state?.id, payload: formData })
      .then((value) => {
        mutate();
        notify(value?.message, { type: 'success' });
      })
      .finally(() => action.setSubmitting(false));
  };

  const { data, mutate } = useSWR(
    `${swrKeys.VIEW_STUDENT}-${location?.state?.id}`,
    async () => {
      const response = await ViewStudentDetails(location.state.id);

      return response?.student_response
        ? {
            ...response,
            student_response: Object.values(response?.student_response) || [],
          }
        : response;
    },
    {
      keepPreviousData: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const loadOptions = async (
    search: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    try {
      const response = await ListEmployeeNames({ limit: 3, page, search });

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
      return { options: [], hasMore: false };
    }
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
      return { options: [], hasMore: false };
    }
  };

  /**
   * @function handlePayments
   * @description create single payment
   * @param values
   * @param action
   */
  const handlePayments = (payload: IPayment) => {
    const formData = new FormData();

    Object.keys(payload).forEach((field) => {
      if (field === 'date_of_payment') {
        //@ts-ignore
        formData.set(field, payload[field]?.replaceAll('/', '-'));
      } else if (field === 'id') return;
      //@ts-ignore
      else if (
        field === 'payment_screenshot' &&
        typeof payload?.[field] === 'string'
      )
        return;
      else {
        //@ts-ignore
        formData.set(field, payload[field]);
      }
    });
    if (payload.isNew) {
      CreatePayments({ payload: formData, id: location.state.id }).then((e) => {
        notify(e.message, { type: 'success' });
        setPaymentsList((cv) =>
          cv.map((v, i) => (i === cv.length - 1 ? e.data : v))
        );
        mutate();
      });
    } else {
      EditPayments({
        payload: formData,
        id: location.state.id,
        p_id: payload.id,
      }).then((e) => {
        notify(e.message, { type: 'success' });
        mutate();
      });
    }
  };

  const loadPayments = () => {
    ListPayments(location.state.id).then((val) => setPaymentsList(val.results));
  };

  const handlePaymentDelete = () => {
    DeletePayments({ ids: selectedPayments, id: location.state.id }).then(
      (e) => {
        notify(e.message, { type: 'success' });
        setPaymentsList((cv) =>
          cv.filter((item) => !selectedPayments.includes(item.id))
        );
        mutate();
        setSelectedPayments([]);
      }
    );
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
      return { options: [], hasMore: false };
    }
  };
  const loadAccountOptions = async () => {
    try {
      const response = await ListAccounts();
      return {
        options: response?.map((clg: string) => ({
          label: clg,
          value: clg,
        })),
        hasMore: false,
      };
    } catch (error) {
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
        ? 4 * 1024 * 1024
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
      <Accordion className="bg-white h-full flex flex-col">
        <AccordionItem
          key={0}
          aria-label={'details'}
          title={'Details'}
          className=" flex flex-col"
        >
          <Formik
            initialValues={
              data || {
                status: '',
                student_response: [],
                mode_of_payment: '',
                amount_paid_to_agent: '',
                amount_paid_to_college: '',
                first_year: '',
                second_year: '',
                third_year: '',
                fourth_year: '',
                date_of_payment: '',
                passport_photo: '',
                SSLC: '',
                plus_two: '',
                aadhar: '',
                payments: [],
                other_documents: '',
                approval_status: '',
                admin_messages: '',
                staff_assigned: '',
                staff_assigned_full_name: '',
              }
            }
            onSubmit={handleStudentUpdate}
            validationSchema={editStudentValidationSchema}
            enableReinitialize={true}
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
                <h5 className="font-bold text-primary border-b py-1">
                  Basic Info
                </h5>
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
                          //@ts-ignore
                          isInvalid={touched?.[field] && !!errors?.[field]}
                          maxRows={3}
                          disabled={isFieldDisabled(field)}
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
                          disabled={isFieldDisabled(field)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      )
                    )}
                </section>
                <h5 className="font-bold text-primary border-b py-1">
                  Fees Info
                </h5>
                <section className="grid grid-cols-1 gap-4 gap-y-8  md:grid-cols-2">
                  {Object.keys(values)
                    .filter(
                      (_fileld) =>
                        paymentFields.includes(_fileld) &&
                        !adminFields.includes(_fileld)
                    )
                    .map((field, index) => {
                      if (['mode_of_payment'].includes(field)) {
                        return (
                          <Menu
                            containerClass="relative"
                            //@ts-ignore
                            label={field.replaceAll('_', ' ')}
                            //@ts-ignore
                            options={mapDropDownOptions?.[field] || []}
                            onSelectItem={({ value }) =>
                              setFieldValue(field, value)
                            }
                            menuClass="w-full"
                            disabled={isFieldDisabled(field)}
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
                      } else if (field === 'date_of_payment') {
                        return (
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            label="Date of Payment"
                            selected={
                              values[field]
                                ? new Date(values[field])
                                : new Date()
                            }
                            onChange={(date) =>
                              setFieldValue(
                                field,
                                moment(date).format('YYYY/MM/DD')
                              )
                            }
                          />
                        );
                      }
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
                          disabled={isFieldDisabled(field)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      );
                    })}
                </section>
                <h5 className="font-bold text-primary border-b py-1">
                  Admin Section
                </h5>
                <section className="grid grid-cols-1 gap-4 gap-y-8  md:grid-cols-2">
                  {Object.keys(values)
                    .filter((_fileld) => adminFields.includes(_fileld))
                    .map((field, index) => {
                      if (['admin_messages', 'admin_notes'].includes(field)) {
                        return (
                          <TextArea
                            key={index}
                            label={
                              field === 'admin_messages'
                                ? 'Admin messages for employees'
                                : field.replace('_', ' ')
                            }
                            name={field}
                            placeholder={field}
                            containerClass={
                              field === 'admin_notes' && !is_admin
                                ? 'hidden'
                                : ''
                            }
                            labelPlacement="outside"
                            maxRows={8}
                            disabled={isFieldDisabled(field)}
                            //@ts-ignore
                            value={values?.[field]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        );
                      } else if (
                        ['approval_status', 'course_status'].includes(field)
                      ) {
                        return (
                          <Menu
                            containerClass="relative"
                            //@ts-ignore
                            label={field.replaceAll('_', ' ')}
                            //@ts-ignore
                            options={mapDropDownOptions?.[field] || []}
                            onSelectItem={({ value }) =>
                              setFieldValue(field, value)
                            }
                            menuClass="w-full"
                            disabled={isFieldDisabled(field)}
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
                      } else if (field === 'staff_assigned_full_name') {
                        return (
                          <AsyncSelect
                            //@ts-ignore
                            loadOptions={loadOptions}
                            isDisabled={!is_admin}
                            //@ts-ignore
                            label={field.replaceAll('_', ' ')}
                            additional={{ page: 1 }}
                            value={{
                              label: values?.[field],
                              //@ts-ignore
                              value: values?.['staff_assigned'],
                            }}
                            onChange={(e) => {
                              setFieldValue('staff_assigned', e?.value);
                              setFieldValue(
                                'staff_assigned_full_name',
                                e?.label
                              );
                            }}
                          />
                        );
                      }
                      return (
                        <Input
                          key={index}
                          //@ts-ignore
                          label={field.replaceAll('_', ' ')}
                          name={field}
                          placeholder={field}
                          //@ts-ignore
                          containerClass={
                            !is_admin && isFieldViewable(field) && 'hidden'
                          }
                          labelPlacement="outside"
                          //@ts-ignore
                          isInvalid={touched?.[field] && !!errors?.[field]}
                          //@ts-ignore
                          value={values?.[field]}
                          disabled={isFieldDisabled(field)}
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
                          ...adminFields,
                          'id',
                          'staff_assigned',
                          'admitted_by',
                          'student_response',
                          'payments',
                          ...(values?.course !== 'Bsc Nursing'
                            ? ['KEA_id', 'password']
                            : ''),
                        ].includes(_fileld)
                    )
                    .map((field, index) => {
                      if (
                        [
                          'status',
                          'gender',
                          'blood_group',
                          'course_status',
                        ].includes(field)
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
                            containerClass="relative"
                            disabled={isFieldDisabled(field)}
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
                      } else if (field === 'date_of_admission') {
                        return (
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            label="Date of Admission"
                            selected={
                              //@ts-ignore
                              values?.[field]
                                ? //@ts-ignore
                                  new Date(values?.[field])
                                : new Date()
                            }
                            onChange={(date) =>
                              setFieldValue(
                                field,
                                moment(date).format('YYYY/MM/DD')
                              )
                            }
                            maxDate={new Date()}
                            disabled={data?.approval_status === 'approved'}
                          />
                        );
                      }
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
                          disabled={isFieldDisabled(field)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      );
                    })}
                </section>

                {!location.state?.is_admitted && (
                  <FieldArray
                    name="student_response"
                    render={(arrayHelpers) => (
                      <>
                        <h5 className="font-bold text-primary border-b py-1">
                          Student Response
                        </h5>
                        <div>
                          <button
                            type="button"
                            className="text-primary text-base py-1 flex gap-2 items-center"
                            onClick={() => arrayHelpers.push('')}
                          >
                            Add new response {GetIcons('add')}
                          </button>

                          <section className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2">
                            {values?.['student_response']?.map(
                              (calls: string, _ind: number) => (
                                <div className="flex gap-2 w-full" key={_ind}>
                                  <TextArea
                                    key={_ind}
                                    label={`calls ${_ind + 1}`}
                                    name={`student_response.${_ind}`}
                                    labelPlacement="outside"
                                    maxRows={3}
                                    disabled={isFieldDisabled(
                                      'student_response'
                                    )}
                                    value={calls}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    containerClass="w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(_ind)}
                                  >
                                    {GetIcons('delete')}
                                  </button>
                                </div>
                              )
                            )}
                          </section>
                        </div>
                      </>
                    )}
                  ></FieldArray>
                )}
                {location.state?.is_admitted && (
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
                            <label
                              key={index}
                              htmlFor={field}
                              className="capitalize"
                            >
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
                              disabled={isFieldDisabled(field)}
                            />
                          </div>
                        ))}
                    </section>
                  </>
                )}
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
        </AccordionItem>
        {location?.state?.is_admitted && (
          <AccordionItem
            key={1}
            aria-label={'payment_info'}
            title={'Payment Info'}
            className=" flex flex-col"
            classNames={{ content: '', base: 'wy__' }}
          >
            <>
              <section className="grid grid-cols-1 gap-4 gap-y-8 md:grid-cols-2 flex-1 !overflow-auto py-2 pr-2">
                {paymentsList?.map((item, index) => (
                  <Formik
                    key={index}
                    initialValues={{
                      ...item,
                    }}
                    //@ts-ignore
                    onSubmit={handlePayments}
                    validationSchema={PaymentDetailsSchema}
                    enableReinitialize={true}
                  >
                    {({
                      values,
                      touched,
                      errors,
                      setFieldValue,
                      handleBlur,
                      handleChange,
                    }) => (
                      <Form className="border-2 rounded-lg p-3 border-[#d8dada] flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h5 className="text-sm font-bold mb-3">
                            New Installment
                          </h5>

                          <div className="flex gap-2 items-center">
                            <Button
                              label="Save"
                              type="submit"
                              color="success"
                              className="h-8 text-white text-xs"
                            />
                            {values?.isNew ? (
                              <span
                                className="cursor-pointer rounded-full h-8 w-8 border border-black flex justify-center items-center"
                                onClick={() =>
                                  setPaymentsList((cv) =>
                                    cv.filter((_v, i) => i !== index)
                                  )
                                }
                              >
                                {GetIcons('delete')}
                              </span>
                            ) : (
                              <CheckBox
                                onChange={(e) => {
                                  setSelectedPayments((cv) =>
                                    e.target.checked
                                      ? [...cv, values.id]
                                      : cv.filter((id) => id !== values.id)
                                  );
                                }}
                                isSelected={selectedPayments.includes(
                                  values.id
                                )}
                              />
                            )}
                          </div>
                        </div>
                        <AsyncSelect
                          label={'Account Details'}
                          loadOptions={loadAccountOptions}
                          value={{
                            label: values?.account_details,
                            value: values?.account_details,
                          }}
                          onChange={(e) =>
                            setFieldValue('account_details', e?.label)
                          }
                          isInvalid={
                            touched?.account_details &&
                            !!errors?.account_details
                          }
                          showError={true}
                          errorText={errors?.account_details}
                        />

                        <Input
                          label={'Amount from students'}
                          name={`amount_received_from_student`}
                          placeholder={`Enter here`}
                          labelPlacement="outside"
                          isInvalid={
                            touched?.amount_received_from_student &&
                            !!errors?.amount_received_from_student
                          }
                          errorText={errors.amount_received_from_student}
                          value={values.amount_received_from_student}
                          disabled={data?.approval_status === 'approved'}
                          onChange={(e) =>
                            /^(\d+(\.\d*)?|\.\d+)?$/.test(e.target.value) &&
                            handleChange(e)
                          }
                          onBlur={handleBlur}
                        />

                        <Input
                          label={`Amount to college`}
                          name={`amount_paid_to_college`}
                          placeholder={`Enter here`}
                          labelPlacement="outside"
                          isInvalid={
                            touched?.amount_paid_to_college &&
                            !!errors?.amount_paid_to_college
                          }
                          value={values.amount_paid_to_college}
                          disabled={data?.approval_status === 'approved'}
                          errorText={errors.amount_paid_to_college}
                          onChange={(e) =>
                            /^(\d+(\.\d*)?|\.\d+)?$/.test(e.target.value) &&
                            handleChange(e)
                          }
                          onBlur={handleBlur}
                        />
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          label="Date of Payment"
                          selected={
                            values?.date_of_payment
                              ? new Date(values?.date_of_payment)
                              : new Date()
                          }
                          onChange={(date) =>
                            setFieldValue(
                              `date_of_payment`,
                              moment(date).format('YYYY/MM/DD')
                            )
                          }
                          maxDate={new Date()}
                          disabled={data?.approval_status === 'approved'}
                        />
                        <TextArea
                          label={'Remark'}
                          name={`remarks`}
                          labelPlacement="outside"
                          maxRows={3}
                          value={values.remarks}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={data?.approval_status === 'approved'}
                        />
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor={'screenshot'}
                            className="capitalize text-small"
                          >
                            Screenshot of payment
                          </label>

                          {values?.payment_screenshot &&
                            typeof values?.payment_screenshot === 'string' && (
                              <a
                                href={`${import.meta.env.VITE_BASE_URL}/${values?.['payment_screenshot']}`}
                                target="_blank"
                                className="text-blue-600"
                              >
                                Click to view
                              </a>
                            )}
                          <input
                            type="file"
                            name={'payment_screenshot'}
                            id={'payment_screenshot'}
                            className="font-medium p-2 border-1 rounded-lg cursor-pointer text-primary flex gap-2 items-center"
                            accept={'.jpg,.jpeg,.pdf,.jpg,.jpeg,.png'}
                            onChange={(e) =>
                              handleFileUpload(
                                e,
                                `payment_screenshot`,
                                setFieldValue
                              )
                            }
                            onBlur={handleBlur}
                            disabled={data?.approval_status === 'approved'}
                          />
                        </div>
                      </Form>
                    )}
                  </Formik>
                ))}
              </section>
              <div className="flex mt-2 gap-2 items-center">
                {!!selectedPayments.length && (
                  <Button
                    type="button"
                    color="danger"
                    label="Delete"
                    onClick={handlePaymentDelete}
                    className="text-white text-small py-1 flex gap-2 items-center mb-2"
                  />
                )}
                <Button
                  type="button"
                  disabled={data?.approval_status === 'approved'}
                  className="text-primary border-2 bg-white border-primary text-small py-1 flex gap-2 items-center mb-2"
                  onClick={() =>
                    //@ts-ignore
                    setPaymentsList((cv) => [
                      ...cv,
                      {
                        account_details: '',
                        amount_paid_to_college: 0,
                        amount_received_from_student: 0,
                        date_of_payment: moment().format('YYYY/MM/DD'),
                        id: 0,
                        payment_screenshot: '',
                        remarks: '',
                        isNew: true,
                      },
                    ])
                  }
                  //@ts-ignore
                  label={
                    <div className="flex gap-2 items-center">
                      {GetIcons('add')} Add New Installment
                    </div>
                  }
                />
              </div>
            </>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default EditStudent;
