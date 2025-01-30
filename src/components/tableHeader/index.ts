import { FilterProps } from '@/components/filter';
export { default } from './tableHeader';
export interface TableHeaderProps extends Partial<FilterProps> {
  btnLabel?: string;
  showBtn?: boolean;
  showFilter?: boolean;
  isSearchable?: boolean;
  showActions?: boolean;
  isBtnDisabled?: boolean;
  searchValue?: string;
  placeholder?: string;
  extraComponents?: React.ReactNode;
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  handleHeaderAction?: (action: TOption) => void;
  onBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
}
