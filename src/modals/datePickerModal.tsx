import Button from '@/components/button';
import DatePicker from '@/components/datePicker';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import React from 'react';
export interface AttendenceModalProps {
  isOpen: boolean;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (val: boolean) => void;
  setData: () => Promise<any>;
  dates: { sd: Date; ed: Date; cd: Date };
  setDates: React.Dispatch<
    React.SetStateAction<{ sd: Date; ed: Date; cd: Date }>
  >;
}

const DatePickerModal: React.FC<AttendenceModalProps> = ({
  isOpen,
  setType,
  type,
  setOpen,
  setData,
  dates,
  setDates,
}) => {
  const handleSubmit = () => {
    setData();
    setOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen} scrollBehavior={'inside'}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Choose Dates
            </ModalHeader>
            <ModalBody>
              <RadioGroup
                label="Choose any"
                color="secondary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <Radio value="any">Choose</Radio>
                <Radio value="range">Date Ranges</Radio>
                <Radio value="date">Exact Date</Radio>
              </RadioGroup>
              <div className="grid grid-cols-2 gap-2">
                {type === 'range' ? (
                  <>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      label="Start Date"
                      selected={dates.sd}
                      maxDate={dates?.ed}
                      //@ts-ignore
                      onChange={(date: Date) =>
                        setDates((cv) => ({ ...cv, sd: date }))
                      }
                    />
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      label="End Date"
                      minDate={dates.sd}
                      maxDate={new Date()}
                      selected={dates.ed}
                      //@ts-ignore
                      onChange={(date: Date) =>
                        setDates((cv) => ({ ...cv, ed: date }))
                      }
                    />
                  </>
                ) : (
                  type === 'date' && (
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      label="Date"
                      selected={dates.cd}
                      //@ts-ignore
                      onChange={(date: Date) =>
                        setDates((cv) => ({ ...cv, cd: date }))
                      }
                    />
                  )
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                label="Close"
                color="danger"
                type="button"
                onClick={() => setOpen(false)}
              />

              <Button
                label={'Submit'}
                color={'success'}
                onClick={handleSubmit}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DatePickerModal;
