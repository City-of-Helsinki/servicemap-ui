import React from 'react';
import PropTypes from 'prop-types';
import {
  List, withStyles, Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { getPreviousSearches } from './previousSearchData';
import styles from './styles';
import SimpleListItem from '../ListItems/SimpleListItem';

class PreviousSearches extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: getPreviousSearches(),
    };
  }

  renderList() {
    const { history } = this.state;
    const {
      focusIndex, listRef, onClick,
    } = this.props;
    return (
      <List ref={listRef}>
        {
          history.map((item, i) => (
            <SimpleListItem
              selected={i === focusIndex}
              button
              key={item}
              icon={<Search />}
              role="link"
              text={item}
              handleItemClick={() => onClick(item)}
              divider={i !== (history.length - 1)}
            />
          ))
        }
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <div className={classes.suggestionSubtitle}>
          <Typography className={classes.subtitleText} variant="overline"><FormattedMessage id="general.previousSearch" /></Typography>
        </div>
        {this.renderList()}
      </>
    );
  }
}

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
