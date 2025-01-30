import {
  ButtonProps as BaseButtonProps,
  Button as ButtonComp,
} from '@nextui-org/react';
import React from 'react';
interface ButtonProps extends BaseButtonProps {
  label: string;
}
const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return (
    <ButtonComp
      className={`font-medium text-white h-9 rounded-[20px] px-5 ${rest.className}`}
      {...rest}
    >
      {label}
    </ButtonComp>
  );
};

export default Button;
