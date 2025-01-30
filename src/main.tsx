import { NextUIProvider } from '@nextui-org/react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider className="h-full">
    <App />
  </NextUIProvider>
);
