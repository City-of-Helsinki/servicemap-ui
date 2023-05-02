import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import AlertBox from './AlertBox';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { alerts } = state;
  const { errors } = alerts;

  return {
    errors: errors.data || [],
  };
};

export default withStyles(styles)(
  injectIntl(connect(mapStateToProps)(AlertBox))
);
