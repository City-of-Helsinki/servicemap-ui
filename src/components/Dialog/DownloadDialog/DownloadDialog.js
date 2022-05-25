import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Dialog from '../index';
import SMButton from '../../ServiceMapButton';
import useDownloadData from '../../../utils/downloadData';
import { getIcon } from '../../SMIcon';
import { fetchServiceNames } from './utils';
import useLocaleText from '../../../utils/useLocaleText';

const DownloadDialog = ({
  classes,
  open,
  ...rest
}) => {
  const getLocaleText = useLocaleText();
  const downloadData = useDownloadData();
  const page = useSelector(state => state.user.page);
  const selectedUnit = useSelector(state => state.selectedUnit.unit.data);
  const service = useSelector(state => state.service.current);
  const searchQuery = useSelector(state => state.units.previousSearch);
  const intl = useIntl();
  const icon = getIcon('serviceDark', { className: classes.icon });
  const location = useLocation();
  const [serviceNames, setServiceNames] = useState(null);
  const [snIDs, setSnIDs] = useState(null);

  // Get service node IDs
  const getServiceNodeIDs = () => {
    const usp = new URLSearchParams(location.search);
    const ids = usp.get('service_node');
    return ids;
  };

  // Toggle service node ids on dialog open
  useEffect(() => {
    if (!open) {
      return;
    }
    const ids = getServiceNodeIDs();
    if (!ids) {
      setServiceNames(null);
      setSnIDs(null);
      return;
    }
    setSnIDs(ids);
  }, [open]);

  // Handle fetching on service node ID change
  useEffect(() => {
    if (!snIDs) {
      return;
    }
    fetchServiceNames(snIDs)
      .then(data => setServiceNames(data));
  }, [snIDs]);

  const formats = [
    {
      name: 'JSON',
    },
  ];
  const [format, setFormat] = React.useState('JSON');
  const btnGroup = (
    <FormControl component="fieldset" fullWidth>
      <FormLabel className={classes.formControlLabel} component="h3">
        <FormattedMessage id="download.format" />
      </FormLabel>
      <RadioGroup
        aria-label={intl.formatMessage({ id: 'download.format' })}
        className={classes.formControlGroup}
        name="format"
        value={format}
        onChange={(event, value) => {
          setFormat(value);
        }}
      >
        {
          formats.map(f => (
            <FormControlLabel
              key={f.name}
              control={(
                <Radio
                  color="primary"
                />
              )}
              label={(
                <Typography variant="body2">{f.name}</Typography>
              )}
              labelPlacement="end"
              value={f.name}
            />
          ))
        }
      </RadioGroup>
    </FormControl>
  );

  const getDownloadAction = () => {
    if (!downloadData?.length) {
      return null;
    }
    switch (format) {
      case 'JSON':
        return () => {
          const content = JSON.stringify(downloadData, null, 2);
          const tab = window.open();
          tab.document.open();
          tab.document.write(`<html><body><pre style="white-space: pre;">${content}</pre></body></html>`);
          tab.document.close();
        };
      default:
        return null;
    }
  };
  const downloadOnClick = getDownloadAction();
  const croppingText = () => {
    let text;
    let selectionText;
    const getPageText = page => intl.formatMessage({ id: `download.cropText.${page}` });
    switch (page) {
      case 'unit':
        selectionText = selectedUnit?.name && getLocaleText(selectedUnit.name);
        text = getPageText(page);
        break;
      case 'service':
        selectionText = service?.name && getLocaleText(service.name);
        text = getPageText(page);
        break;
      case 'search':
        if (serviceNames) {
          const nameArray = serviceNames.map(name => getLocaleText(name));
          selectionText = nameArray.join(', ');
          text = getPageText('service');
        } else {
          selectionText = searchQuery;
          text = getPageText(page);
        }
        break;
      default:
        text = intl.formatMessage({ id: 'download.cropText.none' });
    }

    const unitCount = intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count: downloadData?.length });
    let dataText = intl.formatMessage({ id: 'download.data.none' });
    // If data is array show location count
    if (downloadData?.length) {
      dataText = unitCount;
    }
    // Do not show location count or missing text for unit page
    if (page === 'unit') {
      dataText = null;
    }
    const croppingTitle = intl.formatMessage({ id: 'download.cropping.title' });

    return (
      <div className={classes.croppingContainer}>
        <Typography
          className={classes.croppingTitle}
          variant="subtitle1"
          component="h3"
        >
          {croppingTitle}
        </Typography>
        <Typography variant="body2">{text}</Typography>
        {
          selectionText
          && (
            <Typography variant="body2" className={classes.croppingText}>
              {selectionText}
            </Typography>
          )
        }
        {
          dataText
          && (
            <div
              className={classes.unitCount}
            >
              {icon}
              <Typography component="p" variant="body2">{dataText}</Typography>
            </div>
          )
        }
      </div>
    );
  };

  const dialogText = intl.formatMessage({ id: 'download.info' });
  const dialogCoordinateText = intl.formatMessage({ id: 'download.coordinate' });
  // const formatText = intl.formatMessage({ id: 'download.format' });
  const downloadTitle = intl.formatMessage({ id: 'download.title' });
  const downloadText = intl.formatMessage({ id: 'download.download' });

  return (
    <Dialog
      open={open}
      {...rest}
      title={downloadTitle}
      content={(
        <div className={classes.container}>
          <Typography variant="body2">{dialogText}</Typography>
          <Typography variant="body2" className={classes.topMargin}>{dialogCoordinateText}</Typography>
          {croppingText()}
          {btnGroup}
        </div>
      )}
      actions={downloadOnClick ? (
        <SMButton color="primary" role="button" onClick={downloadOnClick}>
          {downloadText}
          <OpenInNew className={classes.downloadIcon} />
        </SMButton>
      ) : null}
    />
  );
};

DownloadDialog.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    croppingContainer: PropTypes.string,
    croppingText: PropTypes.string,
    croppingTitle: PropTypes.string,
    downloadIcon: PropTypes.string,
    formControlGroup: PropTypes.string,
    formControlLabel: PropTypes.string,
    icon: PropTypes.string,
    topMargin: PropTypes.string,
    unitCount: PropTypes.string,
  }).isRequired,
  open: PropTypes.bool.isRequired,
};

export default DownloadDialog;
