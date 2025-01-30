import useAuthContext from '@/context/index';
import PATH from '@/routes/paths';
import React from 'react';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { isAdmin } = useAuthContext();

  return isAdmin ? (
    <Navigate to={PATH.dashboard} />
  ) : (
    <Navigate to={PATH.students} />
  );
};

export default Home;
