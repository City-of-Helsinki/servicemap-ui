const accessibilityColors = {
  // default: 'gray',
  default: '#2242C7', // Blue
  valid: '#2242C7', // Blue
  hasShortcomings: 'red',
};

export const isValidUnit = unit => unit && unit.object_type === 'unit';

export const getAccesibilityColor = (unit) => {
  if (isValidUnit(unit)) {
    // TODO: Calculate color based on shortcomings once data is correct
    return accessibilityColors.default;
  }
  return accessibilityColors.default;
};

export default { getAccesibilityColor };
