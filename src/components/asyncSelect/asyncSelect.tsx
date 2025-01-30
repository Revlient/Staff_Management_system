import GetIcons from '@/assets/icons';
import { ReactElement, useRef } from 'react';
import { GroupBase } from 'react-select';
import type {
  ComponentProps,
  UseAsyncPaginateParams,
} from 'react-select-async-paginate';
import {
  AsyncPaginate,
  AsyncPaginateProps,
  withAsyncPaginate,
} from 'react-select-async-paginate';
import type { CreatableProps } from 'react-select/creatable';
import Creatable from 'react-select/creatable';

interface AsyncSelectProps
  extends AsyncPaginateProps<
    OptionType,
    GroupBase<OptionType>,
    unknown,
    false
  > {
  label: string;
  showError?: boolean;
  isInvalid?: boolean;
  errorText?: string;
  isCreatable?: boolean;
}

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean,
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => ReactElement;

const AsyncSelect: React.FC<AsyncSelectProps> = ({
  label,
  showError,
  isInvalid,
  errorText,
  isCreatable = false,
  ...props
}) => {
  const selectRef = useRef(null);
  const CreatableAsyncPaginate = withAsyncPaginate(
    Creatable
  ) as AsyncPaginateCreatableType;

  const ComponentToRender = isCreatable
    ? CreatableAsyncPaginate
    : AsyncPaginate;

  const clearTypedValue = () => {
    if (selectRef.current) {
      //@ts-ignore
      selectRef?.current?.setState({ inputValue: '' });
    }
  };
  return (
    <div className="relative">
      <label htmlFor={props.id} className="capitalize mb-[5px] block text-sm">
        {label}
      </label>
      <ComponentToRender
        {...props}
        selectRef={selectRef}
        classNames={{
          menu: () => '!z-50 !text-small',
          control: () =>
            `!border-0 !rounded-lg !shadow-none  ${isInvalid ? '!bg-red-100' : '!bg-default-100'} text-small !rounded-xl ${props.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} `,
          placeholder: () => '!text-base',
        }}
        debounceTimeout={300}
      />
      {/*@ts-ignore */}

      <span
        className="absolute top-[33px] right-11 cursor-pointer"
        onClick={clearTypedValue}
      >
        {GetIcons('close', { fill: '#807573' })}
      </span>

      {showError && (
        <div className="text-xs text-danger h-4 px-2">
          {isInvalid ? errorText : ''}
        </div>
      )}
    </div>
  );
};

export default AsyncSelect;
