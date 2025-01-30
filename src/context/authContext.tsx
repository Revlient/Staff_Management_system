import { GetUserDetails, ValidateToken } from '@/services/authService';
import useStore from '@/store/store';
import { swrKeys } from '@/utils/constants';
import React, { createContext, useEffect, useState } from 'react';
import useSWR from 'swr';
export interface AuthContextProps {
  isValidUser: boolean | null;
  isAdmin: boolean;
  isAgent: boolean;
  isLoading: boolean;
}
export const authContext = createContext<AuthContextProps | null>(null);
const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notifications, setUserDetails } = useStore((state) => state);
  const [tokenData, setIsTokenData] = useState<{
    valid_token: boolean | null;
    is_admin: boolean;
    is_agent: boolean;
  }>({ valid_token: null, is_admin: false, is_agent: false });

  const { isLoading } = useSWR(
    `${swrKeys.USER_DETAILS}`,
    async () => {
      const response = await GetUserDetails();
      setUserDetails(response);
      return response;
    },
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: () => ValidateToken().then((value) => setIsTokenData(value)),
    }
  );
  const socket = new WebSocket(
    `wss://api.gloriaglobalventures.in/ws/notifications-check/`
  );

  useEffect(() => {
    connectWebSocket();

    return () => {
      socket.close();
    };
  }, []);

  function connectWebSocket() {
    //@ts-ignore
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      switch (data.action) {
        case 'not_created':
          // setNotifications({
          //   count: notifications.count + 1,
          //   results: [data.data, ...notifications.results],
          // });
          console.log({ results: [data.data, ...notifications.results] });

          break;
        case 'not_edited':
          // setNotifications({
          //   count: notifications.count,
          //   results: notifications.results.map((not) =>
          //     not?.id == data?.data?.id ? data.data : not
          //   ),
          // });
          break;
        case 'not_deleted':
          // setNotifications({
          //   count: notifications.count - 1,
          //   results: notifications.results.filter(
          //     (not) => not?.id != data?.data?.id
          //   ),
          // });
          break;
        default:
          break;
      }
    };
    socket.onopen = function () {
      console.log('WebSocket connection established.');
    };
    socket.onclose = function () {
      setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
    };
    //@ts-ignore
    socket.onerror = function (event) {
      console.error('WebSocket error observed:', event);
      // alert('WebSocket connection failed. Check the console for details');
    };
  }

  const values = {
    isValidUser: tokenData.valid_token,
    isAdmin: tokenData.is_admin,
    isAgent: tokenData.is_agent,
    isLoading,
  };
  return (
    <authContext.Provider value={values}>
      <>{children}</>
    </authContext.Provider>
  );
};

export default AuthContextProvider;
