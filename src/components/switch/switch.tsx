import { Switch as App, SwitchProps } from '@nextui-org/react';

const Switch: React.FC<SwitchProps> = ({ children, ...props }) => {
  return (
    <App {...props} size="sm" classNames={{ base: 'outline-none' }}>
      {children}
    </App>
  );
};

export default Switch;
