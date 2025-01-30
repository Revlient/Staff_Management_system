import React, { InputHTMLAttributes, useEffect } from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import Dropdown from '../dropdown';
import Input from '../input';

/**
 * @description Create an array of objects with code as value and country name as label
 */
const countries: Array<TOption> = getCountries()
  .map((ele) => ({
    label: `${en[ele]} +${getCountryCallingCode(ele)}`,
    value: `+${getCountryCallingCode(ele)}`,
  }))
  .sort((a, b) => {
    if (a?.label > b.label) return 1;
    else return -1;
  });
/**
 * @namespace PhoneNumberInput
 * @param {propTypes}
 * @returns {React.JSX.Element}
 */

interface PhoneNumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  value: string;
  isInvalid: boolean | undefined;
  handleChange: (value: string, code: string) => void;
}
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  error,
  disabled,
  value,
  handleChange,
  ...rest
}) => {
  /***************************************************************
   *         ReactHooks
   * *************************************************************/
  const [country, setCountry] = React.useState<string>('+91');

  useEffect(() => {
    handleChange(country, country);
  }, [country]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      handleChange && handleChange(`${country}${inputValue}`, country);
    }
  };

  return (
    <div
      className={`flex flex-col justify-start ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {label && (
        <label
          className={`text-small capitalize ${rest.isInvalid ? 'text-danger' : ''}`}
        >
          {label}
        </label>
      )}
      <div className={`flex gap-2 relative w-full h-10 mt-1`}>
        <Dropdown
          options={countries}
          selectedItem={country}
          disabled={disabled}
          isSelectable={true}
          showLabel={false}
          containerClass="!w-20"
          isInvalid={rest.isInvalid}
          menuClass="w-fit left-0"
          //@ts-ignore
          onSelectItem={(option) => setCountry(option.value)}
        />

        {/* @ts-ignore */}
        <Input
          disabled={disabled}
          value={value.substring(country.length)}
          onChange={onChange}
          containerClass="flex-1"
          {...rest}
        />
      </div>
      <span aria-label="error" className="text-xs text-danger h-4 px-2 mt-1">
        {rest.isInvalid ? error : ''}
      </span>
    </div>
  );
};

export default PhoneNumberInput;
