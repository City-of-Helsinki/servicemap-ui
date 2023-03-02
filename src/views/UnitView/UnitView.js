/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
  Mail, Hearing, Share, OpenInFull,
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import {
  AcceptSettingsDialog,
  AddressIcon,
  Container,
  LinkSettingsDialog,
  ReadSpeakerButton,
  SearchBar,
  SimpleListItem,
  SMButton,
  TabLists,
  TitleBar,
  TitledList,
} from '../../components';
import AccessibilityInfo from './components/AccessibilityInfo';
import ContactInfo from './components/ContactInfo';
import Highlights from './components/Highlights';
import ElectronicServices from './components/ElectronicServices';
import Description from './components/Description';
import SocialMediaLinks from './components/SocialMediaLinks';
import UnitLinks from './components/UnitLinks';
import config from '../../../config';
import useMobileStatus from '../../utils/isMobile';
import UnitHelper from '../../utils/unitHelper';
import useLocaleText from '../../utils/useLocaleText';
import paths from '../../../config/paths';
import SettingsUtility from '../../utils/settings';
import UnitDataList from './components/UnitDataList';
import UnitsServicesList from './components/UnitsServicesList';
import PriceInfo from './components/PriceInfo';
import { parseSearchParams } from '../../utils';
import { fetchServiceUnits } from '../../redux/actions/services';
import MapView from '../MapView';
import BackButton from "../../components/BackButton";

const UnitView = (props) => {
  const {
    distance,
    stateUnit,
    intl,
    classes,
    embed,
    navigator,
    match,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchReservations,
    fetchAccessibilitySentences,
    fetchHearingMaps,
    accessibilitySentences,
    eventsData,
    reservationsData,
    hearingMaps,
    unitFetching,
    userLocation,
    location,
  } = props;
  const checkCorrectUnit = unit => unit && unit.id === parseInt(match.params.unit, 10);

  const [unit, setUnit] = useState(checkCorrectUnit(stateUnit) ? stateUnit : null);
  const viewPosition = useRef(null);

  const isMobile = useMobileStatus();
  const [openAcceptSettingsDialog, setOpenAcceptSettingsDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();

  const map = useSelector(state => state.mapRef);

  const shouldShowAcceptSettingsDialog = () => {
    const search = new URLSearchParams(location.search);
    const mobility = search.get('mobility');
    const senses = search.get('senses')?.split(',') || [];
    const mobilityValid = !!(mobility && SettingsUtility.isValidMobilitySetting(mobility));
    const sensesValid = senses.filter(
      s => SettingsUtility.isValidAccessibilitySenseImpairment(s),
    ).length > 0;
    if (mobilityValid || sensesValid) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setOpenAcceptSettingsDialog(shouldShowAcceptSettingsDialog());
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
        if (unit?.keywords?.fi?.includes('kuuluvuuskartta')) {
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
      window.open(URLs.espoo);
    } else if (unit.municipality === 'vantaa') {
      window.open(URLs.vantaa);
    } else if (unit.municipality === 'kauniainen') {
      window.open(URLs.kauniainen);
    } else if (unit.municipality === 'kirkkonummi') {
      window.open(URLs.kirkkonummi);
    } else {
      navigator.push('unit', { id: unit.id, type: 'feedback' });
    }
  };

  const saveMapPosition = () => {
    // Remember user's map postition to return to on unmount
    if (map) {
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
        map.setView(viewPosition.current.center, viewPosition.current.zoom);
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

  const renderDetailTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }
    const contractText = UnitHelper.getContractText(unit, intl, getLocaleText);

    let detailReadSpeakerButton = null;

    if (config.showReadSpeakerButton) {
      detailReadSpeakerButton = (
        <ReadSpeakerButton
          className={classes.rsButton}
          readID="rscontent-unitdetail"
        />
      );
    }

    return (
      <div className={classes.content}>
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
                unit.data_source
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
            navigator={navigator}
          />
          <Highlights unit={unit} />
          <Description unit={unit} />
          <PriceInfo unit={unit} />
          <UnitLinks unit={unit} />
          <ElectronicServices unit={unit} />
          {!isMobile && feedbackButton()}
        </div>
      </div>
    );
  };

  const renderAccessibilityTab = () => {
    let accessibilityReadSpeakerButton = null;

    if (config.showReadSpeakerButton) {
      accessibilityReadSpeakerButton = (
        <ReadSpeakerButton
          className={classes.rsButton}
          readID="rscontent"
          encodedURL={encodeURI(`palvelukartta.test.hel.ninja${location.pathname}${location.search}`)}
        />
      );
    }

    return (
      <div className={classes.content}>
        {accessibilityReadSpeakerButton}
        <div id="rscontent" className={classes.aTabAdjuster}>
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
                  text={`${item.name} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
                  handleItemClick={() => window.open(item.url)}
                />
              ))}
            </TitledList>
          )}
          <AccessibilityInfo titleAlways headingLevel={4} />
        </div>
      </div>
    );
  };

  const renderServiceTab = () => {
    if (!unit || !unit.complete) {
      return <></>;
    }

    return (
      <div className={classes.content}>
        <UnitsServicesList
          listLength={5}
          unit={unit}
          navigator={navigator}
        />
        <UnitDataList
          listLength={5}
          data={reservationsData}
          type="reservations"
          navigator={navigator}
        />
      </div>
    );
  };


  const renderHead = () => {
    if (!unit || !unit.complete) {
      return null;
    }
    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const imageAlt = `${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`;
    const description = unit.description ? getLocaleText(unit.description) : null;

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
          unit.picture_url
          && (
            <meta property="og:image" content={unit.picture_url} />
          )
        }
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image:alt" content={imageAlt} />
      </Helmet>
    );
  };

  const renderUnitLocation = () => (
    <div className={classes.unitLocationContainer}>
      <SMButton
        role="link"
        color="primary"
        className={classes.mapButton}
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
      </SMButton>
      <div className={classes.mapContainer}>
        <MapView disableInteraction />
      </div>
    </div>
  );

  const render = () => {
    const title = unit && unit.name ? getLocaleText(unit.name) : '';
    const onLinkOpenClick = () => {
      setOpenLinkDialog(true);
    };
    const elem = (
      <Button
        className={classes.linkButton}
        onClick={onLinkOpenClick}
      >
        <Typography fontSize="0.773rem" color="inherit" variant="body2">
          <FormattedMessage id="general.share.link" />
        </Typography>
        <Share className={classes.linkButtonIcon} />
      </Button>
    );

    const backButtonText = intl.formatMessage({id: 'general.backTo'});
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
      </>
    );

    if (unitFetching) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopArea}
            <p>
              <FormattedMessage id="general.loading" />
            </p>
          </div>
        </div>
      );
    }

    if (unit && unit.complete) {
      const imageAlt = `${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`;
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
            openAcceptSettingsDialog
            && (
              <AcceptSettingsDialog setOpen={setOpenAcceptSettingsDialog} />
            )
          }
          {
            !openAcceptSettingsDialog
            && openLinkDialog
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
                    ? renderUnitLocation(unit)
                    : unit.picture_url && (
                      <div className={classes.imageContainer}>
                        <img
                          className={classes.image}
                          alt={imageAlt}
                          src={unit.picture_url}
                        />
                        {
                          unit.picture_caption
                          && (
                            <Typography variant="body2" className={classes.imageCaption}>{getLocaleText(unit.picture_caption)}</Typography>
                          )
                        }
                      </div>
                    )
                }
              </>
          )}
          />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <div className="Content">
          {TopArea}
          <Typography color="primary" variant="body1">
            <FormattedMessage id="unit.details.notFound" />
          </Typography>
        </div>
      </div>
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

// Typechecking
UnitView.propTypes = {
  accessibilitySentences: PropTypes.objectOf(PropTypes.any),
  distance: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['m', 'km']),
    text: PropTypes.string,
  }),
  unit: PropTypes.objectOf(PropTypes.any),
  embed: PropTypes.bool,
  eventsData: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  unitFetching: PropTypes.bool.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  reservations: PropTypes.arrayOf(PropTypes.any),
  userLocation: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitView.defaultProps = {
  accessibilitySentences: null,
  distance: null,
  embed: false,
  eventsData: { events: null, unit: null },
  unit: null,
  match: {},
  map: null,
  navigator: null,
  reservations: null,
  userLocation: null,
};
