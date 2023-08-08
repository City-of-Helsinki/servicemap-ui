import styled from '@emotion/styled';
import {
  Divider, List, ListItem, Typography,
} from '@mui/material';
import { SMAccordion } from '../../../../components';

/**
 * Common styled components for AreaView
 */
const levelTwo = () => ({
  backgroundColor: 'rgb(250,250,250)',
});

const levelThree = () => ({
  backgroundColor: 'rgb(245,245,245)',
});

const levelFour = () => ({
  backgroundColor: 'rgb(240,240,240)',
});

const StyledDivider = styled(Divider)(() => ({
  marginLeft: -72,
}));

const StyledDistrictServiceList = styled('div')(() => ({
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
}));

const StyledDistrictServiceListLevelFour = styled(StyledDistrictServiceList)(() => levelFour());
const StyledDistrictServiceListLevelThree = styled(StyledDistrictServiceList)(() => levelThree());

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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  minHeight: theme.spacing(7),
}));

const StyledAreaListItem = styled(StyledListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(2),
}));

const StyledListNoPadding = styled(List)(({ theme }) => ({
  padding: 0,
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
  '& li:last-of-type': {
    borderBottom: 'none',
  },
}));

const StyledListNoPaddingLevelTwo = styled(StyledListNoPadding)(() => levelTwo());

const StyledListNoPaddingLevelThree = styled(StyledListNoPadding)(() => levelThree());

const StyledUnitsAccordion = styled(SMAccordion)(() => ({
  height: 48,
  backgroundColor: 'rgba(222, 222, 222, 0.56)',
}));

const StyledCaptionText = styled(Typography)(() => ({
  color: '#000',
  fontWeight: 'normal',
}));

const StyledLoadingText = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
}));

const StyledCheckBoxIcon = styled('span')(() => ({
  margin: 2,
  width: 18,
  height: 18,
  backgroundColor: '#fff',
  border: '0.5px solid #949494',
  boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.05)',
  borderRadius: 2,
}));

const StyledUnitListArea = styled('div')(() => ({
  textAlign: 'left',
  backgroundColor: 'rgba(222, 222, 222, 0.56)',
}));

const StyledAccordionServiceTitle = styled(SMAccordion)(({ theme }) => ({
  paddingLeft: theme.spacing(10),
}));

const StyledUnitList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(10),
  paddingRight: theme.spacing(4),
  paddingBottom: theme.spacing(1),
}));

export {
  StyledDivider,
  StyledDistrictServiceList,
  StyledDistrictServiceListLevelThree,
  StyledDistrictServiceListLevelFour,
  StyledListItem,
  StyledAreaListItem,
  StyledListNoPadding,
  StyledListNoPaddingLevelTwo,
  StyledListNoPaddingLevelThree,
  StyledServiceList,
  StyledServiceTabServiceList,
  StyledUnitsAccordion,
  StyledCaptionText,
  StyledLoadingText,
  StyledCheckBoxIcon,
  StyledUnitListArea,
  StyledAccordionServiceTitle,
  StyledUnitList,
};
