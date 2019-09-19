import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ServiceTreeView from './ServiceTreeView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  null,
)(ServiceTreeView)));
