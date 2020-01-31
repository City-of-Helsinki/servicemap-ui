import React from 'react';
import PropTypes from 'prop-types';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import { AddressIcon } from '../../SMIcon';
import { getAddressText, getAddressNavigatorParams } from '../../../utils/address';

const AddressItem = (props) => {
  const {
    getLocaleText, navigator, address, classes, selected, className,
  } = props;

  const text = getAddressText(address, getLocaleText);

  return (
    <SimpleListItem
      className={className}
      button
      text={uppercaseFirst(text)}
      icon={<AddressIcon className={classes.icon} />}
      divider
      handleItemClick={(e) => {
        e.preventDefault();
        if (navigator) {
          navigator.push('address', getAddressNavigatorParams(address, getLocaleText));
        }
      }}
      role="link"
      selected={selected}
    />
  );
};


export default AddressItem;

AddressItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  selected: PropTypes.bool,
  className: PropTypes.string,
};

AddressItem.defaultProps = {
  navigator: null,
  selected: false,
  className: null,
};
