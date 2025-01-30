import Popup, { PopupProps } from '@/components/modal/modal';

export interface AdmitStudentConfirmationProps extends PopupProps {
  content: string;
}
const ConfirmationModal: React.FC<AdmitStudentConfirmationProps> = ({
  content,
  ...props
}) => {
  return (
    <Popup {...props}>
      <div className="flex items-center justify-between">
        <p>{content}</p>
      </div>
    </Popup>
  );
};

export default ConfirmationModal;
