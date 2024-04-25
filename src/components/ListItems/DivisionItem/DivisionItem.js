import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonBase,
  Divider,
  ListItem,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { selectNavigator } from '../../../redux/selectors/general';
import UnitIcon from '../../SMIcon/UnitIcon';
import SMLink from '../../Link';
import { getAddressFromUnit } from '../../../utils/address';
import useLocaleText from '../../../utils/useLocaleText';

const DivisionItem = ({
  data,
  distance,
  divider,
  disableTitle,
  customTitle,
  className,
}) => {
  const intl = useIntl();
  const navigator = useSelector(selectNavigator);
  const getLocaleText = useLocaleText();
  const { area } = data;
  const aStart = area && area.start ? new Date(area.start).getFullYear() : null;
  const aEnd = area && area.end ? new Date(area.end).getFullYear() : null;

  if (aStart === 2019 || aEnd === 2019) return null;

  const name = data.name ? getLocaleText(data.name) : null;
  const address = typeof data.street_address === 'object' ? getAddressFromUnit(data, getLocaleText, intl) : (data.street_address || null);
  const unitOnClick = () => navigator.push('unit', { id: data.id });

  const emergencyUnitId = data.emergencyUnitId || null;
  const emergencyCareText = data.emergencyUnitId ? <FormattedMessage id={`address.emergency_care.unit.${data.emergencyUnitId}`} /> : null;
  const emergencyOnClick = () => navigator.push('unit', { id: emergencyUnitId });

  let title = disableTitle ? null : intl.formatMessage({ id: `area.list.${area.type}` });
  if (customTitle) {
    title = customTitle;
  } else {
    title = `${title}${aStart && aEnd ? ` ${aStart}-${aEnd}` : ''}`;
  }

  // Screen reader text
  const srText = `
    ${(!disableTitle && title) || ''}
    ${name || ''} 
    ${address || ''}
    .
    ${distance
    ? `${distance.distance} ${distance.type === 'm'
      ? intl.formatMessage({ id: 'general.distance.meters' })
      : intl.formatMessage({ id: 'general.distance.kilometers' })}`
    : ''} 
  `;

  const emergencyCareLink = txt => (
    <a
      href={intl.formatMessage({ id: 'address.emergency_care.link' })}
      className="external-link"
    >
      {txt}
    </a>
  );

  const emergencyCareCommonLink = txt => (
    <a
      className="external-link"
      href={intl.formatMessage({ id: 'address.emergency_care.common.link' })}
    >
      {txt}
    </a>
  );

  return (
    <>
      <StyledListItem
        component="li"
        className={`${className || ''}`}
      >
        <StyledLinkButton
          role="link"
          onClick={unitOnClick}
        >
          {
            // SROnly element with full readable text
          }
          <Typography
            component="p"
            style={visuallyHidden}
          >
            {srText}
          </Typography>
          {
            area
            && !disableTitle
            && (
              <StyledDivisionTitle align="left" aria-hidden variant="subtitle1">
                {title}
              </StyledDivisionTitle>
            )
          }
          <StyledContainer>
            <StyledUnitIcon />
            <StyledContent>
              <StyledFlexRow>
                {
                  name
                  && (
                    <StyledWeightBold
                      align="left"
                      aria-hidden
                      variant="body2"
                      component="p"
                      data-sm="DivisionItemName"
                    >
                      {name}
                    </StyledWeightBold>
                  )
                }
                {
                  distance
                  && (
                    <StyledDivisionDistance
                      align="left"
                      aria-hidden
                      variant="caption"
                    >
                      {distance.distance}
                      {distance.type}
                    </StyledDivisionDistance>
                  )
                }
              </StyledFlexRow>
              {
                address
                && (
                  <StyledDivisionAddress
                    align="left"
                    aria-hidden
                    variant="caption"
                  >
                    {address}
                  </StyledDivisionAddress>
                )
              }
            </StyledContent>
          </StyledContainer>
        </StyledLinkButton>
        {
          emergencyUnitId
          && (
            <StyledEmergencyContent>
              <StyledEmergencyTypography
                align="left"
                variant="caption"
              >
                <FormattedMessage
                  id="address.emergency_care.common"
                  values={{
                    a: txt => (
                      <a
                        className="link"
                        href={
                          intl.formatMessage({ id: 'address.emergency_care.children_hospital.link' })
                        }
                      >
                        {txt}
                      </a>
                    ),
                    a1: emergencyCareCommonLink,
                  }}
                />
                {' '}
                {
                  emergencyCareText
                  && (
                    <SMLink onClick={emergencyOnClick}>
                      {emergencyCareText}
                    </SMLink>
                  )
                }
                {' '}
                <FormattedMessage
                  id="address.emergency_care.link.text"
                  values={{ a: emergencyCareLink }}
                />
              </StyledEmergencyTypography>
            </StyledEmergencyContent>
          )
        }
      </StyledListItem>
      {divider && (
        <StyledLi aria-hidden>
          <Divider />
        </StyledLi>
      )}
    </>
  );
};
const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

const StyledLinkButton = styled(ButtonBase)(() => ({
  flexDirection: 'column',
  alignItems: 'initial',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(0, 1.5),
}));

const StyledContent = styled('div')(() => ({
  alignSelf: 'center',
  flex: '1 1 auto',
}));

const StyledFlexRow = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const StyledUnitIcon = styled(UnitIcon)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledDivisionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const StyledDivisionAddress = styled(Typography)(() => ({
  color: 'black',
  display: 'block',
  fontWeight: 'normal',
}));

const StyledDivisionDistance = styled(Typography)(() => ({
  color: 'black',
  fontWeight: 'normal',
}));

const StyledWeightBold = styled(Typography)(() => ({
  fontWeight: 'bold',
}));

const StyledEmergencyContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(0, 1),
  marginLeft: theme.spacing(5),
  marginRight: 60,
}));

const StyledEmergencyTypography = styled(Typography)(() => ({
  color: 'black',
  fontWeight: 'normal',
}));

const StyledLi = styled('li')(() => ({
  listStyleType: 'none',
}));

DivisionItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  distance: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['m', 'km']),
    text: PropTypes.string,
  }),
  divider: PropTypes.bool.isRequired,
  disableTitle: PropTypes.bool,
  customTitle: PropTypes.string,
};

DivisionItem.defaultProps = {
  distance: null,
  className: null,
  disableTitle: false,
  customTitle: null,
};

export default DivisionItem;
