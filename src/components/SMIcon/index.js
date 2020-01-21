import React from 'react';
import SMIcon from './SMIcon';
import defaulMapIcon from '../../assets/images/iconDefaultMap.svg';
import aerialMapIcon from '../../assets/images/iconAerialMap.svg';
import guideMapIcon from '../../assets/images/iconGuideMap.svg';
import locationIcon from '../../assets/images/iconLocation.svg';
import accessibilityIcon from '../../assets/images/iconAccessibility.svg';
import serviceListIcon from '../../assets/images/iconServiceList.svg';
import feedbackIcon from '../../assets/images/iconFeedback.svg';
import helpIcon from '../../assets/images/iconHelp.svg';
import facebookIcon from '../../assets/images/facebook_icon.svg';
import instagramIcon from '../../assets/images/insta_icon.svg';
import pinterestIcon from '../../assets/images/pinterest_icon.svg';
import snapchatIcon from '../../assets/images/snap_icon.svg';
import twitterIcon from '../../assets/images/twitter_icon.svg';
import youtubeIcon from '../../assets/images/youtube_icon.svg';
import vimeoIcon from '../../assets/images/vimeo_icon.svg';

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
 * Cities
 */
export const HelsinkiIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-coat-of-arms-helsinki" {...rest} />
);

export const EspooIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-coat-of-arms-espoo" {...rest} />
);

export const VantaaIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-coat-of-arms-vantaa" {...rest} />
);

export const KauniainenIcon = ({ ...rest }) => (
  <SMIcon icon="icon-icon-coat-of-arms-kauniainen" {...rest} />
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
    case 'orthoImage':
      return <img aria-hidden alt="" src={aerialMapIcon} {...props} />;
    case 'guideMap':
      return <img aria-hidden alt="" src={guideMapIcon} {...props} />;

    // Front page buttons
    case 'location':
      return <img aria-hidden alt="" src={locationIcon} {...props} />;
    case 'accessibility':
      return <img aria-hidden alt="" src={accessibilityIcon} {...props} />;
    case 'serviceList':
      return <img aria-hidden alt="" src={serviceListIcon} {...props} />;
    case 'feedback':
      return <img aria-hidden alt="" src={feedbackIcon} {...props} />;
    case 'help':
      return <img aria-hidden alt="" src={helpIcon} {...props} />;

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

    default:
      return null;
  }
};
