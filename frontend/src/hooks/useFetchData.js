import { useCallback, useState } from 'react';
import { alertApiError } from '../utils/apiError';

function useFetchData(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (...args) => {
    setLoading(true); setError('');
    try {
      const response = await fetcher(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(alertApiError(err, 'Request failed'));
      return null;
    } finally { setLoading(false); }
  }, [fetcher]);

  return { data, loading, error, run, setData };
}

export default useFetchData;
