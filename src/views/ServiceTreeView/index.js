import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { getLocaleString } from '../../redux/selectors/locale';
import {
  fetchRootNodes,
  fetchBranchNodes,
  fetchServiceTreeUnits,
  setTreeSelected,
  addOpenedNode,
  removeOpenedNode,
} from '../../redux/actions/serviceTree';
import ServiceTreeView from './ServiceTreeView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator, serviceTree, settings } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    navigator,
    serviceTree,
    settings,
    getLocaleText,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  {
    fetchRootNodes,
    fetchBranchNodes,
    fetchServiceTreeUnits,
    setTreeSelected,
    addOpenedNode,
    removeOpenedNode,
  },
)(ServiceTreeView)));
