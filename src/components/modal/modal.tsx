import {
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import Button from '../button';

export interface PopupProps extends ModalBodyProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: () => void;
}

const Popup: React.FC<PopupProps> = ({
  children,
  isOpen,
  title,
  isSubmitting,
  onSubmit,
  setOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} scrollBehavior={'inside'}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                label="Close"
                color="danger"
                type="button"
                onClick={() => setOpen(false)}
              />
              <Button
                label="Submit"
                color="success"
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                onClick={onSubmit}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Popup;
