import { useEffect, useState } from 'react';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null);
        },
        (err) => {
          setError('Unable to retrieve location. ' + err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return { location, error };
};

export default useCurrentLocation;
