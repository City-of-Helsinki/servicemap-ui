import React from 'react';
import PropTypes from 'prop-types';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import { AddressIcon } from '../../SMIcon';
import { getAddressText } from '../../../utils/address';
import useLocaleText from '../../../utils/useLocaleText';

const AddressItem = (props) => {
  const {
    getAddressNavigatorParams,
    navigator,
    address,
    classes,
    selected,
    className,
    showPostalCode,
    role,
    id,
  } = props;
  const getLocaleText = useLocaleText();

  const text = getAddressText(address, getLocaleText, showPostalCode);

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
          navigator.push('address', getAddressNavigatorParams(address));
        }
      }}
      role={role || 'link'}
      selected={selected}
      id={id}
    />
  );
};


export default AddressItem;

AddressItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getAddressNavigatorParams: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  selected: PropTypes.bool,
  className: PropTypes.string,
  showPostalCode: PropTypes.bool,
  role: PropTypes.string,
  id: PropTypes.string,
};

AddressItem.defaultProps = {
  navigator: null,
  selected: false,
  className: null,
  showPostalCode: true,
  role: null,
  id: null,
};
