import AsyncSelect from '@/components/asyncSelect';
import Button from '@/components/button';
import Input from '@/components/input';
import TextArea from '@/components/textArea';
import {
  GetCourseDetails,
  ListCourses,
  RegisterCollege,
  UpdateCollege,
} from '@/services/collegeService';
import useStore from '@/store/store';
import { notify } from '@/utils/helpers/helpers';
import { CollegeSchema } from '@/utils/validationSchemas';
import { Formik, FormikHelpers } from 'formik';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * @namespace {AddCollege}
 * @description renders add course-college form
 * @returns {React.JSX.Element}
 */
const AddCollege: React.FC = (): React.JSX.Element => {
  /****************************REACT-HOOKS*************************************************** */
  const { courseDetails, setCourseDetails } = useStore();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      GetCourseDetails(params.id).then((data) => {
        setCourseDetails(data);
      });
    }
    return () =>
      setCourseDetails({
        college_name: '',
        course_name: [],
        college_location: '',
        course_description: '',
        brochure: null,
      });
  }, [params]);

  /****************************SERVICE-CALLS*************************************************** */

  /**
   * @function handleEmployeeRegister
   * @description submit form
   * @param values
   */
  const handleCollegeRegister = async (
    values: IAddCollege,
    actions: FormikHelpers<IAddCollege>
  ) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'brochure' && values[key] === null) return;
      else if (key === 'course_name') {
        values.course_name.forEach((course) =>
          formData.append('course_name', course)
        );
      } else {
        //@ts-ignore
        formData.append(key, values?.[key]);
      }
    });

    const fun = params?.id ? UpdateCollege : RegisterCollege;
    try {
      //@ts-ignore
      const data = await fun(formData, params?.id);
      notify(data.message, { type: 'success' });
      params?.id ? setCourseDetails(values) : actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  };

  /****************************CUSTOM-METHODS*************************************************** */

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<any>['setFieldValue']
  ) => {
    // const max_limit = 5 * 1024 * 1024;

    //@ts-ignore
    // if (e?.target?.files?.[0]?.size > max_limit) {
    //   alert('File size exceeded');
    //   e.target.value = '';
    //   return;
    // }
    setFieldValue('brochure', e?.target?.files?.[0]);
  };

  const loadOptions = async (search: string) => {
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

  return (
    <div className="h-full w-full flex flex-col gap-4 rounded-lg bg-white p-2 slideIn overflow-auto">
      <Formik
        initialValues={courseDetails}
        onSubmit={handleCollegeRegister}
        validationSchema={CollegeSchema}
        enableReinitialize
      >
        {({
          dirty,
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
            className="grid lg:grid-cols-2 grid-col-1 gap-4 gap-y-8 p-4"
            onSubmit={handleSubmit}
          >
            <Input
              label="College Name*"
              name="college_name"
              placeholder="College Name"
              labelPlacement="outside"
              isDisabled={!!params?.id}
              isInvalid={touched.college_name && !!errors.college_name}
              value={values.college_name}
              onChange={(e) =>
                setFieldValue(
                  'college_name',
                  e.target.value
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ')
                )
              }
              onBlur={handleBlur}
            />

            <AsyncSelect
              label="Course Name*"
              loadOptions={loadOptions}
              isDisabled={!!params?.id}
              isCreatable={true}
              //@ts-ignore
              isMulti={true}
              //@ts-ignore
              value={values.course_name.map((c) => ({ label: c, value: c }))}
              onChange={(e) =>
                setFieldValue(
                  'course_name',
                  //@ts-ignore
                  e?.map((course: OptionType) =>
                    course.value
                      ?.split(' ')
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ')
                  )
                )
              }
            />

            <Input
              label="College Location*"
              name="college_location"
              labelPlacement="outside"
              placeholder="college_location"
              isInvalid={touched.college_location && !!errors.college_location}
              value={values.college_location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextArea
              label="Course Description"
              name="course_description"
              placeholder="Course Description"
              labelPlacement="outside"
              isInvalid={
                touched.course_description && !!errors.course_description
              }
              value={values.course_description}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className="w-full">
              <label htmlFor={'brochure'} className="capitalize">
                Brochure
              </label>
              <input
                type="file"
                name={'brochure'}
                id={'brochure'}
                className="font-medium p-2 border-1 rounded-lg cursor-pointer text-primary flex gap-2 items-center w-full"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, setFieldValue)}
                onBlur={handleBlur}
              />
            </div>

            <div className="flex items-center gap-3 col-span-1 lg:col-span-2">
              <Button
                label="Discard"
                color="danger"
                type="button"
                disabled={!dirty}
                onClick={() => resetForm({ values: courseDetails })}
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

export default AddCollege;
