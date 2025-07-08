import React, { useContext, useEffect } from 'react';

import { ErrorContext } from '../../context/ErrorContext';

export function ErrorTrigger() {
  const { setError } = useContext(ErrorContext);
  useEffect(() => {
    setError('badUrl');
  }, []);

  return null;
}

export default ErrorTrigger;
