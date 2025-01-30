import Button from '@/components/button';
import Menu from '@/components/dropdown';
import Input from '@/components/input';
import { tableHeaderOptions } from '@/utils/constants';
import React, { memo } from 'react';
import { TableHeaderProps } from '.';
import Filter from '../filter';
import GetIcons from '@/assets/icons';

const TableHeader: React.FC<TableHeaderProps> = ({
  btnLabel = '',
  showBtn = true,
  isSearchable = false,
  showFilter = false,
  showActions = false,
  isBtnDisabled = false,
  searchValue = '',
  extraComponents,
  placeholder,
  setSearchValue,
  onBtnClick,
  handleHeaderAction,
  ...rest
}) => {
  return (
    <div className="bg-white rounded-[14px] p-2 flex items-center justify-between h-14 ">
      {isSearchable && (
        <Input
          placeholder={placeholder || 'Search Here'}
          className="w-auto md:w-60 h-10"
          showError={false}
          showClear={true}
          value={searchValue}
          onChange={(e) => setSearchValue && setSearchValue(e.target.value)}
        />
      )}
      <div className="flex items-center gap-2 ml-auto">
        {extraComponents}
        {/* @ts-ignore */}
        {showFilter && <Filter {...rest} />}
        {showBtn && (
          <Button
            //@ts-ignore
            label={
              <>
                <span className="hidden md:block">{btnLabel}</span>
                <span className="md:hidden">{GetIcons('plus')}</span>
              </>
            }
            color="primary"
            onClick={(e) => !isBtnDisabled && onBtnClick && onBtnClick(e)}
            isDisabled={isBtnDisabled}
          />
        )}
        {showActions && (
          <Menu
            title={'Actions'}
            showLabel={false}
            menuClass="!w-fit"
            //@ts-ignore
            options={tableHeaderOptions}
            isKebabMenu={true}
            containerClass="!w-fit relative"
            //@ts-ignore
            onSelectItem={handleHeaderAction}
          />
        )}
      </div>
    </div>
  );
};

export default memo(TableHeader);
