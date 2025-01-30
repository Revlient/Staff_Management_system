import PATH from '@/routes/paths';
import { toast, ToastOptions } from 'react-toastify';
export const createNavItem = (name: string) => {
  return {
    name,
    //@ts-ignore
    url: PATH[name],
    icon: name.toLowerCase(), // Or keep it the same as name, if required
  };
};

export const setLocalStorage = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  localStorage.setItem(key, value);
};
export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};
export const notify = (message: string, options: ToastOptions) =>
  toast(message, { ...options, pauseOnHover: false, autoClose: 3000 });

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay = 900
): { (...args: Parameters<T>): void; cancel: () => void } => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debouncedFunction = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };

  debouncedFunction.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFunction;
};
