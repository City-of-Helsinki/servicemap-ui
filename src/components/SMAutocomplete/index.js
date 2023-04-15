import { styled, Autocomplete } from '@mui/material';

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
  '&:hover .MuiOutlinedInput-root': {
    borderColor: theme.palette.white.main,
  },
  '&.Mui-focused .MuiOutlinedInput-root': {
    outline: 'none',
    boxShadow: 'none',
  },

  '& .MuiAutocomplete-popupIndicator, .MuiChip-deleteIcon': {
    color: theme.palette.white.main,
  },
  '& .MuiAutocomplete-tag': {
    color: theme.palette.white.main,
    backgroundColor: 'rgb(47, 60, 187)',
  },
}));

export default SMAutocomplete;
