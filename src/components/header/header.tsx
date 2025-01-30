import GetIcons from '@/assets/icons';
import Menu from '@/components/dropdown';
import PATH from '@/routes/paths';
import useStore from '@/store/store';
import { headerMenuOptions } from '@/utils/constants';
import { Avatar } from '@nextui-org/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button';
import Modals from '../../modals';
export const Header: React.FC<{
  showToggleBtn?: boolean;
  toggleNav?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showToggleBtn = true, toggleNav }) => {
  const { userDetails } = useStore((state) => state);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAction = (action: TOption) => {
    if (action.label === 'Logout') {
      localStorage.clear();
      window.location.reload();
    } else if (action.label === 'Settings') {
      navigate(PATH.settings);
    }
    return;
  };

  return (
    <Fragment>
      <header className="sticky top-0 z-50 flex h-[64px] w-full justify-between bg-white p-3">
        {showToggleBtn && (
          <button
            type="button"
            className="lg:invisible mr-4"
            onClick={() => toggleNav && toggleNav((cv) => !cv)}
          >
            {GetIcons('menu')}
          </button>
        )}
        {userDetails?.is_employee && (
          <Button
            label={'Attendence'}
            color={'warning'}
            onClick={() => setShowModal(true)}
          />
        )}
        <div className="ml-auto inline-flex gap-1">
          <span
            className="flex-shrink-0 cursor-pointer bg-default p-1 rounded-full h-10 w-10"
            onClick={() => navigate(PATH.students)}
          >
            {GetIcons('home')}
          </span>
          {!userDetails?.is_agent && (
            <span
              className="flex-shrink-0 cursor-pointer bg-default p-1 rounded-full h-10 w-10"
              onClick={() => navigate(PATH.notifications)}
            >
              {GetIcons('Notification')}
            </span>
          )}
          <Avatar classNames={{ base: 'block shrink-0 hidden lg:block' }} />
          <Menu
            title={userDetails?.first_name + ' ' + userDetails?.last_name}
            showLabel={false}
            isKebabMenu={screenSize.width <= 768}
            menuClass="!min-w-fit"
            options={headerMenuOptions}
            onSelectItem={handleAction}
            containerClass="relative"
          />
        </div>
      </header>
      <Modals.AttendenceModal isOpen={showModal} setOpen={setShowModal} />
    </Fragment>
  );
};
export default Header;
