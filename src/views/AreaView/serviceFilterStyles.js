import { css } from '@emotion/css';

export const createServiceFilterStyles = (theme) => ({
  serviceFilterInputClass: css({
    margin: theme.spacing(1),
  }),
  serviceFilterButtonLabelClass: css({
    flexDirection: 'column',
  }),
  serviceFilterButtonFocusClass: css({
    boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main} !important`,
  }),
});
