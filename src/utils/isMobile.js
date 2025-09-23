// import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';

import config from '../../config';

const mobileBreakpoint = config.mobileUiBreakpoint;


/*
const useMobileStatus = () => {
  const [isClientSide, setIsClientSide] = useState(false);
  
  // Set client-side flag after hydration
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Always call useMediaQuery to maintain hook order
  const isMobile = useMediaQuery(
    `(max-width:${mobileBreakpoint}px)`,
    {
      defaultMatches: false, // Default value for SSR
      noSsr: true, // Suppress SSR warning
    }
  );

  // Return false during SSR/hydration, actual value after
  return isClientSide && isMobile;
};*/
const useMobileStatus = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width:${mobileBreakpoint}px)`);
    
    const handleChange = (e) => setIsMobile(e.matches);
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
};

export default useMobileStatus;