
const accessibilityColors = {
  default: 'gray',
  valid: 'blue',
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
