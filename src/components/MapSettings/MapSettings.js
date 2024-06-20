import styled from '@emotion/styled';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setMapType } from '../../redux/actions/settings';
import { selectMapRef } from '../../redux/selectors/general';
import { selectMapType } from '../../redux/selectors/settings';
import { getLocale } from '../../redux/selectors/user';
import SettingsUtility from '../../utils/settings';
import MobileSettingsHeader from '../MobileSettingsHeader/MobileSettingsHeader';
import SMButton from '../ServiceMapButton';
import ExternalMapUrlCreator from './externalMapUrlCreator';

const MapSettings = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const mapType = useSelector(selectMapType);
  const map = useSelector(selectMapRef);
  const locale = useSelector(getLocale);

  const mapSettings = {};
  SettingsUtility.mapSettings.forEach((setting) => {
    mapSettings[setting] = {
      action: () => setMapType(setting),
      labelId: `settings.map.${setting}`,
      value: setting,
    };
  });

  const createHelsinkiUrl = () => {
    const { lng, lat } = map.getCenter();
    return ExternalMapUrlCreator.createHelsinki3DMapUrl(lng, lat, map.getZoom(), mapType, locale);
  };

  const openHelsinkiUrl = () => {
    const urlTo3dMap = createHelsinkiUrl();
    window.open(urlTo3dMap);
  };

  const openEspooUrl = () => {
    const { lng, lat } = map.getCenter();
    const urlToEspooMap = ExternalMapUrlCreator.createEspoo3DMapUrl(lng, lat, locale);
    window.open(urlToEspooMap)
  }

  const openVantaaUrl = () => {
    const urlToVantaaMap = ExternalMapUrlCreator.createVantaa3DMapUrl(locale);
    window.open(urlToVantaaMap)
  }

  return (
    <>
      <FormControl sx={{ textAlign: 'left', pt: 3 }} component="fieldset" fullWidth>
        <MobileSettingsHeader textId="settings.map.title" />
        <Typography><FormattedMessage id="settings.map.info" /></Typography>
        <RadioGroup
          aria-label={intl.formatMessage({ id: 'settings.map.title' })}
          sx={{ pt: 2, pl: 1 }}
          name="mapType"
          onChange={(event, value) => dispatch(setMapType(value))}
          value={mapType}
        >
          {Object.keys(mapSettings).map((key) => {
            if (Object.prototype.hasOwnProperty.call(mapSettings, key)) {
              const item = mapSettings[key];
              return (<FormControlLabel
                value={key}
                key={key}
                control={(<Radio id={`${key}-map-type-radio`} color="primary" />)}
                labelPlacement="end"
                label={<FormattedMessage id={item.labelId} />}
              />);
            }
            return null;
          })}
        </RadioGroup>
      </FormControl>
      <Styled3DMapContainer>
        <MobileSettingsHeader textId="settings.3dmap.title" />
        <Styled3DMapLinkButton onClick={openHelsinkiUrl} role="link" data-sm="3dMapLink">
          <Typography><FormattedMessage id="settings.3dmap.link.helsinki" /></Typography>
        </Styled3DMapLinkButton>
        <Styled3DMapLinkButton onClick={openEspooUrl} role="link" data-sm="3dMapLink">
          <Typography><FormattedMessage id="settings.3dmap.link.espoo" /></Typography>
        </Styled3DMapLinkButton>
        <Styled3DMapLinkButton onClick={openVantaaUrl} role="link" data-sm="3dMapLink">
          <Typography><FormattedMessage id="settings.3dmap.link.vantaa" /></Typography>
        </Styled3DMapLinkButton>  
      </Styled3DMapContainer>
    </>
  );
};

const Styled3DMapContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
}));

const Styled3DMapLinkButton = styled(SMButton)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export default MapSettings;
