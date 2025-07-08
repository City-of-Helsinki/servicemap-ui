import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';

import { CloseSuggestionButton } from '../CloseSuggestionButton';

const StyledCloseSuggestionButton = styled(CloseSuggestionButton)(
  ({ theme }) => ({
    backgroundColor: theme.palette.disabled.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    '& p': {
      marginLeft: theme.spacing(6),
    },
    '& svg': {
      marginRight: theme.spacing(1.5),
    },
  })
);

const StyledInfoText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  marginLeft: theme.spacing(6),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  position: 'absolute',
  zIndex: theme.zIndex.infront,
  backgroundColor: '#fff',
  overflow: 'auto',
  borderRadius: 0,
  borderBottomLeftRadius: theme.spacing(0.5),
  borderBottomRightRadius: theme.spacing(0.5),
  overflowX: 'hidden',
}));

const StyledPaperMobile = styled(Paper)(({ theme }) => ({
  right: 0,
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: theme.zIndex.infront,
  backgroundColor: '#fff',
  overflow: 'auto',
  borderRadius: 0,
  borderBottomLeftRadius: theme.spacing(0.5),
  borderBottomRightRadius: theme.spacing(0.5),
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'none',
  overflowX: 'hidden',
}));

export {
  StyledCloseSuggestionButton,
  StyledInfoText,
  StyledPaper,
  StyledPaperMobile,
};
