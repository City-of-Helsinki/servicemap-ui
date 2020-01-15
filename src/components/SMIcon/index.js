import React from 'react';
import SMIcon from './SMIcon';
import SVGIcon from './SVGIcon';
import defaulMapIcon from '../../assets/images/iconDefaultMap.svg';
import aerialMapIcon from '../../assets/images/iconAerialMap.svg';
import guideMapIcon from '../../assets/images/iconGuideMap.svg';
import feedbackIcon from '../../assets/images/iconFeedback.svg';
import IconLocation from './Icons/IconLocation';
import IconAccessibility from './Icons/IconAccessibility';
import IconServiceList from './Icons/IconServiceList';
import IconFeedback from './Icons/IconFeedback';
import IconHelp from './Icons/IconHelp';

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
  <SVGIcon {...rest}><IconLocation /></SVGIcon>
  // <img aria-hidden alt="" {...rest} src={locationIcon} />
);

export const AccessibilityIcon = ({ ...rest }) => (
  <SVGIcon {...rest}><IconAccessibility /></SVGIcon>
  // <img aria-hidden alt="" {...rest} src={accessibilityIcon} />
);

export const ServiceListIcon = ({ ...rest }) => (
  <SVGIcon {...rest}><IconServiceList /></SVGIcon>
  // <img aria-hidden alt="" {...rest} src={serviceListIcon} />
);

export const FeedbackIcon = ({ ...rest }) => (
  // <SVGIcon {...rest}><IconFeedback /></SVGIcon>
  <img aria-hidden alt="" {...rest} src={feedbackIcon} />
);

export const HelpIcon = ({ ...rest }) => (
  <SVGIcon {...rest}><IconHelp /></SVGIcon>
  // <img aria-hidden alt="" {...rest} src={helpIcon} />
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
    default:
      return null;
  }
};
