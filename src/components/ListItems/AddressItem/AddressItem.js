import React from 'react';
import PropTypes from 'prop-types';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import { AddressIcon } from '../../SMIcon';

const AddressItem = (props) => {
  const {
    getLocaleText, navigator, divider, address, classes,
  } = props;

  const number = `${address.number ? address.number : ''}${address.letter ? address.letter : ''}`;
  const text = `${getLocaleText(address.street.name)} ${number}, ${uppercaseFirst(address.street.municipality)}`;

  return (
    <SimpleListItem
      button
      text={uppercaseFirst(text)}
      icon={<AddressIcon className={classes.icon} />}
      divider={divider}
      handleItemClick={(e) => {
        e.preventDefault();
        if (navigator) {
          navigator.push('address', {
            municipality: address.street.municipality,
            street: getLocaleText(address.street.name),
            number: `${number}`,
          });
        }
      }}
      role="link"
    />
  );
};


export default AddressItem;

AddressItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  divider: PropTypes.bool,
};

AddressItem.defaultProps = {
  navigator: null,
  divider: true,
};
