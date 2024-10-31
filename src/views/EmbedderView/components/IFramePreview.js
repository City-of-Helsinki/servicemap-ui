import styled from '@emotion/styled';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Paper } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import embedderConfig from '../embedderConfig';

const IFramePreview = ({
  customWidth,
  embedUrl,
  fixedHeight,
  heightMode,
  ratioHeight,
  title,
  titleComponent,
  widthMode,
  renderMapControls,
  bottomList,
  minHeightWithBottomList,
}) => {
  if (!embedUrl) {
    return null;
  }
  const wrapperStyleObject = () => ({
    position: 'relative',
    width: '100%',
    paddingBottom: bottomList ? `max(${ratioHeight}%, 478px)` : `${ratioHeight}%`,
  });
  const iframeConfig = embedderConfig.DEFAULT_IFRAME_PROPERTIES || {};
  const hasContainer = heightMode === 'ratio' && widthMode === 'auto';

  let height = '100%';
  let width = '100%';
  let widthUnit = 'px';
  if (heightMode === 'fixed') { height = fixedHeight; }
  if (heightMode === 'ratio') {
    if (widthMode !== 'auto') {
      height = parseInt(parseInt(customWidth, 10) * (parseInt(ratioHeight, 10) / 100.0), 10);
    }
  }

  if (!hasContainer && height) {
    width = widthMode !== 'custom' ? (
      iframeConfig.style && iframeConfig.style.width && iframeConfig.style.width
    ) : customWidth;
    widthUnit = width !== '100%' ? 'px' : '';
  }

  const styles = {
    position: hasContainer ? 'absolute' : null,
    top: hasContainer ? 0 : null,
    left: hasContainer ? 0 : null,
    // border: 'none',
    width: hasContainer ? '100%' : `${width}${widthUnit}`,
    height: hasContainer ? '100%'
      : bottomList
        ? `max(${height}px, ${minHeightWithBottomList})`
        : `${height}px`,
  };
  const element = hasContainer ? (
    <div style={wrapperStyleObject()}>
      <StyledIframeWrapper
        key={new Date().getTime()}
        title={title}
        style={styles}
        src={embedUrl}
      />
    </div>
  ) : (
    <StyledIframeWrapper
      key={new Date().getTime()}
      title={title}
      style={styles}
      src={embedUrl}
    />
  );

  return (
    <StyledPaper>
      <StyledTypography
        align="left"
        variant="h5"
        component={titleComponent}
      >
        <FormattedMessage id="embedder.preview.title" />
      </StyledTypography>
      {renderMapControls()}
      <StyledIframeContainer style={{ width: '100%' }}>
        {
          element
        }
      </StyledIframeContainer>
    </StyledPaper>
  );
};

const StyledIframeWrapper = styled('iframe')(() => ({
  border: '3px dashed #666',
}));
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  display: 'inline-block',
  margin: `${theme.spacing(3)} 0`,
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  textAlign: 'left',
  '& label': {
    margin: `${theme.spacing(1)} 0`,
  },
  '& fieldset': {
    margin: '0 -12px',
  },
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
const StyledIframeContainer = styled('div')(() => ({
  width: '100%',
}));

IFramePreview.propTypes = {
  customWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  embedUrl: PropTypes.string.isRequired,
  fixedHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heightMode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  ratioHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthMode: PropTypes.string.isRequired,
  bottomList: PropTypes.bool,
  minHeightWithBottomList: PropTypes.string.isRequired,
  renderMapControls: PropTypes.func.isRequired,
};

IFramePreview.defaultProps = {
  customWidth: null,
  fixedHeight: null,
  ratioHeight: null,
  bottomList: false,
};

export default IFramePreview;
