import Popup from '@/components/modal/modal';
import TextArea from '@/components/textArea';
import { CreateNotification } from '@/services/notificationService';
import { notify } from '@/utils/helpers/helpers';
import { useEffect, useState } from 'react';

export interface NotificationModalProps {
  mutate: () => void;
  details: { text: string; id: string } | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotificationModal: React.FC<NotificationModalProps> = ({
  mutate,
  details,
  isOpen,
  setIsOpen,
}) => {
  const [value, setValue] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setValue('');
    } else if (details?.id) {
      setValue(details?.text);
    }
  }, [isOpen]);
  /**
   * @function handleNotification
   * @description on admitting student , navigate to student details to update details
   */
  function handleNotification() {
    if (!value) setIsInvalid(true);
    else {
      setIsLoading(true);
      const _pay = {
        notification_message: value,
        ...(details?.id && { message_id: details.id }),
      };
      CreateNotification(_pay)
        .then((data) => {
          notify(data.message, { type: 'success' });
          mutate();
          setIsOpen(false);
        })
        .finally(() => setIsLoading(false));
    }
  }

  return (
    <Popup
      title="Add Notification"
      onSubmit={handleNotification}
      isOpen={isOpen}
      isSubmitting={isLoading}
      setOpen={setIsOpen}
    >
      <TextArea
        label="Notification Text*"
        placeholder="type here..."
        labelPlacement="outside"
        maxRows={4}
        errorText={'Enter Text'}
        isInvalid={isInvalid}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Popup>
  );
};

export default NotificationModal;
