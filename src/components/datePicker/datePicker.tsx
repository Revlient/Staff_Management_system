import React from 'react';
import DatePicker, { DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface CalenderProps {
  label: string;
}
const Calender: React.FC<CalenderProps & DatePickerProps> = ({ ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-small">{props.label}</span>
      <DatePicker
        showIcon={true}
        className="bg-default-100 text-small rounded-xl !p-2 h-10 outline-none"
        calendarIconClassName="top-[6px] right-0"
        wrapperClassName="w-fit"
        popperClassName="z-50"
        {...props}
      />
    </div>
  );
};

export default Calender;
