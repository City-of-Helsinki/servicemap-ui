import { useSelector } from 'react-redux'

class UserHelper {
  static useTheme() {
    return useSelector(state => state.user.theme);
  }
  static useLocale() {
    return useSelector(state => state.user.locale);
  }
}

export default UserHelper;
