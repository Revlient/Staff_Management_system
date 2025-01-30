import AuthContextProvider from '@/context/authContext';
import Routes from '@/routes/routes';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <AuthContextProvider>
      <ToastContainer />
      <RouterProvider router={Routes} />
    </AuthContextProvider>
  );
};

export default App;
