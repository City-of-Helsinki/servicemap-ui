import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Checkbox, Divider, FormControlLabel, Typography, Link,
} from '@mui/material';
import URI from 'urijs';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import * as smurl from './utils/url';
import isClient, { uppercaseFirst } from '../../utils';
import { getEmbedURL, getLanguage } from './utils/utils';
import EmbedController from './components/EmbedController';
import IFramePreview from './components/IFramePreview';
import paths from '../../../config/paths';
import embedderConfig from './embedderConfig';
import SettingsUtility from '../../utils/settings';
import useLocaleText from '../../utils/useLocaleText';
import { useUserLocale } from '../../utils/user';
import EmbedHTML from './components/EmbedHTML';
import TopBar from '../../components/TopBar';
import config from '../../../config';
import { CloseButton, SMButton } from '../../components';

const hideCitiesIn = [
  paths.unit.regex,
  paths.address.regex,
];

const hideServicesIn = [
  paths.search.regex,
  paths.unit.regex,
  paths.service.regex,
  paths.address.regex,
  paths.area.regex,
];

// Timeout for handling width and height input changes
// only once user stops typing
let timeout;
const timeoutDelay = 1000;
const documentationLink = config.embedderDocumentationUrl;

const EmbedderView = ({
  citySettings,
  classes,
  intl,
  mapType,
  navigator,
}) => {
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

  const cityOption = (search?.city !== '' && search?.city?.split(',')) || citySettings;
  const citiesToReduce = cityOption.length > 0
    ? cityOption
    : embedderConfig.CITIES.filter(v => v);

  // Defaults
  const initialRatio = ratio || 52;
  const defaultMap = search.map || mapType || embedderConfig.BACKGROUND_MAPS[0];
  const defaultLanguage = getLanguage(url);
  const defaultCities = citiesToReduce.reduce((acc, current) => {
    acc[current] = true;
    return acc;
  }, {});
  const defaultFixedHeight = embedderConfig.DEFAULT_CUSTOM_WIDTH;
  const iframeConfig = embedderConfig.DEFAULT_IFRAME_PROPERTIES || {};
  const defaultService = 'none';
  const page = useSelector(state => state.user.page);
  const selectedUnit = useSelector(state => state.selectedUnit.unit.data);
  const currentService = useSelector(state => state.service.current);
  const getLocaleText = useLocaleText();
  const userLocale = useUserLocale();

  // States
  const [language, setLanguage] = useState(defaultLanguage);
  const [map, setMap] = useState(defaultMap);
  const [city, setCity] = useState(defaultCities);
  const [service, setService] = useState(defaultService);
  const [customWidth, setCustomWidth] = useState(embedderConfig.DEFAULT_CUSTOM_WIDTH || 100);
  const [widthMode, setWidthMode] = useState('auto');
  const [fixedHeight, setFixedHeight] = useState(defaultFixedHeight);
  const [ratioHeight, setRatioHeight] = useState(initialRatio);
  const [heightMode, setHeightMode] = useState('ratio');
  const [transit, setTransit] = useState(false);
  const [showUnits, setShowUnits] = useState(true);
  const [restrictBounds, setRestrictBounds] = useState(true);
  const [showUnitList, setShowUnitList] = useState(false);

  const boundsRef = useRef([]);
  const dialogRef = useRef();

  const selectedBbox = restrictBounds && boundsRef.current;

  const minHeightWithBottomList = '478px';

  const embedUrl = getEmbedURL(url, {
    language,
    map,
    city,
    service,
    defaultLanguage,
    transit,
    showUnits,
    showUnitList,
    bbox: selectedBbox,
  });

  const getTitleText = () => {
    let text;
    const appTitle = intl.formatMessage({ id: 'app.title' });
    try {
      switch (page) {
        case 'unit':
          text = selectedUnit?.name && getLocaleText(selectedUnit.name);
          break;
        case 'service':
          text = currentService?.name && getLocaleText(currentService.name);
          break;
        default:
          text = intl.formatMessage({ id: `general.pageTitles.${page}` });
      }
      if (text.indexOf('general.pageTitles') !== -1) {
        text = null;
      }
    } catch (e) {
      console.warn('Error while trying to get title text', e.message);
    }

    return `${appTitle}${text ? ` - ${text}` : ''}`;
  };

  const iframeTitle = getTitleText();

  const focusToFirstElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[0].focus();
  };

  const setBoundsRef = useCallback((bounds) => {
    boundsRef.current = bounds;
  }, []);

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
  const createEmbedHTML = useCallback((url) => {
    const showListBottom = showUnitList === 'bottom';
    if (!url) {
      return '';
    }
    const renderWrapperStyle = () => (showListBottom
      ? `position: relative; width:100%; padding-bottom: max(${ratioHeight}%, ${minHeightWithBottomList});`
      : `position: relative; width:100%; padding-bottom:${ratioHeight}%;`
    );
    let height;
    let html;
    if (heightMode === 'fixed') { height = fixedHeight; }
    if (heightMode === 'ratio') {
      if (widthMode === 'auto') {
        html = `<div style="${renderWrapperStyle()}"><iframe title="${iframeTitle}" style="position: absolute; top: 0; left: 0; border: none; width: 100%; height: 100%;" src="${url}"></iframe></div>`;
      } else {
        height = parseInt(parseInt(customWidth, 10) * (parseInt(ratioHeight, 10) / 100.0), 10);
      }
    }

    if (height) {
      const width = widthMode !== 'custom' ? (
        iframeConfig.style && iframeConfig.style.width && iframeConfig.style.width
      ) : customWidth;
      const widthUnit = width !== '100%' ? 'px' : '';
      const heightValue = showListBottom ? `height: max(${height}px, ${minHeightWithBottomList})` : `height: ${height}px`;
      html = `<iframe title="${iframeTitle}" style="border: none; width: ${width}${widthUnit}; ${heightValue};"
                  src="${url}"></iframe>`;
    }
    return html;
  }, [
    customWidth,
    fixedHeight,
    heightMode,
    iframeTitle,
    widthMode,
    ratioHeight,
    iframeConfig.style,
    showUnitList,
  ]);

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
   * Render language controls
   */
  const renderLanguageControl = () => {
    const description = locale => intl.formatMessage({ id: `embedder.language.description.${locale}` });
    const languageControls = generateLabel => Object.keys(embedderConfig.LANGUAGES).map(lang => ({
      value: lang,
      label: `${uppercaseFirst(embedderConfig.LANGUAGES[userLocale][lang])}. ${generateLabel(lang)}`,
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
    const cities = city;
    const cityControls = embedderConfig.CITIES.filter(v => v).map(city => ({
      key: city,
      value: !!cities[city],
      label: uppercaseFirst(city),
      icon: null,
      onChange: (v) => {
        const newCities = {};
        Object.assign(newCities, cities);
        newCities[city] = v;
        setCity(newCities);
      },
    }));

    return (
      <EmbedController
        titleID="embedder.city.title"
        titleComponent="h2"
        checkboxControls={cityControls}
        checkboxLabelledBy="embedder.city.title"
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


  const renderMapControls = useCallback(() => (
    <div className={classes.mapControlContainer}>
      {/* Map bounds */}
      <FormControlLabel
        control={(
          <Checkbox
            color="primary"
            checked={!!restrictBounds}
            value="bounds"
            onChange={() => setRestrictBounds(!restrictBounds)}
          />
        )}
        label={(<FormattedMessage id="embedder.options.label.bbox" />)}
      />
    </div>
  ), [restrictBounds]);


  const renderMarkerOptionsControl = () => {
    const controls = [
      {
        key: 'units',
        value: showUnits,
        onChange: v => setShowUnits(v),
        icon: null,
        labelId: 'embedder.options.label.units',
      },
      {
        key: 'transit',
        value: transit,
        onChange: v => setTransit(v),
        icon: null,
        labelId: 'embedder.options.label.transit',
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

  /**
 * Render unit list controls
 */
  const renderListOptionsControl = () => {
    const controls = [
      { label: intl.formatMessage({ id: 'embedder.options.label.list.none' }), value: 'false' },
      { label: intl.formatMessage({ id: 'embedder.options.label.list.side' }), value: 'side' },
      { label: intl.formatMessage({ id: 'embedder.options.label.list.bottom' }), value: 'bottom' },
    ];

    return (
      <EmbedController
        titleID="embedder.options.list.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({ id: 'embedder.options.list.title' })}
        radioName="unitList"
        radioValue={showUnitList}
        radioControls={controls}
        radioOnChange={(e, v) => setShowUnitList(v)}
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

  if (!isClient()) {
    return null;
  }

  return (
    <>
      <TopBar smallScreen={false} hideButtons />
      <div ref={dialogRef}>
        {
          renderHeadInfo()
        }
        <div className={classes.container}>
          <div className={classes.titleContainer}>
            <CloseButton
              aria-label={intl.formatMessage({ id: 'embedder.close' })}
              className={classes.closeButton}
              onClick={closeView}
              role="link"
              textID="embedder.close"
            />
            <Typography align="left" className={classes.title} variant="h1">
              <FormattedMessage id="embedder.title" />
            </Typography>
          </div>
          <div className={classes.scrollContainer}>
            <div className={classes.formContainer}>
              <Typography className={classes.infoText} align="left" variant="body2">
                <FormattedMessage id="embedder.title.info" />
              </Typography>
              <br />
              <Typography className={classes.infoTitle} variant="h6" component="h2" align="left">
                <FormattedMessage id="embedder.info.title" />
              </Typography>
              <Typography className={classes.infoText} align="left">
                <FormattedMessage id="embedder.info.description" />
                {' '}
                <Link underline="always" href={documentationLink} target="_blank">
                  <FormattedMessage id="embedder.info.link" />
                </Link>
              </Typography>
              <br />
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
                {
                renderMarkerOptionsControl()
              }
                {
                renderListOptionsControl()
              }
              </form>
            </div>

            <div>
              <Divider className={classes.divider} orientation="vertical" aria-hidden />
            </div>

            <div className={classes.previewContainer}>
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
                renderMapControls={renderMapControls}
                bottomList={showUnitList === 'bottom'}
                minHeightWithBottomList={minHeightWithBottomList}
              />

              <EmbedHTML
                classes={classes}
                url={embedUrl}
                createEmbedHTML={createEmbedHTML}
                setBoundsRef={setBoundsRef}
                restrictBounds={restrictBounds}
              />
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
      </div>
    </>
  );
};

EmbedderView.propTypes = {
  citySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    scrollContainer: PropTypes.string,
    previewContainer: PropTypes.string,
    divider: PropTypes.string,
    infoTitle: PropTypes.string,
    infoText: PropTypes.string,
    mapControlContainer: PropTypes.string,
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
