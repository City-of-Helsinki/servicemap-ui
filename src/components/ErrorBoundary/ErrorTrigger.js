import { useContext, useEffect } from 'react';

import { ErrorContext } from '../../context/ErrorContext';

export function ErrorTrigger() {
  const { setError } = useContext(ErrorContext);
  useEffect(() => {
    setError('badUrl');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default ErrorTrigger;
