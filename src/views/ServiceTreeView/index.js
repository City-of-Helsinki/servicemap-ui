import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { getLocaleString } from '../../redux/selectors/locale';
import setTreeState from '../../redux/actions/serviceTree';
import ServiceTreeView from './ServiceTreeView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator, serviceTree, settings } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    navigator,
    prevServices: (serviceTree && serviceTree.services) || [],
    prevSelected: (serviceTree && serviceTree.selected) || [],
    prevOpened: (serviceTree && serviceTree.opened) || [],
    settings,
    getLocaleText,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { setTreeState },
)(ServiceTreeView)));
