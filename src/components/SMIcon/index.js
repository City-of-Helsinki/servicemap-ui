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
 * Map types
 */
export const DefaultMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={defaulMapIcon} />
);

export const AerialMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={aerialMapIcon} />
);

export const GuideMapIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={guideMapIcon} />
);

/**
 * Front page
 */

export const LocationIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={locationIcon} />
);

export const AccessibilityIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={accessibilityIcon} />
);

export const ServiceListIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={serviceListIcon} />
);

export const FeedbackIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={feedbackIcon} />
);

export const HelpIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={helpIcon} />
);

/**
 * Social media links
 */
export const FacebookIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={facebookIcon} />
);

export const InstagramIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={instagramIcon} />
);

export const PinterestIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={pinterestIcon} />
);

export const SnapchatIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={snapchatIcon} />
);

export const TwitterIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={twitterIcon} />
);

export const YoutubeIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={youtubeIcon} />
);

export const VimeoIcon = ({ ...rest }) => (
  <img aria-hidden alt="" {...rest} src={vimeoIcon} />
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
    case 'servicemap':
      return <DefaultMapIcon {...props} />;
    case 'orthoImage':
      return <AerialMapIcon {...props} />;
    case 'guideMap':
      return <GuideMapIcon {...props} />;
    case 'location':
      return <LocationIcon {...props} />;
    case 'accessibility':
      return <AccessibilityIcon {...props} />;
    case 'serviceList':
      return <ServiceListIcon {...props} />;
    case 'feedback':
      return <FeedbackIcon {...props} />;
    case 'help':
      return <HelpIcon {...props} />;
    case 'facebook':
      return <FacebookIcon {...props} />;
    case 'instagram':
      return <InstagramIcon {...props} />;
    case 'pinterest':
      return <PinterestIcon {...props} />;
    case 'snapchat':
      return <SnapchatIcon {...props} />;
    case 'twitter':
      return <TwitterIcon {...props} />;
    case 'youtube':
      return <YoutubeIcon {...props} />;
    case 'vimeo':
      return <VimeoIcon {...props} />;
    default:
      return null;
  }
};
