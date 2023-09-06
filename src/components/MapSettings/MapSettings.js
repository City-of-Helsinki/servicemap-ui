import styled from '@emotion/styled';
import {
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setMapType } from '../../redux/actions/settings';
import SettingsUtility from '../../utils/settings';
import MobileSettingsHeader from '../MobileSettingsHeader/MobileSettingsHeader';
import ExternalMapUrlCreator from './externalMapUrlCreator';

const MapSettings = () => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const mapType = useSelector(state => state.settings.mapType);
  const map = useSelector(state => state.mapRef);
  const locale = useSelector(state => state.user.locale);

  const mapSettings = {};
  SettingsUtility.mapSettings.forEach((setting) => {
    mapSettings[setting] = {
      action: () => setMapType(setting),
      labelId: `settings.map.${setting}`,
      value: setting,
    };
  });

  const createUrl = () => {
    const { lng, lat } = map.getCenter();
    return ExternalMapUrlCreator.create3DMapUrl(lng, lat, map.getZoom(), mapType, locale);
  };

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
        <Typography><FormattedMessage id="settings.3dmap.info" /></Typography>
        <Link target="_blank" href={createUrl()}>
          <FormattedMessage id="settings.3dmap.link" />
        </Link>
      </Styled3DMapContainer>
    </>
  );
};

const Styled3DMapContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  textAlign: 'left',
}));

export default MapSettings;
