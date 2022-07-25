import React from 'react';
import PropTypes from 'prop-types';
import SimpleListItem from '../SimpleListItem';
import { AddressIcon } from '../../SMIcon';
import { getAddressText, useNavigationParams } from '../../../utils/address';
import useLocaleText from '../../../utils/useLocaleText';

const AddressItem = (props) => {
  const {
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
  const getAddressNavigatorParams = useNavigationParams();

  let text;

  // If complete address name is found in data, use it
  if (address.name) {
    text = `${getLocaleText(address.name)}, ${address.municipality?.name ? getLocaleText(address.municipality.name) : ''}`;
  } else {
    text = getAddressText(address, getLocaleText, showPostalCode);
  }

  return (
    <SimpleListItem
      className={className}
      button
      text={text}
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
