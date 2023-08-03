import styled from '@emotion/styled';
import { Divider } from '@mui/material';

/**
 * Common styled components for AreaView
 */

const StyledDivider = styled(Divider)(() => ({
  marginLeft: -72,
}));

const StyledDistrictServiceList = styled('div')(() => ({
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
  backgroundColor: 'rgb(240,240,240)',
}));

const StyledServiceList = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: 77,
  backgroundColor: 'rgb(230,243,254)',
}));

const StyledServiceTabServiceList = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(10),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export {
  StyledDivider,
  StyledDistrictServiceList,
  StyledServiceList,
  StyledServiceTabServiceList,
};
