import GetIcons from '@/assets/icons';
import Header from '@/components/header';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import { Outlet, useLocation } from 'react-router-dom';

const LayoutWithoutNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex flex-col gap-1 h-full w-full overflow-hidden slideIn">
      <Header showToggleBtn={false} />
      {path.length > 1 && (
        <div className="flex items-center gap-2 px-3 ">
          <button
            className="p-1 bg-white rounded-lg"
            onClick={() => window.history.back()}
          >
            {GetIcons('backArrow')}
          </button>
          <Breadcrumbs isDisabled>
            {path?.map((path: string, index: number) => (
              <BreadcrumbItem className="capitalize" key={index}>
                {path}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        </div>
      )}
      <div className="flex-1 w-full mx-auto h-full px-2 pb-2 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutWithoutNav;
