import { HTMLAttributes } from 'react';

export { default } from './dropdown';
export interface MenuProps extends HTMLAttributes<HTMLInputElement> {
  title?: string;
  /**Make dropdown as a select component. default value-false */
  isSelectable?: boolean;
  selectedItem?: string;
  options: TOption[];
  showLabel?: boolean;
  label?: string;
  containerClass?: string;
  menuClass?: string;
  disabled?: boolean;
  isInvalid?: boolean | undefined;
  isKebabMenu?: boolean;
  onSelectItem: (item: TOption) => void;
}
