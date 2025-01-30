import { Textarea as App, TextAreaProps } from '@nextui-org/react';
import React from 'react';

interface TextareaProps extends TextAreaProps {
  showError?: boolean;
  errorText?: string | undefined;
  containerClass?: string;
}
const TextArea: React.FC<TextareaProps> = ({
  containerClass,
  isInvalid,
  showError = true,
  errorText,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      <App
        className={`${props.className}`}
        {...props}
        isInvalid={isInvalid}
        classNames={{ label: 'capitalize' }}
      />
      {showError && (
        <div className="text-xs text-danger h-4 px-2">
          {isInvalid ? errorText : ''}
        </div>
      )}
    </div>
  );
};

export default TextArea;
