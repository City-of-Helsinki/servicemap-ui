import { useSelector } from 'react-redux';

// Return active accessibility settings
const useAcccessibilitySettings = () => {
  const userSettings = useSelector(state => state.settings);
  const accessibiliySettingsLength = [
    userSettings.mobility,
    userSettings.colorblind,
    userSettings.hearingAid,
    userSettings.visuallyImpaired,
  ].filter(i => (i !== false && i !== null));

  return accessibiliySettingsLength;
};

export default useAcccessibilitySettings;
