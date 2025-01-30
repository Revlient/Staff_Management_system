import { useContext } from 'react';
import { authContext } from './authContext';

const useAuthContext = () => {
  const context = useContext(authContext);

  if (context === null) {
    throw new Error(
      'useAuthContext must be used within a useAuthContext provider'
    );
  }
  return context;
};
export default useAuthContext;
