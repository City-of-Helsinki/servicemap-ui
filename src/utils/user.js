import { useSelector } from 'react-redux'
 
export const useUserTheme = () => useSelector(state => state.user.theme);
export const useUserLocale = () => useSelector(state => state.user.locale);
