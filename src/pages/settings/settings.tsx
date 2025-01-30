import LocationBox from '@/components/locationInfo';
import PasswordResetBox from '@/components/PasswordResetBox';
import { ResetPassword } from '@/services/setttingsService';
import useStore from '@/store/store';
import { Accordion, AccordionItem } from '@nextui-org/react';
import React from 'react';
const Settings: React.FC = () => {
  const { userDetails } = useStore((state) => state);

  return (
    <section className="flex flex-col gap-2 h-full overflow-auto m-2">
      {/*@ts-ignore  */}
      <Accordion variant="bordered" className="bg-white">
        <AccordionItem
          aria-label={'profile'}
          title={<h4 className="text-lg font-bold">Profile Information</h4>}
        >
          <div className="py-3 flex flex-col gap-2">
            {Object.keys(userDetails)
              .filter((_v) => !['is_admin', 'is_employee', 'id'].includes(_v))
              .map((_key, _index) => (
                <div className="flex gap-2 text-base" key={_index}>
                  <span className="font-medium w-1/2 capitalize">
                    {/*@ts-ignore  */}
                    {_key.replaceAll('_', ' ')}
                  </span>{' '}
                  :
                  <span className="text-gray-400">
                    {userDetails[_key as keyof IUserDetails].toString()}
                  </span>
                </div>
              ))}
          </div>
        </AccordionItem>
        <AccordionItem
          aria-label={'security'}
          title={<h4 className="text-lg font-bold">Security</h4>}
        >
          <PasswordResetBox api={ResetPassword} />
        </AccordionItem>
        {userDetails?.is_admin && (
          <AccordionItem
            aria-label={'Office Location'}
            title={<h4 className="text-lg font-bold">Location</h4>}
          >
            <LocationBox />
          </AccordionItem>
        )}
      </Accordion>
    </section>
  );
};

export default Settings;
