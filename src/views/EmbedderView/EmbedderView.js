import styled from '@emotion/styled';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import URI from 'urijs';

import config from '../../../config';
import paths from '../../../config/paths';
import { CloseButton, SMButton } from '../../components';
import TopBar from '../../components/TopBar';
import { selectNavigator } from '../../redux/selectors/general';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { selectServiceCurrent } from '../../redux/selectors/service';
import {
  selectMapType,
  selectSelectedCities,
  selectSelectedOrganizations,
} from '../../redux/selectors/settings';
import { getLocale, getPage } from '../../redux/selectors/user';
import isClient, { uppercaseFirst } from '../../utils';
import useLocaleText from '../../utils/useLocaleText';
import EmbedController from './components/EmbedController';
import EmbedHTML from './components/EmbedHTML';
import IFramePreview from './components/IFramePreview';
import embedderConfig from './embedderConfig';
import * as smurl from './utils/url';
import { getEmbedURL, getLanguage } from './utils/utils';

const hideCitiesAndOrgsIn = [paths.unit.regex, paths.address.regex];

const hideServicesIn = [
  paths.search.regex,
  paths.unit.regex,
  paths.service.regex,
  paths.address.regex,
  paths.area.regex,
];

/**
 * @param embedUrl (or normal url)
 */
const showCitiesAndOrganisations = (embedUrl) => {
  if (typeof embedUrl !== 'string') {
    return false;
  }
  const originalUrl = embedUrl.replace('/embed', '');
  return hideCitiesAndOrgsIn.every((r) => !r.test(originalUrl));
};

// Timeout for handling width and height input changes
// only once user stops typing
let timeout;
const timeoutDelay = 1000;
const documentationLink = config.embedderDocumentationUrl;
const { topBarHeight } = config;

function EmbedderView() {
  const intl = useIntl();
  const mapType = useSelector(selectMapType);
  const navigator = useSelector(selectNavigator);
  const selectedCities = useSelector(selectSelectedCities);
  const page = useSelector(getPage);
  const selectedUnit = useSelector(getSelectedUnit);
  const currentService = useSelector(selectServiceCurrent);
  const selectedOrgs = useSelector(selectSelectedOrganizations);
  // Verify url
  const data = isClient() ? smurl.verify(window.location.href) : {};
  let { url } = data;
  const { ratio } = data;
  if (url) {
    url = smurl.strip(url);
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
  const defaultFixedHeight = embedderConfig.DEFAULT_CUSTOM_WIDTH;
  const iframeConfig = embedderConfig.DEFAULT_IFRAME_PROPERTIES || {};
  const defaultService = 'none';

  const getLocaleText = useLocaleText();
  const userLocale = useSelector(getLocale);

  function getInitialCities() {
    const city1 = search?.city;
    if (!showCitiesAndOrganisations(url) || city1 === '') {
      return [];
    }
    return city1?.split(',') || selectedCities || [];
  }

  function getInitialOrgs() {
    const organization1 = search?.organization;
    if (!showCitiesAndOrganisations(url) || organization1 === '') {
      return [];
    }
    const urlParamOrgs = organization1
      ?.split(',')
      ?.map((orgId) => config.organizations.find((org) => org.id === orgId))
      ?.filter((org) => org);
    return urlParamOrgs || selectedOrgs || [];
  }

  // States
  const [language, setLanguage] = useState(defaultLanguage);
  const [map, setMap] = useState(defaultMap);
  const [city, setCity] = useState(getInitialCities());
  const [organization, setOrganization] = useState(getInitialOrgs());
  const [service, setService] = useState(defaultService);
  const [customWidth, setCustomWidth] = useState(
    embedderConfig.DEFAULT_CUSTOM_WIDTH || 100
  );
  const [widthMode, setWidthMode] = useState('auto');
  const [fixedHeight, setFixedHeight] = useState(defaultFixedHeight);
  const [ratioHeight, setRatioHeight] = useState(initialRatio);
  const [heightMode, setHeightMode] = useState('ratio');
  const [transit, setTransit] = useState(false);
  const [showUnits, setShowUnits] = useState(true);
  const [restrictBounds, setRestrictBounds] = useState(true);
  const [showUnitList, setShowUnitList] = useState('none');

  const boundsRef = useRef([]);
  const dialogRef = useRef();

  const selectedBbox = restrictBounds && boundsRef.current;

  const minHeightWithBottomList = '478px';

  const embedUrl = getEmbedURL(url, {
    language,
    map,
    city,
    organization,
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
  const createEmbedHTML = useCallback(
    (url) => {
      const showListBottom = showUnitList === 'bottom';
      if (!url) {
        return '';
      }
      const renderWrapperStyle = () =>
        showListBottom
          ? `position: relative; width:100%; padding-bottom: max(${ratioHeight}%, ${minHeightWithBottomList});`
          : `position: relative; width:100%; padding-bottom:${ratioHeight}%;`;
      let height;
      let html;
      if (heightMode === 'fixed') {
        height = fixedHeight;
      }
      if (heightMode === 'ratio') {
        if (widthMode === 'auto') {
          html = `<div style="${renderWrapperStyle()}">
            <iframe
              title="${iframeTitle}"
              style="position: absolute; top: 0; left: 0; border: none; width: 100%; height: 100%;"
              src="${url}"
            ></iframe>
          </div>`;
        } else {
          height = parseInt(
            parseInt(customWidth, 10) * (parseInt(ratioHeight, 10) / 100.0),
            10
          );
        }
      }

      if (height) {
        const width =
          widthMode !== 'custom'
            ? iframeConfig.style &&
              iframeConfig.style.width &&
              iframeConfig.style.width
            : customWidth;
        const widthUnit = width !== '100%' ? 'px' : '';
        const heightValue = showListBottom
          ? `height: max(${height}px, ${minHeightWithBottomList})`
          : `height: ${height}px`;
        html = `<iframe title="${iframeTitle}" style="border: none; width: ${width}${widthUnit}; ${heightValue};"
                  src="${url}"></iframe>`;
      }
      return html;
    },
    [
      customWidth,
      fixedHeight,
      heightMode,
      iframeTitle,
      widthMode,
      ratioHeight,
      iframeConfig.style,
      showUnitList,
    ]
  );

  const showServices = (embedUrl) => {
    if (typeof embedUrl !== 'string') {
      return false;
    }
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
    const description = (locale) =>
      intl.formatMessage({ id: `embedder.language.description.${locale}` });
    const languageControls = (generateLabel) =>
      Object.keys(embedderConfig.LANGUAGES).map((lang) => ({
        value: lang,
        label: `${uppercaseFirst(embedderConfig.LANGUAGES[userLocale][lang])}. ${generateLabel(lang)}`,
      }));

    return (
      <EmbedController
        titleID="embedder.language.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({
          id: 'embedder.language.aria.label',
        })}
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
    const getLabel = (map) => intl.formatMessage({ id: `settings.map.${map}` });
    const mapControls = (generateLabel) =>
      embedderConfig.BACKGROUND_MAPS.map((map) => ({
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
    if (!showCitiesAndOrganisations(embedUrl)) {
      return null;
    }
    const cities = city;
    const cityControls = embedderConfig.CITIES.filter((v) => v).map((city) => ({
      key: city,
      value: !!cities.includes(city),
      label: uppercaseFirst(city),
      icon: null,
      onChange: (v) => {
        if (v) {
          setCity([...cities, city]);
        } else {
          setCity(cities.filter((value) => value !== city));
        }
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
   * Render organization controls
   */
  const renderOrganizationControl = () => {
    if (!showCitiesAndOrganisations(embedUrl)) {
      return null;
    }
    const organizations = organization;
    const organizationControls = embedderConfig.ORGANIZATIONS.map((org) => ({
      key: org.id,
      value: !!organizations.some((value) => value.id === org.id),
      label: uppercaseFirst(getLocaleText(org.name)),
      icon: null,
      onChange: (v) => {
        if (v) {
          setOrganization([...organizations, org]);
        } else {
          setOrganization(organizations.filter((value) => value.id !== org.id));
        }
      },
    }));

    return (
      <EmbedController
        titleID="embedder.organization.title"
        titleComponent="h2"
        checkboxControls={organizationControls}
        checkboxLabelledBy="embedder.organization.title"
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
    const getLabel = (service) =>
      intl.formatMessage({ id: `embedder.service.${service}` });
    const serviceControls = (generateLabel) =>
      ['none', 'common', 'all'].map((service) => ({
        value: service,
        label: generateLabel(service),
      }));

    return (
      <EmbedController
        titleID="embedder.service.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({
          id: 'embedder.service.aria.label',
        })}
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
    const ariaLabel =
      widthMode === 'custom'
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
    const ariaLabel =
      heightMode === 'fixed'
        ? intl.formatMessage({ id: 'embedder.height.input.aria.fixed' })
        : intl.formatMessage({ id: 'embedder.height.input.aria.ratio' });

    return (
      <EmbedController
        titleID="embedder.height.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({
          id: 'embedder.height.aria.label',
        })}
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

  const renderMapControls = useCallback(
    () => (
      <StyledMapControlContainer>
        {/* Map bounds */}
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={!!restrictBounds}
              value="bounds"
              onChange={() => setRestrictBounds(!restrictBounds)}
            />
          }
          label={<FormattedMessage id="embedder.options.label.bbox" />}
        />
      </StyledMapControlContainer>
    ),
    [restrictBounds]
  );

  const renderMarkerOptionsControl = () => {
    const controls = [
      {
        key: 'units',
        value: showUnits,
        onChange: (v) => setShowUnits(v),
        icon: null,
        labelId: 'embedder.options.label.units',
      },
      {
        key: 'transit',
        value: transit,
        onChange: (v) => setTransit(v),
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
      {
        label: intl.formatMessage({ id: 'embedder.options.label.list.none' }),
        value: 'none',
      },
      {
        label: intl.formatMessage({ id: 'embedder.options.label.list.side' }),
        value: 'side',
      },
      {
        label: intl.formatMessage({ id: 'embedder.options.label.list.bottom' }),
        value: 'bottom',
      },
    ];

    return (
      <EmbedController
        titleID="embedder.options.list.title"
        titleComponent="h2"
        radioAriaLabel={intl.formatMessage({
          id: 'embedder.options.list.title',
        })}
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
        {renderHeadInfo()}
        <StyledContainer>
          <StyledTitleContainer>
            <StyledCloseButton
              aria-label={intl.formatMessage({ id: 'embedder.close' })}
              onClick={closeView}
              role="link"
              textID="embedder.close"
              data-sm="EmbedderToolCloseButton"
            />
            <StyledTitle align="left" variant="h1" data-sm="EmbedderToolTitle">
              <FormattedMessage id="embedder.title" />
            </StyledTitle>
          </StyledTitleContainer>
          <StyledScrollContainer>
            <StyledFormContainer>
              <StyledInfoText align="left" variant="body2">
                <FormattedMessage id="embedder.title.info" />
              </StyledInfoText>
              <br />
              <StyledInfoTitle variant="h6" component="h2" align="left">
                <FormattedMessage id="embedder.info.title" />
              </StyledInfoTitle>
              <StyledInfoText align="left">
                <FormattedMessage id="embedder.info.description" />{' '}
                <Link
                  underline="always"
                  href={documentationLink}
                  target="_blank"
                >
                  <FormattedMessage id="embedder.info.link" />
                </Link>
              </StyledInfoText>
              <br />
              <form>
                {renderLanguageControl()}
                {renderServiceControl()}
                {renderMapTypeControl()}
                {renderCityControl()}
                {renderOrganizationControl()}
                {renderWidthControl()}
                {renderHeightControl()}
                {renderMarkerOptionsControl()}
                {renderListOptionsControl()}
              </form>
            </StyledFormContainer>

            <div>
              <StyledDivider orientation="vertical" aria-hidden />
            </div>

            <StyledPreviewContainer>
              <IFramePreview
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
                url={embedUrl}
                createEmbedHTML={createEmbedHTML}
                setBoundsRef={setBoundsRef}
                restrictBounds={restrictBounds}
              />
              <StyledButton
                aria-label={intl.formatMessage({ id: 'embedder.close' })}
                small
                role="link"
                onClick={closeView}
                messageID="embedder.close"
              />
            </StyledPreviewContainer>
          </StyledScrollContainer>
        </StyledContainer>
      </div>
    </>
  );
}
const StyledMapControlContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
const StyledContainer = styled('div')(() => ({
  display: 'inline-flex',
  flexDirection: 'column',
  margin: 0,
  height: `calc(100vh - ${topBarHeight}px)`,
}));
const StyledTitleContainer = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  paddingTop: 0,
  paddingLeft: '9.5vw',
  paddingRight: '9.5vw',
  paddingBottom: theme.spacing(3),
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
}));
const StyledScrollContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
}));
const StyledFormContainer = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  marginTop: 0,
  width: '45%',
  height: '100%',
  overflowY: 'auto',
  paddingLeft: '9.5vw',
  paddingRight: theme.spacing(3),
}));
const StyledInfoText = styled(Typography)(() => ({
  whiteSpace: 'pre-line',
  lineHeight: '1.5rem',
}));
const StyledCloseButton = styled(CloseButton)(() => ({
  marginLeft: 'auto',
}));
const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  width: '100%',
}));
const StyledInfoTitle = styled(Typography)(() => ({
  lineHeight: '2rem',
}));
const StyledDivider = styled(Divider)(() => ({
  width: 4,
}));
const StyledPreviewContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '55%',
  height: '100%',
  overflowY: 'auto',
  marginLeft: theme.spacing(3),
  marginRight: '6.5vw',
  paddingRight: theme.spacing(2),
}));
const StyledButton = styled(SMButton)(({ theme }) => ({
  width: 'fit-content',
  alignSelf: 'flex-end',
  margin: 0,
  marginTop: 'auto',
  marginBottom: theme.spacing(2),
}));

export default EmbedderView;
