import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';
import DivisionItem from './DivisionItem';
import { getLocaleString } from '../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator, user } = state;
  const { locale } = user;

  return {
    getLocaleText,
    locale,
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(DivisionItem)));
