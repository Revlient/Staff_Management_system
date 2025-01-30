import { ChangePassword } from '@/services/setttingsService';
import { notify } from '@/utils/helpers/helpers';
import {
  EmailValidationSchema,
  ResetPasswordSchema,
} from '@/utils/validationSchemas';
import { Formik, FormikHelpers } from 'formik';
import React, { Fragment, useState } from 'react';
import Button from '../button';
import Input from '../input';

const PasswordResetBox: React.FC<{
  api: (values: { email: '' }) => Promise<any>;
}> = ({ api }) => {
  const [formAction, setFormAction] = useState<number>(1);

  const handleResetPassword = async (
    values: TResetPassword,
    actions: FormikHelpers<TResetPassword>
  ) => {
    try {
      const resp = await ChangePassword(values);
      notify(resp.message, { type: 'success' });
    } finally {
      actions.setSubmitting(false);
      actions.resetForm();
      setFormAction(1);
    }
  };
  const handleSendOTP = async (
    values: { email: '' },
    actions: FormikHelpers<{ email: '' }>
  ) => {
    try {
      const resp = await api(values);
      notify(resp.message, { type: 'success' });
      setFormAction(2);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Fragment>
      {formAction === 1 ? (
        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleSendOTP}
          enableReinitialize={true}
          validationSchema={EmailValidationSchema}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            handleSubmit,
            handleChange,
            handleBlur,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex w-auto max-w-[500px] gap-3 items-center"
            >
              <Input
                label="Email*"
                type="email"
                placeholder="type here"
                name="email"
                labelPlacement="outside"
                value={values.email}
                errorText={errors.email}
                isInvalid={touched.email && !!errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Button
                label="Send OTP"
                type="submit"
                color="primary"
                className="w-fit text-white font-medium ml-auto"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            new_password: '',
            confirm_password: '',
            otp: '',
          }}
          onSubmit={handleResetPassword}
          enableReinitialize={true}
          validationSchema={ResetPasswordSchema}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            resetForm,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <ul className="text-gray-500 text-sm list-disc mx-4 mb-5">
                <li>Password must be at least 8 characters long.</li>
                <li>Password should contain atleast 1 capital letter.</li>
                <li>Password should contain minimum 1 small letter.</li>
                <li>Password should contain minimum 1 special character.</li>
              </ul>
              <p className="text-red-600 text-sm">
                OTP has been send to your email
              </p>

              <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
                <Input
                  label="New Password*"
                  type="password"
                  placeholder="type here"
                  name="new_password"
                  labelPlacement="outside"
                  errorText={errors.new_password}
                  showEye={true}
                  //@ts-ignore
                  value={values.new_password}
                  isInvalid={touched.new_password && !!errors.new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Input
                  label="Confirm Password*"
                  placeholder="type here"
                  type="password"
                  name="confirm_password"
                  labelPlacement="outside"
                  showEye={true}
                  errorText={errors.confirm_password}
                  //@ts-ignore
                  value={values.confirm_password}
                  isInvalid={
                    touched.confirm_password && !!errors.confirm_password
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <Input
                  label="OTP"
                  placeholder="type here"
                  name="otp"
                  labelPlacement="outside"
                  errorText={errors.otp}
                  isInvalid={touched.otp && !!errors.otp}
                  //@ts-ignore
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <footer className="flex items-center gap-3 col-span-2">
                <Button
                  label="Back"
                  color="danger"
                  type="button"
                  onClick={() => {
                    resetForm();
                    setFormAction(1);
                  }}
                />
                <Button
                  label="Submit"
                  color="success"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </footer>
            </form>
          )}
        </Formik>
      )}
    </Fragment>
  );
};

export default PasswordResetBox;
