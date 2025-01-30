import GetIcons from '@/assets/icons';
import React, { useEffect, useRef, useState } from 'react';
import { MenuProps } from '.';

const Menu: React.FC<MenuProps> = ({
  title,
  options,
  label,
  selectedItem,
  isSelectable = false,
  showLabel = true,
  containerClass,
  menuClass,
  isInvalid,
  isKebabMenu = false,
  disabled = false,
  onSelectItem,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`w-full ${containerClass}`} ref={menuRef}>
      {showLabel && <span className="mb-2 block text-small">{label}</span>}
      <button
        className={`flex text-small h-10 w-full items-center justify-between rounded-xl  px-3 ${isInvalid ? 'bg-danger-50' : 'bg-default-100'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} `}
        onClick={(e) => {
          e.stopPropagation();
          !disabled && setShowMenu((cv) => !cv);
        }}
        type="button"
        disabled={disabled}
      >
        {isKebabMenu
          ? GetIcons('kebabIcon')
          : isSelectable
            ? selectedItem
            : title}
        {!isKebabMenu && (
          <span
            className={`${showMenu && 'rotate-180'} ml-auto transition-transform ease-out duration-500`}
          >
            {GetIcons('downArrow')}
          </span>
        )}
      </button>

      <ul
        aria-label="Static Actions"
        className={`absolute text-small h-auto overflow-auto mt-1 subpixel-antialiased bg-white z-30 shadow-main rounded-lg px-4 py-2 w-full right-0 flex-col gap-1 transform transition-all duration-500 ease-in-out ${
          showMenu ? 'flex scale-100 max-h-60' : 'hidden scale-95 max-h-0'
        } ${menuClass}`}
        style={{
          transformOrigin: 'top',
        }}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(option);
              setShowMenu(false);
            }}
            className="text-nowrap cursor-pointer"
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
