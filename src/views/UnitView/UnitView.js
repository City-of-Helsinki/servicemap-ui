/* eslint-disable no-underscore-dangle */
import styled from '@emotion/styled';
import { Hearing, Mail, OpenInFull, Share } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import Watermark from '@uiw/react-watermark';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import config from '../../../config';
import paths from '../../../config/paths';
import {
  BackButton,
  Container,
  LinkSettingsDialog,
  ReadSpeakerButton,
  RouteBar,
  SearchBar,
  SimpleListItem,
  SMButton,
  TabLists,
  TitleBar,
  TitledList,
} from '../../components';
import { fetchServiceUnits } from '../../redux/actions/services';
import { activateSetting, resetSenseSettings, setMapType } from '../../redux/actions/settings';
import { selectMapRef, selectNavigator } from '../../redux/selectors/general';
import {
  getSelectedUnit,
  selectEvents,
  selectHearingMapsData,
  selectReservations,
  selectSelectedUnitAccessibilitySentencesData,
  selectSelectedUnitIsFetching,
} from '../../redux/selectors/selectedUnit';
import { selectUserPosition } from '../../redux/selectors/user';
import { parseSearchParams } from '../../utils';
import useMobileStatus from '../../utils/isMobile';
import { mapHasMapPane } from '../../utils/mapUtility';
import UnitHelper from '../../utils/unitHelper';
import useLocaleText from '../../utils/useLocaleText';
import MapView from '../MapView';
import AccessibilityInfo from './components/AccessibilityInfo';
import ContactInfo from './components/ContactInfo';
import Description from './components/Description';
import ElectronicServices from './components/ElectronicServices';
import Highlights from './components/Highlights';
import PriceInfo from './components/PriceInfo';
import ReadFeedbackLink from './components/ReadFeedbackLink/ReadFeedbackLink';
import SocialMediaLinks from './components/SocialMediaLinks';
import UnitDataList from './components/UnitDataList';
import UnitLinks from './components/UnitLinks';
import UnitsServicesList from './components/UnitsServicesList';
import { parseUnitViewUrlParams } from './utils/unitViewUrlParamAndSettingsHandler';

const UnitView = (props) => {
  const {
    embed = false,
    match = {},
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchReservations,
    fetchAccessibilitySentences,
    fetchHearingMaps,
  } = props;
  const intl = useIntl();
  const navigator = useSelector(selectNavigator);
  const userLocation = useSelector(selectUserPosition);
  const hearingMaps = useSelector(selectHearingMapsData);
  const reservationsData = useSelector(selectReservations);
  const eventsData = useSelector(selectEvents);
  const accessibilitySentences = useSelector(selectSelectedUnitAccessibilitySentencesData);
  const unitFetching = useSelector(selectSelectedUnitIsFetching);
  const stateUnit = useSelector(getSelectedUnit);
  const map = useSelector(selectMapRef);
  const location = useLocation();
  const checkCorrectUnit = unit => unit && unit.id === parseInt(match.params.unit, 10);

  const [unit, setUnit] = useState(checkCorrectUnit(stateUnit) ? stateUnit : null);
  const viewPosition = useRef(null);

  const isMobile = useMobileStatus();
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const history = useHistory();

  const getImageAlt = () => `${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`;

  function resetUrlSearchParams() {
    const search = new URLSearchParams(location.search);
    search.delete('mobility');
    search.delete('senses');
    search.delete('map');
    history.replace({
      search: search.toString(),
    });
  }

  useEffect(() => {
    const actions = parseUnitViewUrlParams(location.search);
    actions.filter(({ setting }) => setting === 'mobility').forEach(({ setting, value }) => {
      dispatch(activateSetting(setting, value));
    });
    const senses = actions.filter(({ setting }) => setting === 'senses');
    // if a { setting: 'senses', value: null} is returned then this will reset
    if (senses.length) {
      dispatch(resetSenseSettings());
    }
    senses.filter(({ value }) => !!value).forEach(({ value }) => {
      dispatch(activateSetting(value));
    });
    actions.filter(({ setting }) => setting === 'mapType').forEach(({ value }) => {
      dispatch(setMapType(value));
    });
    resetUrlSearchParams();
  }, []);

  const initializePTVAccessibilitySentences = () => {
    if (unit) {
      unit.identifiers.forEach((element) => {
        if (element.namespace === 'ptv') {
          const ptvId = element.value;
          fetchAccessibilitySentences(ptvId);
        }
      });
    }
  };

  const intializeUnitData = () => {
    const { params } = match;
    const unitId = params.unit;
    // If no selected unit data, or selected unit data is old, fetch new data
    if (!stateUnit || !checkCorrectUnit(stateUnit) || !stateUnit.complete) {
      fetchSelectedUnit(unitId, (unit) => {
        setUnit(unit);
        if (unit?.keywords?.fi?.some(keyword => keyword.toLowerCase() === 'kuuluvuuskartta')) {
          fetchHearingMaps(unitId);
        }
      });
      fetchAccessibilitySentences(unitId);
      fetchReservations(unitId);
      fetchUnitEvents(unitId);
    } else {
      // If selected unit data is correct, but some info is missing, fetch them
      if (!accessibilitySentences) {
        fetchAccessibilitySentences(unitId);
      }
      if (!reservationsData.data) {
        fetchReservations(unitId);
      }
      if (!eventsData.data) {
        fetchUnitEvents(unitId);
      }
    }
  };

  const handleServiceFetch = () => {
    // Fetch additional data based on URL parameters
    const searchParams = parseSearchParams(location.search);
    if (searchParams.services) {
      dispatch(fetchServiceUnits(searchParams.services));
    }
  };

  const handleFeedbackClick = () => {
    const URLs = config.additionalFeedbackURLs;
    if (unit.municipality === 'espoo') {
      window.open(getLocaleText(URLs.espoo));
    } else if (unit.municipality === 'vantaa') {
      window.open(getLocaleText(URLs.vantaa));
    } else if (unit.municipality === 'kauniainen') {
      window.open(getLocaleText(URLs.kauniainen));
    } else if (unit.municipality === 'kirkkonummi') {
      window.open(getLocaleText(URLs.kirkkonummi));
    } else {
      navigator.push('unit', { id: unit.id, type: 'feedback' });
    }
  };

  const saveMapPosition = () => {
    // Remember user's map postition to return to on unmount
    if (map && mapHasMapPane(map)) {
      viewPosition.current = {
        center: map.getCenter(),
        zoom: map.getZoom(),
      };
    }
  };

  const feedbackButton = () => (
    <SMButton
      messageID="home.send.feedback"
      icon={<Mail />}
      onClick={() => handleFeedbackClick()}
      margin
      role="link"
      id="UnitFeedbackButton"
    />
  );

  useEffect(() => { // On mount
    intializeUnitData();
    handleServiceFetch();
    saveMapPosition();
    return () => { // On unmount
      // Return map to previous position if returning to search page or service page
      const isSearchPage = paths.search.regex.test(window.location.href);
      const isServicePage = paths.service.regex.test(window.location.href);
      if (map && (isSearchPage || isServicePage)) {
        map.setView(viewPosition?.current?.center, viewPosition?.current?.zoom);
      }
    };
  }, []);

  useEffect(() => { // If unit changes without the component unmounting, update data
    if (unit) {
      intializeUnitData();
    }
  }, [match.params.unit]);

  useEffect(() => {
    if (config.usePtvAccessibilityApi) {
      initializePTVAccessibilitySentences();
    }
  }, [unit]);

  if (embed) {
    return null;
  }

  // Renders hidden title text for readpseaker
  const renderTitleForRS = () => {
    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    return (
      <Typography style={visuallyHidden} aria-hidden>{title}</Typography>
    );
  };

  const getPictureUrlAndCaption = () => {
    if (unit.picture_url) {
      return { pictureUrl: unit.picture_url, pictureCaption: unit.picture_caption };
    }
    const { extra } = unit;
    function splitLineBreakGetFirstItem(extraElement) {
      return extraElement?.split('\n')?.[0];
    }

    if (extra) {
      const pictureUrl = splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoUrl']);
      const pictureCaption = {
        fi: splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoFi']),
        en: splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoEn']),
        sv: splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoSv']),
      };

      if (pictureUrl) {
        const photoSource = splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoSource']);
        const photoPermission = splitLineBreakGetFirstItem(extra?.['kaupunkialusta.photoPermission']);
        return {
          pictureUrl,
          pictureCaption,
          photoSource,
          photoPermission,
        };
      }
    }
    return {};
  };

  const renderPicture = () => {
    const {
      pictureUrl, pictureCaption, photoSource, photoPermission,
    } = getPictureUrlAndCaption();
    if (!pictureUrl) {
      return null;
    }
    const styledImage = <StyledImage alt={getImageAlt()} src={pictureUrl} />;
    return (
      <StyledImageContainer>
        {
          !photoSource
          && styledImage
        }
        {
          photoSource
          && (
            <Watermark
              content={`${photoSource} @ ${photoPermission}`}
              fontWeight="1000"
              fontColor="white"
              rotate="0"
              width="50"
              offsetLeft="0"
              offsetTop="20"
              fontSize="8"
              style={{ background: '#fff', height: '100%' }}
            >
              {styledImage}
            </Watermark>
          )
        }
        {pictureCaption && (
          <StyledImageCaption variant="body2">{getLocaleText(pictureCaption)}</StyledImageCaption>)}
      </StyledImageContainer>
    );
  };

  const renderDetailTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }
    const contractText = UnitHelper.getContractText(unit, intl, getLocaleText);

    let detailReadSpeakerButton = null;

    if (config.showReadSpeakerButton) {
      detailReadSpeakerButton = (
        <StyledReadSpeakerButton
          readID="rscontent-unitdetail"
        />
      );
    }

    return (
      <StyledContentContainer>
        {detailReadSpeakerButton}
        <div id="rscontent-unitdetail">
          {
            renderTitleForRS()
          }
          {/* Contract type */}
          <Container margin text>
            <Typography variant="body2">
              {
                contractText
                && `${contractText}. `
              }
              {
                unit.data_source && unit.contract_type.id !== 'PRIVATE_SERVICE'
                && <FormattedMessage id="unit.data_source" defaultMessage="Source: {data_source}" values={{ data_source: unit.data_source }} />
              }
            </Typography>
          </Container>

          {/* View Components */}
          <ContactInfo unit={unit} userLocation={userLocation} />
          <SocialMediaLinks unit={unit} />
          <UnitDataList
            listLength={3}
            data={eventsData}
            type="events"
          />
          <Highlights unit={unit} />
          <Description unit={unit} />
          <PriceInfo unit={unit} />
          <UnitLinks unit={unit} />
          <ElectronicServices unit={unit} />
          {!isMobile && feedbackButton()}
          {!isMobile && (<ReadFeedbackLink unit={UnitHelper.setDefaults(unit)} />)}
          {isMobile && renderPicture()}
        </div>
      </StyledContentContainer>
    );
  };

  const renderAccessibilityTab = () => {
    let accessibilityReadSpeakerButton = null;

    if (config.showReadSpeakerButton) {
      accessibilityReadSpeakerButton = (
        <StyledReadSpeakerButton
          readID="rscontent"
          encodedURL={encodeURI(`palvelukartta.test.hel.ninja${location.pathname}${location.search}`)}
        />
      );
    }

    return (
      <StyledContentContainer>
        {accessibilityReadSpeakerButton}
        <StyledTabAdjuster id="rscontent">
          {
            renderTitleForRS()
          }
          {hearingMaps?.id === unit.id.toString(10) && (
            <TitledList titleComponent="h4" title={intl.formatMessage({ id: 'unit.accessibility.hearingMaps' })}>
              {hearingMaps.data.map(item => (
                <SimpleListItem
                  role="link"
                  link
                  divider
                  icon={<Hearing />}
                  key={item.name}
                  text={`${item.name} ${intl.formatMessage({ id: 'opens.new.tab' })}`}
                  handleItemClick={() => window.open(item.url)}
                />
              ))}
            </TitledList>
          )}
          <AccessibilityInfo titleAlways headingLevel={4} />
        </StyledTabAdjuster>
      </StyledContentContainer>
    );
  };

  const renderServiceTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <StyledContentContainer>
        <UnitsServicesList
          listLength={5}
          unit={unit}
        />
        <UnitDataList
          listLength={5}
          data={reservationsData}
          type="reservations"
        />
      </StyledContentContainer>
    );
  };

  const renderHead = () => {
    if (!unit || !unit.complete) {
      return null;
    }
    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const imageAlt = getImageAlt();
    const description = unit.description ? getLocaleText(unit.description) : null;

    const { pictureUrl } = getPictureUrlAndCaption();
    return (
      <Helmet>
        <meta property="og:title" content={title} />
        {
          description
          && (
            <meta property="og:description" content={description} />
          )
        }
        {
          pictureUrl
          && (
            <meta property="og:image" content={pictureUrl} />
          )
        }
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image:alt" content={imageAlt} />
      </Helmet>
    );
  };

  const renderUnitLocation = () => (
    <StyledUnitLocationContainer>
      <StyledMapButton
        role="link"
        color="primary"
        aria-label={intl.formatMessage({ id: 'map.button.expand.aria' })}
        icon={<StyledMapIcon />}
        onClick={(e) => {
          e.preventDefault();
          if (navigator) {
            navigator.openMap();
          }
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', fontWeight: '500' }}>
          <FormattedMessage id="map.button.expand" />
        </Typography>
      </StyledMapButton>
      <StyledMapContainer>
        <MapView disableInteraction />
      </StyledMapContainer>
    </StyledUnitLocationContainer>
  );


  const render = () => {
    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const onLinkOpenClick = () => {
      setOpenLinkDialog(true);
    };
    const elem = (
      <StyledLinkButton
        onClick={onLinkOpenClick}
      >
        <Typography fontSize="0.773rem" color="inherit" variant="body2">
          <FormattedMessage id="general.share.link" />
        </Typography>
        <StyledLinkButtonIcon />
      </StyledLinkButton>
    );

    const backButtonText = intl.formatMessage({ id: 'general.backTo' });
    const TopArea = (
      <>
        <BackButton
          text={backButtonText}
          ariaLabel={backButtonText}
          variant="topBackButton"
        />
        {!isMobile && (
          <SearchBar hideBackButton />
        )}
        <TitleBar
          sticky
          title={title}
          titleComponent="h3"
          shareLink={elem}
        />
        {unit?.location?.coordinates && 
          <RouteBar unit={unit} userLocation={userLocation} />
        }
      </> 
    );

    if (unitFetching) {
      return (
        <StyledRootContainer>
          <div className="Content">
            {TopArea}
            <p>
              <FormattedMessage id="general.loading" />
            </p>
          </div>
        </StyledRootContainer>
      );
    }

    if (unit && unit.complete) {
      const tabs = [
        {
          id: 'basicInfo',
          ariaLabel: intl.formatMessage({ id: 'unit.basicInfo' }),
          component: renderDetailTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'unit.basicInfo' }),
        },
        {
          id: 'accessibilityDetails',
          ariaLabel: intl.formatMessage({ id: 'accessibility' }),
          component: renderAccessibilityTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'accessibility' }),
        },
        {
          id: 'services',
          ariaLabel: intl.formatMessage({ id: 'service.tab' }),
          component: renderServiceTab(),
          data: null,
          itemsPerPage: null,
          title: intl.formatMessage({ id: 'service.tab' }),
        },
      ];
      return (
        <div>
          {
            openLinkDialog
            && (
              <LinkSettingsDialog setOpen={setOpenLinkDialog} />
            )
          }
          {
            renderHead()
          }
          <TabLists
            data={tabs}
            headerComponents={(
              <>
                {TopArea}
                {/* Unit image */}
                {
                  isMobile
                    ? renderUnitLocation()
                    : renderPicture()
                }
              </>
          )}
          />
        </div>
      );
    }

    return (
      <StyledRootContainer>
        <div className="Content">
          {TopArea}
          <Typography color="primary" variant="body1">
            <FormattedMessage id="unit.details.notFound" />
          </Typography>
        </div>
      </StyledRootContainer>
    );
  };

  return render();
};

export default UnitView;

const StyledMapIcon = styled(OpenInFull)(({ theme }) => ({
  order: 2,
  marginRight: '-4px',
  paddingLeft: theme.spacing(1),
  fontSize: '18px',
}));

const StyledRootContainer = styled.div(() => ({
  height: '100%',
  display: 'flex',
  flexFlow: 'column',
  overflowY: 'auto',
}));

const StyledContentContainer = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledTabAdjuster = styled.div(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledReadSpeakerButton = styled(ReadSpeakerButton)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
}));

const preventOpenImageInNewTabClass = () => ({
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 99,
  },
});

const StyledImageContainer = styled.div(() => {
  const styles = {
    width: '100%',
    height: 200,
    position: 'relative',
  };
  return Object.assign(styles, preventOpenImageInNewTabClass());
});

const StyledImage = styled.img(() => ({
  objectFit: 'cover',
  height: '100%',
  width: '100%',
}));

const StyledImageCaption = styled(Typography)(({ theme }) => ({
  width: '100%',
  minHeight: 31,
  fontSize: '0.75rem',
  lineHeight: '15px',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  bottom: 0,
  left: 0,
  color: '#000',
  backgroundColor: '#F0F0F0',
  boxSizing: 'border-box',
  textAlign: 'left',
}));

const StyledUnitLocationContainer = styled.div(() => ({
  height: 225,
  position: 'relative',
}));

const StyledMapButton = styled(SMButton)(({ theme }) => ({
  position: 'absolute',
  right: 16,
  margin: 0,
  top: 16,
  zIndex: 51,
  minHeight: 36,
  borderRadius: '8px',
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.75),
}));

const StyledMapContainer = styled.div(() => ({
  height: '100%',
  pointerEvents: 'none',
}));

const StyledLinkButton = styled(Button)(() => ({
  color: 'white',
  textTransform: 'none',
  marginLeft: 'auto',
}));

const StyledLinkButtonIcon = styled(Share)(({ theme }) => ({
  fontSize: 24,
  marginLeft: theme.spacing(1.5),
}));

// Typechecking
UnitView.propTypes = {
  embed: PropTypes.bool,
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  fetchHearingMaps: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
};
