import { Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getIcon } from '../../../../components';
import {
  selectDistrictAddressData,
  selectDistrictDataBySelectedType,
} from '../../../../redux/selectors/district';
import { getSelectedStatisticalDistricts } from '../../../../redux/selectors/statisticalDistrict';
import { getPage, selectThemeMode } from '../../../../redux/selectors/user';
import { getClusterStyles } from '../../utils/clusterStyles';
import { drawEntranceMarkerIcon, drawMarkerIcon } from '../../utils/drawIcon';
import StatisticalDataMapInfo from '../StatisticalDataMapInfo';
import { calculateLegendVisibility } from './mapLegendUtils';

const LEGEND_HEADING_ID = 'map-legend-heading';
const LEGEND_CONTENT_ID = 'map-legend-content';

const MapLegend = ({ data, userLocation }) => {
  const intl = useIntl();
  const [expanded, setExpanded] = useState(false);

  const theme = useTheme();
  const themeMode = useSelector(selectThemeMode);
  const isContrastMode = themeMode === 'dark';
  const clusterStyles = getClusterStyles(theme, isContrastMode);

  const location = useLocation();
  const currentPage = useSelector(getPage);
  const districtAddressData = useSelector(selectDistrictAddressData);
  const districtData = useSelector(selectDistrictDataBySelectedType);
  const statisticalDistricts = useSelector(getSelectedStatisticalDistricts);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
    if (event.key === 'Escape' && expanded) {
      setExpanded(false);
    }
  };

  const show = useMemo(
    () =>
      calculateLegendVisibility(
        data,
        location,
        userLocation,
        currentPage,
        districtAddressData,
        districtData,
        statisticalDistricts
      ),
    [
      data,
      location,
      userLocation,
      currentPage,
      districtAddressData,
      districtData,
      statisticalDistricts,
    ]
  );

  return Object.values(show).some(Boolean) ? (
    <StyledContainer>
      <StyledHeader
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-controls={LEGEND_CONTENT_ID}
        aria-label={intl.formatMessage({ id: 'map.legend.title' })}
      >
        <StyledTitle variant="subtitle1" component="div" id={LEGEND_HEADING_ID}>
          <FormattedMessage id="map.legend.title" />
        </StyledTitle>
        <StyledExpandIcon expanded={expanded}>
          {getIcon('iconArrowNext')}
        </StyledExpandIcon>
      </StyledHeader>

      {expanded && (
        <>
          <StyledContent
            id={LEGEND_CONTENT_ID}
            role="region"
            aria-labelledby={LEGEND_HEADING_ID}
          >
            {show.unit && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  <img
                    src={
                      drawMarkerIcon(isContrastMode, 'legend-unit-icon', false)
                        .options.iconUrl
                    }
                    alt=""
                  />
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.unit" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.event && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  <StyledEventIcon
                    src={
                      drawMarkerIcon(isContrastMode, 'legend-event-icon', true)
                        .options.iconUrl
                    }
                    alt=""
                  />
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.event" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.cluster && (
              <StyledLegendItem>
                <StyledClusterMarker aria-hidden="true">
                  <StyledClusterOuter style={clusterStyles.outer}>
                    <StyledClusterMid style={clusterStyles.mid}>
                      <StyledClusterInner style={clusterStyles.inner}>
                        5
                      </StyledClusterInner>
                    </StyledClusterMid>
                  </StyledClusterOuter>
                </StyledClusterMarker>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.cluster" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.entrances && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  <img
                    src={
                      drawEntranceMarkerIcon(
                        isContrastMode,
                        'legend-entrance-icon'
                      ).options.iconUrl
                    }
                    alt=""
                  />
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.entrance" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.coordinate && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  {getIcon(
                    isContrastMode
                      ? 'coordinateMarkerContrast'
                      : 'coordinateMarker'
                  )}
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.coordinate" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.userLocation && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  {getIcon('locationMarker')}
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.userLocation" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.address && (
              <StyledLegendItem>
                <StyledIconWrapper aria-hidden="true">
                  {getIcon('addresslocationMarker')}
                </StyledIconWrapper>
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.address" />
                </StyledLegendText>
              </StyledLegendItem>
            )}

            {show.area && (
              <StyledLegendItem>
                <StyledAreaBox aria-hidden="true" />
                <StyledLegendText variant="body2">
                  <FormattedMessage id="map.legend.area" />
                </StyledLegendText>
              </StyledLegendItem>
            )}
          </StyledContent>

          <StyledStatisticalWrapper>
            <StatisticalDataMapInfo />
          </StyledStatisticalWrapper>
        </>
      )}
    </StyledContainer>
  ) : null;
};

const StyledContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  maxWidth: 300,
  width: `calc(100vw - ${theme.spacing(3)})`,
  border: `2px solid rgba(0, 0, 0, 0.2)`,
  borderRadius: theme.shape.borderRadius,
}));

const StyledHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  cursor: 'pointer',
  backgroundColor: theme.palette.white.main,
  outline: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '-2px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
}));

const StyledContent = styled('ul')(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  margin: 0,
  listStyle: 'none',
}));

const StyledStatisticalWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5, 1.5, 1.5),
}));

const StyledExpandIcon = styled('div')(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  transform: expanded ? 'rotate(270deg)' : 'rotate(90deg)',
  '& img': {
    width: 16,
    height: 16,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const StyledLegendItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.25),
}));

const StyledLegendText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.text.primary,
  textAlign: 'left',
}));

// Wrapper for the icon
const StyledIconWrapper = styled('div')(() => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: 20,
    height: 20,
  },
}));

// Event icon is slightly larger
const StyledEventIcon = styled('img')(() => ({
  width: '22px !important',
  height: '22px !important',
}));

// Klusteri marker (sisäkkäiset ympyrät) - uses shared styles from clusterStyles.js
const StyledClusterMarker = styled('div')(() => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledClusterOuter = styled('div')(() => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledClusterMid = styled('div')(() => ({
  width: 21,
  height: 21,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledClusterInner = styled('div')(() => ({
  fontSize: 12,
  width: 18,
  height: 18,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Area box
const StyledAreaBox = styled('div')(({ theme }) => ({
  width: 18,
  height: 18,
  border: `2px solid #eb5c29`,
  backgroundColor: '#fbded4',
  marginRight: theme.spacing(0.25),
}));

MapLegend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

export default MapLegend;
