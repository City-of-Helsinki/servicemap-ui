import { css } from '@emotion/css';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React from 'react';

import { SMSwitch } from '../../../../components';

function DistrictToggleButton({
  district,
  onToggle,
  selected = false,
  selectionSize = null,
  label = null,
  inputProps = {},
  ...rest
}) {
  const switchBorderClass = css({
    border: '1px solid #949494',
  });

  return (
    <StyledAreaSwitch id={district.id} data-sm="DistrictToggleButton">
      <StyledSMSwitch
        color="primary"
        classes={{ thumb: switchBorderClass }}
        size="small"
        value={district.id}
        inputProps={{
          ...inputProps,
          role: 'button',
          'aria-setsize': selectionSize ? selectionSize.toString() : null,
          'aria-pressed': selected,
          'aria-labelledby': `${`${district.id}Name`} ${`${district.id}Period`}`,
        }}
        onChange={(e) => onToggle(e)}
        checked={selected}
        {...rest}
      />
      <StyledLabelContainer>{label}</StyledLabelContainer>
    </StyledAreaSwitch>
  );
}

const StyledAreaSwitch = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: -11,
  verticalAlign: 'middle',
}));

const StyledLabelContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const StyledSMSwitch = styled(SMSwitch)(() => ({
  overflow: 'visible',
}));

DistrictToggleButton.propTypes = {
  district: PropTypes.objectOf(PropTypes.any).isRequired,
  onToggle: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  selectionSize: PropTypes.number,
  inputProps: PropTypes.shape({
    tabindex: PropTypes.string,
  }),
  label: PropTypes.objectOf(PropTypes.any),
};

export default DistrictToggleButton;
