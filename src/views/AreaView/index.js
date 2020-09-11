import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AreaView from './AreaView';
import styles from './styles';
import {
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setHighlightedDistrict,
  setSelectedDistrictServices,
  setDistrictData,
  setDistrictAddressData,
  addSubdistrictUnits,
} from '../../redux/actions/district';
import { renderMarkerConnector } from '../MapView/utils/unitMarkers';
import { generatePath } from '../../utils/path';
import { formatDistanceObject } from '../../utils';
import { calculateDistance } from '../../redux/selectors/unit';
import { getDistrictsByType, getAddressDistrict, getSubdistrictServices } from '../../redux/selectors/district';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state, props) => {
  const { intl } = props;
  const { navigator, user } = state;
  const { locale, theme } = user;
  const {
    districtData, selectedDistrictType, districtAddressData, subdistrictUnits, selectedSubdistricts,
  } = state.districts;
  const map = state.mapRef;
  const filteredSubdistrictUnits = getSubdistrictServices(state);
  const selectedDistrictData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const getPath = (id, data) => generatePath(id, locale, data);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getDistance = unit => formatDistanceObject(intl, calculateDistance(state)(unit));
  return {
    districtData,
    selectedDistrictData,
    selectedDistrictType,
    districtAddressData,
    addressDistrict,
    subdistrictUnits,
    filteredSubdistrictUnits,
    selectedSubdistricts,
    getLocaleText,
    renderUnitMarkers: renderMarkerConnector(
      getLocaleText,
      navigator,
      theme,
      getPath,
      getDistance,
    ),
    navigator,
    map,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    setSelectedDistrictType,
    setSelectedSubdistricts,
    setSelectedDistrictServices,
    setHighlightedDistrict,
    setDistrictData,
    setDistrictAddressData,
    addSubdistrictUnits,
  },
)(AreaView)));
