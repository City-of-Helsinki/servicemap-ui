import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';

const StyledAlignLeftParagraph = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  whiteSpace: 'pre-line',
  textAlign: 'left',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

export {
  StyledAlignLeftParagraph,
  StyledLink,
};
