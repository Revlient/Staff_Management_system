import Button from '@/components/button';
import useCurrentLocation from '@/hooks/useLocation';
import { CheckInApi, CheckOutApi } from '@/services/setttingsService';
import useStore from '@/store/store';
import { notify } from '@/utils/helpers/helpers';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';

export interface AttendenceModalProps {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
}

const AttendenceModal: React.FC<AttendenceModalProps> = ({
  isOpen,
  setOpen,
}) => {
  const { location, error } = useCurrentLocation();
  const { userDetails, setUserDetails } = useStore((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmployeeCheckIn = (action: 'in' | 'out') => {
    if (error || !location.latitude || !location.longitude) {
      notify(error || 'Make sure location is turned ON or try again later', {
        type: 'error',
      });
    } else {
      setIsLoading(true);
      if (action === 'in') {
        CheckInApi({
          location: `${location.latitude} , ${location.longitude}`,
        })
          .then((data) => {
            setUserDetails({ ...userDetails, checked_in: true });
            notify(data?.message, { type: 'success' });
          })
          .finally(() => setIsLoading(false));
      } else {
        CheckOutApi({
          location: `${location.latitude} , ${location.longitude}`,
        })
          .then((data) => {
            setUserDetails({ ...userDetails, checked_out: true });
            notify(data?.message, { type: 'success' });
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} scrollBehavior={'inside'}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Attendence Details
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 text-base">
                  <span className="font-medium w-1/2 capitalize">Status</span> :
                  <span className="text-gray-400">
                    {userDetails?.checked_in && userDetails?.checked_out
                      ? 'Present'
                      : userDetails?.checked_in
                        ? 'Checked In'
                        : 'Absent'}
                  </span>
                </div>
                <div className="flex gap-2 text-base">
                  <span className="font-medium w-1/2 capitalize">
                    Working Location
                  </span>{' '}
                  :
                  <span className="text-gray-400">
                    {/*@ts-ignore */}
                    {userDetails?.work_location?.replaceAll('_', ' ')}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                label="Close"
                color="danger"
                type="button"
                onClick={() => setOpen(false)}
              />

              {(!userDetails?.checked_in || !userDetails?.checked_out) && (
                <Button
                  label={userDetails?.checked_in ? 'Check Out' : 'Check In'}
                  color={userDetails?.checked_in ? 'danger' : 'success'}
                  onClick={() =>
                    handleEmployeeCheckIn(
                      userDetails?.checked_in ? 'out' : 'in'
                    )
                  }
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AttendenceModal;
