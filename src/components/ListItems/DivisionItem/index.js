import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from './styles';
import DivisionItem from './DivisionItem';

const mapStateToProps = (state) => {
  const { navigator, user } = state;
  const { locale } = user;

  return {
    locale,
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(DivisionItem)));
