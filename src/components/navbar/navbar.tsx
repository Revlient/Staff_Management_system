import GetIcons from '@/assets/icons';
import Logo from '@/assets/images/LOGO_OG.jpg';
import useAuthContext from '@/context/index';
import { navItems } from '@/utils/constants';
import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export const Navbar: React.FC<{
  showNav: boolean;
  toggleNav: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showNav, toggleNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuthContext();

  return (
    <aside
      className={`fixed ${!showNav && '-ml-64'} lg:ml-0 sidebar inset-y-0 left-0 bg-primary text-white w-64`}
    >
      <div className="flex items-center justify-between py-1 px-3">
        <img src={Logo} alt="Logo" className="h-[70px]" />
        <button
          type="button"
          className="lg:hidden"
          onClick={() => toggleNav((cv) => !cv)}
        >
          {GetIcons('close')}
        </button>
      </div>
      <nav className="flex flex-col gap-2 py-8 px-6 space-y-2 text-white">
        {navItems
          .filter(
            (_item) =>
              isAdmin ||
              !['employees', 'agents', 'dashboard', 'attendence-list'].includes(
                _item
              )
          )
          .map((item, index: number) => (
            <span
              className={`px-2 py-1 flex gap-4 items-center text-[#e2e8ee] capitalize cursor-pointer ${item === location.pathname.split('/').filter(Boolean)[0] && 'bg-[#4a5d67] rounded-lg'}`}
              key={index}
              onClick={() => {
                navigate(`/${item}`);
              }}
            >
              {/*@ts-ignore  */}
              {GetIcons(item)} <span>{item.replaceAll('-', ' ')}</span>
            </span>
          ))}
      </nav>
    </aside>
  );
};
export default memo(Navbar);
