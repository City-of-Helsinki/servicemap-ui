import styled from '@emotion/styled';
import { Autocomplete } from '@mui/material';

const SMAutocomplete = styled(Autocomplete)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiInputLabel-root': {
    color: theme.palette.white.main,
  },
  '&.Mui-focused .MuiInputLabel-root': {
    color: theme.palette.white.main,
  },
  '& .MuiAutocomplete-input': {
    color: theme.palette.white.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.dark,
  },
  '&.Mui-focused .MuiOutlinedInput-root': {
    outline: 'none',
    boxShadow: 'none',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.main,
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.main,
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: theme.palette.white.main,
  },
}));

export default SMAutocomplete;
