import { useSelector } from 'react-redux'

class UserHelper {
  static useTheme() {
    return useSelector(state => state.user.theme);
  }
}

export default UserHelper;
