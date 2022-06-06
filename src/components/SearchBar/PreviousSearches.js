import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { AccessTime } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import SuggestionItem from '../ListItems/SuggestionItem';
import { getPreviousSearches, removeSearchFromHistory } from './previousSearchData';

const PreviousSearches = ({
  className, focusIndex, listRef, onClick,
}) => {
  const [history, setHistory] = useState(getPreviousSearches());

  const handleRemovePrevious = (val) => {
    const callback = () => setHistory(getPreviousSearches());
    removeSearchFromHistory(val, callback);
  };

  const renderList = () => {
    if (history?.length) {
      return (
        <>
          <List role="listbox" id="PreviousList" className="suggestionList" ref={listRef}>
            {
          history.map((item, i) => (
            <SuggestionItem
              id={`suggestion${i}`}
              role="option"
              selected={i === focusIndex}
              key={item}
              icon={<AccessTime />}
              text={item}
              handleRemoveClick={val => handleRemovePrevious(val)}
              handleItemClick={() => onClick(item)}
              divider={i !== (history.length - 1)}
            />
          ))
        }
          </List>
        </>
      );
    }
    return (
      <Typography align="left" aria-live="polite" className={className}>
        <FormattedMessage id="search.suggestions.noHistory" />
      </Typography>
    );
  };

  return renderList();
};

PreviousSearches.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusIndex: PropTypes.number,
  listRef: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func.isRequired,
};

PreviousSearches.defaultProps = {
  listRef: null,
  focusIndex: null,
};

export default withStyles(styles)(PreviousSearches);
