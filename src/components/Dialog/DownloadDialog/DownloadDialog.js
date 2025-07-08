import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectResultsPreviousSearch } from '../../../redux/selectors/results';
import { getSelectedUnit } from '../../../redux/selectors/selectedUnit';
import { selectServiceCurrent } from '../../../redux/selectors/service';
import { getPage } from '../../../redux/selectors/user';
import useDownloadData from '../../../utils/downloadData';
import useLocaleText from '../../../utils/useLocaleText';
import SMButton from '../../ServiceMapButton';
import { getIcon } from '../../SMIcon';
import Dialog from '../index';
import { fetchServiceNames } from './utils';

function DownloadDialog({ open, ...rest }) {
  const getLocaleText = useLocaleText();
  const downloadData = useDownloadData();
  const page = useSelector(getPage);
  const selectedUnit = useSelector(getSelectedUnit);
  const service = useSelector(selectServiceCurrent);
  const searchQuery = useSelector(selectResultsPreviousSearch);
  const intl = useIntl();
  const icon = getIcon('serviceDark');
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
    fetchServiceNames(snIDs).then((data) => setServiceNames(data));
  }, [snIDs]);

  const formats = [
    {
      name: 'JSON',
    },
  ];
  const [format, setFormat] = React.useState('JSON');
  const btnGroup = (
    <FormControl component="fieldset" fullWidth>
      <StyledFormLabel component="h3">
        <FormattedMessage id="download.format" />
      </StyledFormLabel>
      <StyledRadioGroup
        aria-label={intl.formatMessage({ id: 'download.format' })}
        name="format"
        value={format}
        onChange={(event, value) => {
          setFormat(value);
        }}
      >
        {formats.map((f) => (
          <FormControlLabel
            key={f.name}
            control={<Radio color="primary" />}
            label={<Typography variant="body2">{f.name}</Typography>}
            labelPlacement="end"
            value={f.name}
          />
        ))}
      </StyledRadioGroup>
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
          tab.document.write(
            `<html><body><pre style="white-space: pre;">${content}</pre></body></html>`
          );
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
    const getPageText = (page) =>
      intl.formatMessage({ id: `download.cropText.${page}` });
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
          const nameArray = serviceNames.map((name) => getLocaleText(name));
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

    const unitCount = intl.formatMessage(
      { id: 'map.unit.cluster.popup.info' },
      { count: downloadData?.length }
    );
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
      <StyledDivCroppingContainer>
        <StyledCroppingTitleTypography variant="subtitle1" component="h3">
          {croppingTitle}
        </StyledCroppingTitleTypography>
        <Typography variant="body2">{text}</Typography>
        {selectionText && (
          <StyledCroppingTextTypography variant="body2">
            {selectionText}
          </StyledCroppingTextTypography>
        )}
        {dataText && (
          <StyledUnitCountDiv>
            {icon}
            <Typography component="p" variant="body2">
              {dataText}
            </Typography>
          </StyledUnitCountDiv>
        )}
      </StyledDivCroppingContainer>
    );
  };

  const dialogText = intl.formatMessage({ id: 'download.info' });
  const dialogCoordinateText = intl.formatMessage({
    id: 'download.coordinate',
  });
  // const formatText = intl.formatMessage({ id: 'download.format' });
  const downloadTitle = intl.formatMessage({ id: 'download.title' });
  const downloadText = intl.formatMessage({ id: 'download.download' });

  return (
    <Dialog
      open={open}
      {...rest}
      title={downloadTitle}
      content={
        <StyledDivContainer>
          <Typography variant="body2">{dialogText}</Typography>
          <StyledTopMarginTypography variant="body2">
            {dialogCoordinateText}
          </StyledTopMarginTypography>
          {croppingText()}
          {btnGroup}
        </StyledDivContainer>
      }
      actions={
        downloadOnClick ? (
          <SMButton color="primary" role="button" onClick={downloadOnClick}>
            {downloadText}
            <StyledOpenInNew />
          </SMButton>
        ) : null
      }
    />
  );
}

const StyledRadioGroup = styled(RadioGroup)(() => ({
  flexDirection: 'row',
  '& p': {
    margin: 0,
  },
}));

const StyledFormLabel = styled(FormLabel)(() => ({
  color: 'rgba(0, 0, 0, 0.87)',
}));

const StyledOpenInNew = styled(OpenInNew)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  fontSize: 'inherit',
}));

const StyledTopMarginTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledDivContainer = styled('div')(({ theme }) => ({
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const StyledUnitCountDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'rgba(222, 222, 222, 0.15)',
  width: 'fit-content',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  margin: `${theme.spacing(1)} 0`,
  '& img': {
    marginRight: theme.spacing(1),
  },
  '& p': {
    margin: 0,
  },
}));

const StyledDivCroppingContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& p': {
    marginBottom: theme.spacing(1),
  },
}));

const StyledCroppingTitleTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StyledCroppingTextTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: '#DEDEDE',
  width: 'fit-content',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  margin: `${theme.spacing(1)} 0`,
}));

DownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default DownloadDialog;
