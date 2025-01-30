import Button from '@/components/button';
import Input from '@/components/input';
import {
  GetLocationDetails,
  SetLocationDetails,
} from '@/services/setttingsService';
import { notify } from '@/utils/helpers/helpers';
import { LocationValidationSchema } from '@/utils/validationSchemas';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import Menu from '../dropdown';

const LocationBox: React.FC = () => {
  const [initialValue, setInitialValue] = useState<{
    locations: ILocationDetails[];
  }>({
    locations: [
      {
        office_name: '',
        center_latitude: null,
        center_longitude: null,
        radius: null,
      },
    ],
  });
  /******************************REACT-HOOKS******************************************* */

  useEffect(() => {
    getLocationData();
  }, []);

  /******************************SERVICE CALLS******************************************* */
  const getLocationData = () => {
    GetLocationDetails()
      .then((data) => {
        data?.length && setInitialValue({ locations: data });
      })
      .catch(() => notify('Error fetching data', { type: 'error' }));
  };

  const handleFormSubmit = async (
    values: { locations: ILocationDetails[] },
    actions: FormikHelpers<{ locations: ILocationDetails[] }>
  ) => {
    try {
      const resp = await SetLocationDetails(values.locations);
      notify(resp.message, { type: 'success' });
    } catch (error) {
    } finally {
      actions.setSubmitting(false);
    }
  };

  const findCurrentLocation = (
    setValues: FormikHelpers<{ locations: ILocationDetails[] }>['setValues'],
    index: number
  ) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //@ts-ignore
          setValues((cv) => {
            return {
              locations: cv.locations.map((v, i) =>
                i === index
                  ? {
                      ...cv,
                      center_latitude: latitude,
                      center_longitude: longitude,
                    }
                  : v
              ),
            };
          });
        },
        (err) => {
          notify('Unable to retrieve location. ' + err.message, {
            type: 'error',
          });
        }
      );
    } else {
      notify('Geolocation is not supported by this browser. Please type', {
        type: 'error',
      });
    }
  };

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={handleFormSubmit}
      enableReinitialize={true}
      validationSchema={LocationValidationSchema}
    >
      {({
        values,
        touched,
        errors,
        isSubmitting,
        resetForm,
        handleChange,
        handleBlur,
        setValues,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h3 className="text-red-500">
            Please enter your office location information. Note that attendance
            recorded in this area will be accepted. If you have trouble locating
            it, please click the button.
          </h3>
          <FieldArray
            name="locations"
            render={({ push, remove }) => (
              <>
                <Button
                  label="Add Location"
                  type="button"
                  color="primary"
                  className="w-fit text-white font-medium ml-auto"
                  onClick={() =>
                    push({
                      center_latitude: null,
                      center_longitude: null,
                      radius: null,
                    })
                  }
                />
                {values?.locations?.map((loc, index) => (
                  <div key={index} className="border rounded-lg p-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        label="Find Location"
                        type="button"
                        className="w-fit border block border-danger font-medium bg-transparent text-danger"
                        onPress={() => findCurrentLocation(setValues, index)}
                      />
                      <Menu
                        showLabel={false}
                        menuClass="!w-fit"
                        options={[{ label: 'Delete', value: 'delete' }]}
                        isKebabMenu={true}
                        containerClass="!w-fit relative"
                        onSelectItem={() => remove(index)}
                      />
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      <Input
                        label="Office Location*"
                        placeholder="type here"
                        name={`locations.${index}.office_name`}
                        labelPlacement="outside"
                        //@ts-ignore
                        value={loc?.office_name}
                        isInvalid={
                          touched?.locations?.[index]?.office_name &&
                          //@ts-ignore
                          !!errors?.locations?.[index]?.office_name
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        type="number"
                        label="Latitude*"
                        placeholder="type here"
                        name={`locations.${index}.center_latitude`}
                        labelPlacement="outside"
                        //@ts-ignore
                        value={loc?.center_latitude}
                        isInvalid={
                          touched?.locations?.[index]?.center_latitude &&
                          //@ts-ignore
                          !!errors?.locations?.[index]?.center_latitude
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Input
                        type="number"
                        label="Longitude*"
                        placeholder="type here"
                        labelPlacement="outside"
                        //@ts-ignore
                        value={loc?.center_longitude}
                        name={`locations.${index}.center_longitude`}
                        isInvalid={
                          touched?.locations?.[index]?.center_longitude &&
                          //@ts-ignore
                          !!errors?.locations?.[index]?.center_longitude
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <Input
                        type="number"
                        label="Radius in meters*"
                        placeholder="type here"
                        labelPlacement="outside"
                        name={`locations.${index}.radius`}
                        isInvalid={
                          touched?.locations?.[index]?.radius &&
                          //@ts-ignore
                          !!errors?.locations?.[index]?.radius
                        }
                        //@ts-ignore
                        value={loc?.radius}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          />

          <footer className="flex items-center gap-3 col-span-2">
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
          </footer>
        </Form>
      )}
    </Formik>
  );
};

export default LocationBox;
