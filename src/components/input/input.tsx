import GetIcons from '@/assets/icons';
import { EyeFilledIcon } from '@/assets/icons/_eyeFilledIcon';
import { EyeSlashFilledIcon } from '@/assets/icons/_eyeSlashFilledIcon';
import { InputProps, Input as InputComp } from '@nextui-org/react';
import React from 'react';

interface InputComponentProps extends InputProps {
  showError?: boolean;
  errorText?: string | undefined;
  containerClass?: string;
  showEye?: boolean;
  showClear?: boolean;
}
const Input: React.FC<InputComponentProps> = ({
  isInvalid,
  errorText,
  type = 'text',
  showEye = false,
  showError = true,
  showClear = false,
  containerClass,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={`flex flex-col gap-1 relative ${containerClass}`}>
      <InputComp
        className={`h-10 ${props.className}`}
        isInvalid={isInvalid}
        classNames={{
          label: 'capitalize',
          input: props.disabled ? '!cursor-not-allowed' : 'cursor-pointer',
        }}
        endContent={
          showEye ? (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          ) : showClear && props.value?.length ? (
            <span
              className="mt-1 cursor-pointer"
              //@ts-ignore
              onClick={() => props.onChange({ target: { value: '' } })}
            >
              {GetIcons('close', { fill: '#807573' })}
            </span>
          ) : null
        }
        type={isVisible ? 'text' : type}
        {...props}
      />

      {showError && (
        <div className="text-xs text-danger h-4 px-2">
          {isInvalid ? errorText : ''}
        </div>
      )}
    </div>
  );
};

export default Input;
