import { Checkbox, CheckboxProps } from '@nextui-org/react';

interface CheckBoxProps extends CheckboxProps {
  labelClass?: string;
}
const CheckBox: React.FC<CheckBoxProps> = ({
  children,
  labelClass,
  ...props
}) => {
  return (
    <Checkbox
      {...props}
      classNames={{ label: `font-Outfit text-sm ${labelClass}` }}
    >
      {children}
    </Checkbox>
  );
};
export default CheckBox;
