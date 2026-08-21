import React from 'react';

import addressLocationIcon from '../../assets/icons/addressLocation.svg';
import closeIcon from '../../assets/icons/closeIcon.svg';
import coordinateMarker from '../../assets/icons/CoordinateMarker.svg';
import coordinateMarkerContrast from '../../assets/icons/CoordinateMarkerContrast.svg';
import facebookIcon from '../../assets/icons/facebook_icon.svg';
import arrowNextIcon from '../../assets/icons/icon-arrow-next.svg';
import arrowPreviousIcon from '../../assets/icons/icon-arrow-previous.svg';
import aerialMapIcon from '../../assets/icons/iconAerialMap.svg';
import defaulMapIcon from '../../assets/icons/iconDefaultMap.svg';
import guideMapIcon from '../../assets/icons/iconGuideMap.svg';
import servicemapLogoIcon from '../../assets/icons/IconPalvelukarttaPrimary.svg';
import accessibilityIcon from '../../assets/icons/inlineSVGs/iconAccessibility';
import feedbackIcon from '../../assets/icons/inlineSVGs/iconFeedback';
import helpIcon from '../../assets/icons/inlineSVGs/iconHelp';
import locationIcon from '../../assets/icons/inlineSVGs/iconLocation';
import serviceListIcon from '../../assets/icons/inlineSVGs/iconServiceList';
import instagramIcon from '../../assets/icons/insta_icon.svg';
import kirkkonummiIcon from '../../assets/icons/kirkkonummiIcon.svg';
import pinterestIcon from '../../assets/icons/pinterest_icon.svg';
import serviceIcon from '../../assets/icons/serviceIcon.svg';
import serviceIconDark from '../../assets/icons/serviceIconDark.svg';
import snapchatIcon from '../../assets/icons/snap_icon.svg';
import twitterIcon from '../../assets/icons/twitter_icon.svg';
import userLocationIcon from '../../assets/icons/userLocation.svg';
import vimeoIcon from '../../assets/icons/vimeo_icon.svg';
import noWheelchairIcon from '../../assets/icons/wheelchair.svg';
import youtubeIcon from '../../assets/icons/youtube_icon.svg';
import SMIcon from './SMIcon';

/**
 * Senses
 */
export function HearingIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-hearing-aid" {...rest} />;
}

export function ColorblindIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-colour-blind" {...rest} />;
}

export function VisualImpairmentIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-visually-impaired" {...rest} />;
}

/**
 * Mobility
 */
export function OnFootIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-by-foot" {...rest} />;
}

export function ReducedMobilityIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-reduced-mobility" {...rest} />;
}

export function StrollerIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-stroller" {...rest} />;
}

export function WheelchairIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-wheelchair" {...rest} />;
}

export function RollatorIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-rollator" {...rest} />;
}

/**
 * General
 */
export function AreaIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-areas-and-districts" {...rest} />;
}
export function AddressIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-address" {...rest} />;
}

export function MapIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-map-options" {...rest} />;
}

export function SearchIcon({ ...rest }) {
  return <SMIcon icon="icon-icon-search" {...rest} />;
}

// Icon lookup map used by getIcon
const iconMap = {
  foot: (props) => <OnFootIcon {...props} />,
  colorblind: (props) => <ColorblindIcon {...props} />,
  hearingAid: (props) => <HearingIcon {...props} />,
  visuallyImpaired: (props) => <VisualImpairmentIcon {...props} />,
  reduced_mobility: (props) => <ReducedMobilityIcon {...props} />,
  rollator: (props) => <RollatorIcon {...props} />,
  wheelchair: (props) => <WheelchairIcon {...props} />,
  stroller: (props) => <StrollerIcon {...props} />,

  // Map types
  servicemap: (props) => (
    <img aria-hidden alt="" src={defaulMapIcon} {...props} />
  ),
  ortographic: (props) => (
    <img aria-hidden alt="" src={aerialMapIcon} {...props} />
  ),
  guideMap: (props) => <img aria-hidden alt="" src={guideMapIcon} {...props} />,
  accessible_map: (props) => (
    <img aria-hidden alt="" src={defaulMapIcon} {...props} />
  ),
  plainmap: (props) => (
    <img aria-hidden alt="" src={defaulMapIcon} {...props} />
  ),

  // Front page buttons
  location: () => locationIcon(),
  accessibility: () => accessibilityIcon(),
  serviceList: () => serviceListIcon(),
  feedback: () => feedbackIcon(),
  help: () => helpIcon(),

  // Social media links
  facebook: (props) => <img aria-hidden alt="" src={facebookIcon} {...props} />,
  instagram: (props) => (
    <img aria-hidden alt="" src={instagramIcon} {...props} />
  ),
  pinterest: (props) => (
    <img aria-hidden alt="" src={pinterestIcon} {...props} />
  ),
  snapchat: (props) => <img aria-hidden alt="" src={snapchatIcon} {...props} />,
  twitter: (props) => <img aria-hidden alt="" src={twitterIcon} {...props} />,
  youtube: (props) => <img aria-hidden alt="" src={youtubeIcon} {...props} />,
  vimeo: (props) => <img aria-hidden alt="" src={vimeoIcon} {...props} />,

  service: (props) => <img aria-hidden alt="" src={serviceIcon} {...props} />,
  serviceDark: (props) => (
    <img aria-hidden alt="" src={serviceIconDark} {...props} />
  ),
  locationMarker: (props) => (
    <img aria-hidden alt="" src={userLocationIcon} {...props} />
  ),
  addresslocationMarker: (props) => (
    <img aria-hidden alt="" src={addressLocationIcon} {...props} />
  ),

  noWheelchair: (props) => (
    <img aria-hidden alt="" src={noWheelchairIcon} {...props} />
  ),

  servicemapLogoIcon: (props) => (
    <img aria-hidden alt="" src={servicemapLogoIcon} {...props} />
  ),
  closeIcon: (props) => <img aria-hidden alt="" src={closeIcon} {...props} />,
  coordinateMarker: (props) => (
    <img aria-hidden alt="" src={coordinateMarker} {...props} />
  ),
  coordinateMarkerContrast: (props) => (
    <img aria-hidden alt="" src={coordinateMarkerContrast} {...props} />
  ),

  kirkkonummiIcon: (props) => (
    <img aria-hidden alt="" src={kirkkonummiIcon} {...props} />
  ),

  iconArrowPrevious: (props) => (
    <img aria-hidden alt="" src={arrowPreviousIcon} {...props} />
  ),
  iconArrowNext: (props) => (
    <img aria-hidden alt="" src={arrowNextIcon} {...props} />
  ),
};

// Function to get right icon based on key mapping
export const getIcon = (key, props) => {
  const renderIcon = iconMap[key];
  return renderIcon ? renderIcon(props) : null;
};
