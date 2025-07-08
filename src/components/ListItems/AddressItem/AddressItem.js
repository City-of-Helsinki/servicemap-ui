import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectNavigator } from '../../../redux/selectors/general';
import { getAddressText, useNavigationParams } from '../../../utils/address';
import useLocaleText from '../../../utils/useLocaleText';
import { AddressIcon } from '../../SMIcon';
import SimpleListItem from '../SimpleListItem';

function AddressItem(props) {
  const {
    address,
    selected = false,
    className = null,
    showPostalCode = true,
    role = null,
    id = null,
  } = props;
  const navigator = useSelector(selectNavigator);
  const getLocaleText = useLocaleText();
  const getAddressNavigatorParams = useNavigationParams();

  const text = getAddressText(address, getLocaleText, showPostalCode);

  return (
    <SimpleListItem
      className={className}
      button
      text={text}
      icon={<StyledAddressIcon />}
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
}

const StyledAddressIcon = styled(AddressIcon)(() => ({
  margin: 0,
}));

export default AddressItem;

AddressItem.propTypes = {
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  selected: PropTypes.bool,
  className: PropTypes.string,
  showPostalCode: PropTypes.bool,
  role: PropTypes.string,
  id: PropTypes.string,
};
