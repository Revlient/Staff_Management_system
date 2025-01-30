import PageLoader from '@/components/pageLoader';
import useAuthContext from '@/context/index';
import { Navigate, Outlet } from 'react-router-dom';
import PATH from '../paths';

const PrivateRoute = () => {
  const { isValidUser, isAdmin, isAgent } = useAuthContext();
  const rootPath = location?.pathname;

  if (isValidUser === null) {
    return <PageLoader />;
  } else if (!isValidUser) {
    return <Navigate to={'/auth'} />;
  } else if (
    !isAdmin &&
    !isAgent &&
    [PATH.employees, PATH.addStudents].includes(rootPath)
  ) {
    window.history.back();
    return;
  } else if (!isAdmin && [PATH.dashboard].includes(rootPath)) {
    return <Navigate to={PATH.employees} />;
  }
  return <Outlet />;
};

export default PrivateRoute;
