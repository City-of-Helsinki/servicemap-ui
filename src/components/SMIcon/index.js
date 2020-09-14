import React from 'react';
import SMIcon from './SMIcon';
import defaulMapIcon from '../../assets/icons/iconDefaultMap.svg';
import aerialMapIcon from '../../assets/icons/iconAerialMap.svg';
import guideMapIcon from '../../assets/icons/iconGuideMap.svg';
import locationIcon from '../../assets/icons/inlineSVGs/iconLocation';
import accessibilityIcon from '../../assets/icons/inlineSVGs/iconAccessibility';
import serviceListIcon from '../../assets/icons/inlineSVGs/iconServiceList';
import feedbackIcon from '../../assets/icons/inlineSVGs/iconFeedback';
import helpIcon from '../../assets/icons/inlineSVGs/iconHelp';
import facebookIcon from '../../assets/icons/facebook_icon.svg';
import instagramIcon from '../../assets/icons/insta_icon.svg';
import pinterestIcon from '../../assets/icons/pinterest_icon.svg';
import snapchatIcon from '../../assets/icons/snap_icon.svg';
import twitterIcon from '../../assets/icons/twitter_icon.svg';
import youtubeIcon from '../../assets/icons/youtube_icon.svg';
import vimeoIcon from '../../assets/icons/vimeo_icon.svg';
import userLocationIcon from '../../assets/icons/userLocation.svg';
import noWheelchairIcon from '../../assets/icons/wheelchair.svg';
import serviceIcon from '../../assets/icons/serviceIcon.svg';
import serviceIconDark from '../../assets/icons/serviceIconDark.svg';

/**
 * Senses
 */
export const HearingIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-hearing-aid" {...rest} />
);

export const ColorblindIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-colour-blind" {...rest} />
);

export const VisualImpairmentIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-visually-impaired" {...rest} />
);

/**
 * Mobility
 */
export const OnFootIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-by-foot" {...rest} />
);

export const ReducedMobilityIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-reduced-mobility" {...rest} />
);

export const StrollerIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-stroller" {...rest} />
);

export const WheelchairIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-wheelchair" {...rest} />
);

export const RollatorIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-rollator" {...rest} />
);

/**
 * General
 */
export const AreaIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-areas-and-districts" {...rest} />
);
export const AddressIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-address" {...rest} />
);

export const MapIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-map-options" {...rest} />
);

export const SearchIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-search" {...rest} />
);

// Function to get right icon based on key mapping
export const getIcon = (key, props) => {
  switch (key) {
    case 'foot':
      return <OnFootIcon {...props} />;
    case 'colorblind':
      return <ColorblindIcon {...props} />;
    case 'hearingAid':
      return <HearingIcon {...props} />;
    case 'visuallyImpaired':
      return <VisualImpairmentIcon {...props} />;
    case 'reduced_mobility':
      return <ReducedMobilityIcon {...props} />;
    case 'rollator':
      return <RollatorIcon {...props} />;
    case 'wheelchair':
      return <WheelchairIcon {...props} />;
    case 'stroller':
      return <StrollerIcon {...props} />;

    // Map types
    case 'servicemap':
      return <img aria-hidden alt="" src={defaulMapIcon} {...props} />;
    case 'ortographic':
      return <img aria-hidden alt="" src={aerialMapIcon} {...props} />;
    case 'guideMap':
      return <img aria-hidden alt="" src={guideMapIcon} {...props} />;
    case 'accessible_map':
      return <img aria-hidden alt="" src={defaulMapIcon} {...props} />;

    // Front page buttons
    case 'location':
      return locationIcon();
    case 'accessibility':
      return accessibilityIcon();
    case 'serviceList':
      return serviceListIcon();
    case 'feedback':
      return feedbackIcon();
    case 'help':
      return helpIcon();

    // Social media links
    case 'facebook':
      return <img aria-hidden alt="" src={facebookIcon} {...props} />;
    case 'instagram':
      return <img aria-hidden alt="" src={instagramIcon} {...props} />;
    case 'pinterest':
      return <img aria-hidden alt="" src={pinterestIcon} {...props} />;
    case 'snapchat':
      return <img aria-hidden alt="" src={snapchatIcon} {...props} />;
    case 'twitter':
      return <img aria-hidden alt="" src={twitterIcon} {...props} />;
    case 'youtube':
      return <img aria-hidden alt="" src={youtubeIcon} {...props} />;
    case 'vimeo':
      return <img aria-hidden alt="" src={vimeoIcon} {...props} />;

    case 'service':
      return <img aria-hidden alt="" src={serviceIcon} {...props} />;

    case 'serviceDark':
      return <img aria-hidden alt="" src={serviceIconDark} {...props} />;
    case 'locationMarker':
      return <img aria-hidden alt="" src={userLocationIcon} {...props} />;

    case 'noWheelchair':
      return <img aria-hidden alt="" src={noWheelchairIcon} {...props} />;

    default:
      return null;
  }
};
