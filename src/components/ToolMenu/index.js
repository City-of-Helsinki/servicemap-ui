import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ToolMenu from './ToolMenu';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;

  return {
    navigator,
  };
};

export default injectIntl(connect(mapStateToProps)(withStyles(styles)(ToolMenu)));
