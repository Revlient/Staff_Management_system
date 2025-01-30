import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PageLoader from '@/components/pageLoader';
import { authContext } from '@/context/authContext';

const AuthRoute = () => {
  //@ts-ignore
  const { isValidUser } = useContext(authContext);
  console.log(isValidUser);

  if (isValidUser === null) {
    return <PageLoader />;
  } else if (isValidUser) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default AuthRoute;
