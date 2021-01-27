import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import SuggestionItem from '../ListItems/SuggestionItem';

const PreviousSearches = ({
  className, focusIndex, listRef, onClick, history, handleArrowClick,
}) => {
  const renderList = () => {
    if (history) {
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
              icon={<Search />}
              text={item}
              handleArrowClick={handleArrowClick}
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
  history: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  focusIndex: PropTypes.number,
  listRef: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func.isRequired,
};

PreviousSearches.defaultProps = {
  history: null,
  listRef: null,
  focusIndex: null,
};

export default withStyles(styles)(PreviousSearches);
