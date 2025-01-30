import { useEffect, useState } from 'react';

interface IUseFetch<T> {
  data: T | null;
  loading: boolean;
}

const useFetch = <T = any,>(fetchCall: () => Promise<T>): IUseFetch<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [fetchCall]);

  const fetchData = async () => {
    try {
      const result = await fetchCall();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
};

export default useFetch;
