import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EmbedderView from './EmbedderView';
import styles from './styles';


const mapStateToProps = (state) => {
  const { navigator, settings } = state;
  const { mapType } = settings;

  return {
    mapType,
    navigator,
  };
};


export default withRouter(injectIntl(connect(mapStateToProps)(withStyles(styles)(EmbedderView))));
