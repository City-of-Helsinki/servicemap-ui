import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Typography, Paper, TextField,
} from '@material-ui/core';
import URI from 'urijs';
import * as smurl from './utils/url';
import isClient, { uppercaseFirst } from '../../utils';
import { getEmbedURL, getLanguage } from './utils/utils';
import EmbedController from './components/EmbedController';
import IFramePreview from './components/IFramePreview';
import CloseButton from '../../components/CloseButton';
import SMButton from '../../components/ServiceMapButton';
import paths from '../../../config/paths';
import embedderConfig from './embedderConfig';
import SettingsUtility from '../../utils/settings';
import { Helmet } from 'react-helmet';


const hideCitiesIn = [
  paths.unit.regex,
  paths.address.regex,
];

const hideServicesIn = [
  paths.search.regex,
  paths.unit.regex,
  paths.service.regex,
  paths.address.regex,
];

// Timeout for handling width and height input changes
// only once user stops typing
let timeout;
const timeoutDelay = 1000;

const EmbedderView = ({
  classes, intl, mapType, navigator,
}) => {
  if (!isClient()) {
    return null;
  }
  // Verify url
  const data = isClient() ? smurl.verify(window.location.href) : {};
  let { url } = data;
  const { ratio } = data;
  if (url) {
    const parameters = smurl.explode(url);
    url = smurl.strip(url, parameters);
  }
  let search = {};
  if (url) {
    const uri = URI(url);
    search = uri.search(true);
  }

  // Defaults
  const initialRatio = ratio || 52;
  const defaultMap = search.map || mapType || embedderConfig.BACKGROUND_MAPS[0];
  const defaultLanguage = getLanguage(url);
  const defaultCity = search.city || 'all';
  const defaultFixedHeight = embedderConfig.DEFAULT_CUSTOM_WIDTH;
  const iframeConfig = embedderConfig.DEFAULT_IFRAME_PROPERTIES || {};
  const defaultService = 'none';

  // States
  const [language, setLanguage] = useState(defaultLanguage);
  const [map, setMap] = useState(defaultMap);
  const [city, setCity] = useState(defaultCity);
  const [service, setService] = useState(defaultService);
  const [customWidth, setCustomWidth] = useState(embedderConfig.DEFAULT_CUSTOM_WIDTH || 100);
  const [widthMode, setWidthMode] = useState('auto');
  const [fixedHeight, setFixedHeight] = useState(defaultFixedHeight);
  const [ratioHeight, setRatioHeight] = useState(initialRatio);
  const [heightMode, setHeightMode] = useState('ratio');
  const [transit, setTransit] = useState(false);
  const [showUnits, setShowUnits] = useState(true);

  const dialogRef = useRef();

  const renderWrapperStyle = () => `position: relative; width:100%; padding-bottom:${ratioHeight}%;`;
  const embedUrl = getEmbedURL(url, {
    language, map, city, service, defaultLanguage, transit, showUnits,
  });
  const iframeTitle = intl.formatMessage({ id: 'embedder.iframe.title' });


  const focusToFirstElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[0].focus();
  };

  useEffect(() => {
    focusToFirstElement();

    // Run component unmount cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  // Close embed view
  const closeView = () => {
    if (navigator) {
      navigator.goBack();
    }
  };

  // Run timeout function and cancel previous if it exists
  const runTimeoutFunction = (func) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(func, timeoutDelay);
  };

  // Figure out embed html
  const embedHTML = (url) => {
    if (!url) {
      return '';
    }
    let height;
    let html;
    if (heightMode === 'fixed') { height = fixedHeight; }
    if (heightMode === 'ratio') {
      if (widthMode === 'auto') {
        html = `<div style="${renderWrapperStyle()}">
          <iframe title="${iframeTitle}" style="position: absolute; top: 0; left: 0; border: none; width: 100%; height: 100%;"
          src="${embedUrl}"></iframe></div>`;
      } else {
        height = parseInt(parseInt(customWidth, 10) * (parseInt(ratioHeight, 10) / 100.0), 10);
      }
    }

    if (height) {
      const width = widthMode !== 'custom' ? (
        iframeConfig.style && iframeConfig.style.width && iframeConfig.style.width
      ) : customWidth;
      const widthUnit = width !== '100%' ? 'px' : '';
      html = `<iframe title="${iframeTitle}" style="border: none; width: ${width}${widthUnit}; height: ${height}px;"
                  src="${embedUrl}"></iframe>`;
    }
    return html;
  };

  const showCities = (embedUrl) => {
    const originalUrl = embedUrl.replace('/embed', '');
    let show = true;
    hideCitiesIn.forEach((r) => {
      if (show) {
        show = !r.test(originalUrl);
      }
    });
    return show;
  };

  const showServices = (embedUrl) => {
    const originalUrl = embedUrl.replace('/embed', '');
    let show = true;
    hideServicesIn.forEach((r) => {
      if (show) {
        show = !r.test(originalUrl);
      }
    });
    return show;
  };

  /**
   * Renders embed HTMl based on options
   */
  const renderEmbedHTML = () => {
    const htmlText = embedHTML(data.url);
    const textFieldClass = `${classes.textField} ${classes.marginBottom}`;

    return (
      <Paper className={classes.formContainerPaper}>
        {
          /* Embed address */
        }
        <Typography
          align="left"
          className={classes.marginBottom}
          variant="h5"
          component="h2"
        >
          <FormattedMessage id="embedder.url.title" />
        </Typography>
        <TextField
          id="embed-address"
          className={textFieldClass}
          value={embedUrl}
          margin="normal"
          variant="outlined"
        />
        {
          /* Embed HTML code */
        }
        <Typography
          align="left"
          className={classes.marginBottom}
          variant="h5"
          component="h2"
        >
          <FormattedMessage id="embedder.code.title" />
        </Typography>
        <pre className={classes.pre}>
          { htmlText }
        </pre>
      </Paper>
    );
  };

  /**
   * Render language controls
   */
  const renderLanguageControl = () => {
    const description = locale => intl.formatMessage({ id: `embedder.language.description.${locale}` });
    const languageControls = generateLabel => Object.keys(embedderConfig.LANGUAGES).map(lang => ({
      value: lang,
      label: `${uppercaseFirst(embedderConfig.LANGUAGES[lang])}. ${generateLabel(lang)}`,
    }));

    return (
      <EmbedController
        titleID="embedder.language.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.language.aria.label' })}
        radioName="language"
        radioValue={language}
        radioControls={languageControls(description)}
        radioOnChange={(e, v) => setLanguage(v)}
      />
    );
  };

  /**
   * Render map controls
   */
  const renderMapTypeControl = () => {
    const getLabel = map => intl.formatMessage({ id: `settings.map.${map}` });
    const mapControls = generateLabel => embedderConfig.BACKGROUND_MAPS.map(map => ({
      value: map,
      label: `${generateLabel(map)}`,
    }));
    return (
      <EmbedController
        titleID="embedder.map.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.map.aria.label' })}
        radioName="map"
        radioValue={map}
        radioControls={mapControls(getLabel)}
        radioOnChange={(e, v) => setMap(v)}
      />
    );
  };

  /**
   * Render city controls
   */
  const renderCityControl = () => {
    if (!showCities(embedUrl)) {
      return null;
    }
    const cityControls = embedderConfig.CITIES.map(city => ({
      value: city || 'all',
      label: city ? uppercaseFirst(city) : 'Kaikki',
    }));

    return (
      <EmbedController
        titleID="embedder.city.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.city.aria.label' })}
        radioName="city"
        radioValue={city}
        radioControls={cityControls}
        radioOnChange={(e, v) => setCity(v)}
      />
    );
  };

  /**
   * Render service control
   */
  const renderServiceControl = () => {
    if (!showServices(embedUrl)) {
      return null;
    }
    const getLabel = service => intl.formatMessage({ id: `embedder.service.${service}` });
    const serviceControls = generateLabel => ['none', 'common', 'all'].map(service => ({
      value: service,
      label: generateLabel(service),
    }));

    return (
      <EmbedController
        titleID="embedder.service.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.service.aria.label' })}
        radioName="service"
        radioValue={service}
        radioControls={serviceControls(getLabel)}
        radioOnChange={(e, v) => setService(v)}
      />
    );
  };

  /**
   * Render width controls
   */
  const renderWidthControl = () => {
    const controls = [
      {
        value: 'auto',
        label: intl.formatMessage({ id: 'embedder.width.auto.label' }),
      },
      {
        value: 'custom',
        label: intl.formatMessage({ id: 'embedder.width.custom.label' }),
      },
    ];
    const inputValue = widthMode === 'custom' ? customWidth : 100;
    const inputOnChange = (e, v) => runTimeoutFunction(() => setCustomWidth(v));
    const pretext = widthMode === 'custom' ? 'px' : '%';
    const ariaLabel = widthMode === 'custom'
      ? intl.formatMessage({ id: 'embedder.width.input.aria.custom' })
      : intl.formatMessage({ id: 'embedder.width.input.aria.auto' });

    return (
      <EmbedController
        titleID="embedder.width.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.width.aria.label' })}
        radioName="width"
        radioValue={widthMode}
        radioControls={controls}
        radioOnChange={(e, v) => setWidthMode(v)}
        inputAriaLabel={ariaLabel}
        inputValue={inputValue}
        inputOnChange={inputOnChange}
        inputPreText={pretext}
        inputDisabled={widthMode !== 'custom'}
      />
    );
  };

  /**
   * Render height controls
   */
  const renderHeightControl = () => {
    const controls = [
      {
        value: 'ratio',
        label: intl.formatMessage({ id: 'embedder.height.ratio.label' }),
      },
      {
        value: 'fixed',
        label: intl.formatMessage({ id: 'embedder.height.fixed.label' }),
      },
    ];
    const customHeight = heightMode === 'fixed' ? fixedHeight : ratioHeight;
    const pretext = heightMode === 'fixed' ? 'px' : '%';
    const ariaLabel = heightMode === 'fixed'
      ? intl.formatMessage({ id: 'embedder.height.input.aria.fixed' })
      : intl.formatMessage({ id: 'embedder.height.input.aria.ratio' });

    return (
      <EmbedController
        titleID="embedder.height.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.height.aria.label' })}
        radioName="height"
        radioValue={heightMode}
        radioControls={controls}
        radioOnChange={(e, v) => setHeightMode(v)}
        inputAriaLabel={ariaLabel}
        inputValue={customHeight}
        inputOnChange={(e, v) => {
          runTimeoutFunction(() => {
            if (heightMode === 'fixed') {
              setFixedHeight(v);
            } else {
              setRatioHeight(v);
            }
          });
        }}
        inputPreText={pretext}
      />
    );
  };

  const renderMapOptionsControl = () => {
    const controls = [
      {
        key: 'transit',
        value: transit,
        onChange: v => setTransit(v),
        icon: null,
        labelId: 'embedder.options.label.transit',
      },
      {
        key: 'units',
        value: showUnits,
        onChange: v => setShowUnits(v),
        icon: null,
        labelId: 'embedder.options.label.units',
      },
    ];

    return (
      <EmbedController
        titleID="embedder.options.title"
        titleComponent="h2"
        checkboxControls={controls}
        checkboxLabelledBy="embedder.options.title"
      />
    );
  };

  const renderHeadInfo = () => (
    <Helmet>
      <title>
        {`${intl.formatMessage({ id: 'embedder.title' })} | ${intl.formatMessage({ id: 'app.title' })}`}
      </title>
    </Helmet>
  );

  return (
    <div ref={dialogRef}>
      {
        renderHeadInfo()
      }
      <div className={classes.appBar} />
      <div className={classes.container}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
        }}
        >
          <CloseButton
            aria-label={intl.formatMessage({ id: 'embedder.close' })}
            className={classes.closeButton}
            onClick={closeView}
            role="link"
            textID="embedder.close"
          />
          <div className={classes.titleContainer}>
            <Typography align="left" className={classes.title} variant="h1">
              <FormattedMessage id="embedder.title" />
            </Typography>
            <Typography align="left" variant="body2">
              <FormattedMessage id="embedder.title.info" />
            </Typography>
          </div>
          <div className={classes.pusher} />
        </div>
        <div className={classes.formContainer}>
          <form>
            {
              renderLanguageControl()
            }
            {
              renderServiceControl()
            }
            {
              renderMapTypeControl()
            }
            {
              renderCityControl()
            }
            {
              renderWidthControl()
            }
            {
              renderHeightControl()
            }
            <IFramePreview
              classes={classes}
              customWidth={customWidth}
              embedUrl={embedUrl}
              fixedHeight={fixedHeight}
              heightMode={heightMode}
              ratioHeight={ratioHeight}
              title={iframeTitle}
              titleComponent="h2"
              widthMode={widthMode}
            />

            {
              renderMapOptionsControl()
            }
          </form>
          {
            renderEmbedHTML()
          }
          <SMButton
            aria-label={intl.formatMessage({ id: 'embedder.close' })}
            className={classes.button}
            small
            role="link"
            onClick={closeView}
            messageID="embedder.close"
          />
        </div>

      </div>
    </div>
  );
};

EmbedderView.propTypes = {
  classes: PropTypes.shape({
    appBar: PropTypes.string,
    button: PropTypes.string,
    closeButton: PropTypes.string,
    container: PropTypes.string,
    formContainer: PropTypes.string,
    formContainerPaper: PropTypes.string,
    marginBottom: PropTypes.string,
    pre: PropTypes.string,
    pusher: PropTypes.string,
    textField: PropTypes.string,
    title: PropTypes.string,
    titleContainer: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  mapType: PropTypes.oneOf(SettingsUtility.mapSettings),
  navigator: PropTypes.objectOf(PropTypes.any),
};

EmbedderView.defaultProps = {
  navigator: null,
  mapType: null,
};


export default EmbedderView;
