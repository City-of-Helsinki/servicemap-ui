import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import DownloadDialog from './DownloadDialog';
import { getLocaleString } from '../../../redux/selectors/locale';
import styles from './styles';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    getLocaleText,
  };
};


export default withStyles(styles)(connect(mapStateToProps)(DownloadDialog));
