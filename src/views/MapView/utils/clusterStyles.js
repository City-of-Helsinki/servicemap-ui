// Shared cluster icon styles used in both MapLegend and MarkerCluster
// These should match the styles in MarkerCluster.js

export const getClusterStyles = (theme, useContrast) => ({
  outer: {
    background: useContrast
      ? theme.palette.white.main
      : 'rgba(0, 22, 183, 0.25)',
  },
  mid: {
    background: useContrast
      ? theme.palette.white.dark
      : 'rgba(0, 22, 183, 0.50)',
  },
  inner: {
    background: useContrast ? theme.palette.primary.main : 'rgba(0, 22, 183)',
    color: '#fff',
    fontFamily: 'Lato',
    fontWeight: 'bold',
  },
});
