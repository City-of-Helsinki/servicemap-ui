import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, ListItem, Divider, ButtonBase,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import UnitIcon from '../../SMIcon/UnitIcon';
import SMLink from '../../Link';

const DivisionItem = ({
  classes,
  data,
  distance,
  divider,
  className,
  getLocaleText,
  intl,
  navigator,
  locale,
}) => {
  const { area } = data;
  const aStart = area && area.start ? new Date(area.start).getFullYear() : null;
  const aEnd = area && area.end ? new Date(area.end).getFullYear() : null;

  if (aStart === 2019 || aEnd === 2019) return null;

  const name = data.name ? getLocaleText(data.name) : null;
  const address = data.street_address ? getLocaleText(data.street_address) : null;
  const unitOnClick = () => navigator.push('unit', { id: data.id });

  const emergencyUnitId = data.emergencyUnitId || null;
  const emergencyCareText = data.emergencyUnitId ? <FormattedMessage id={`address.emergency_care.unit.${data.emergencyUnitId}`} /> : null;
  const emergencyOnClick = () => navigator.push('unit', { id: emergencyUnitId });

  let title = intl.formatMessage({ id: `area.list.${area.type}` });
  title = `${title}${aStart && aEnd ? ` ${aStart}-${aEnd}` : ''}`;

  // Screen reader text
  const srText = `
    ${title || ''}
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
      <ListItem
        component="li"
        className={`${classes.listItem} ${className || ''}`}
      >
        <ButtonBase
          className={classes.linkButton}
          onClick={unitOnClick}
        >
          {
            // SROnly element with full readable text
          }
          <Typography
            component="p"
            variant="srOnly"
          >
            {srText}
          </Typography>
          {
            area
            && (
              <Typography align="left" aria-hidden className={classes.divisionTitle} variant="subtitle1">
                {title}
              </Typography>
            )
          }
          <div className={classes.containerInner}>
            <UnitIcon className={classes.icon} />
            <div className={classes.content}>
              <div className={classes.flexRow}>
                {
                  name
                  && (
                    <Typography
                      align="left"
                      aria-hidden
                      variant="body2"
                      className={classes.weightBold}
                      component="p"
                    >
                      {name}
                    </Typography>
                  )
                }
                {
                  distance
                  && (
                    <Typography
                      align="left"
                      aria-hidden
                      className={classes.divisionDistance}
                      variant="caption"
                    >
                      {distance.distance}
                      {distance.type}
                    </Typography>
                  )
                }
              </div>
              {
                address
                && (
                  <Typography
                    align="left"
                    aria-hidden
                    className={classes.divisionAddress}
                    variant="caption"
                  >
                    {address}
                  </Typography>
                )
              }
            </div>
          </div>
        </ButtonBase>
        {
          emergencyUnitId
          && (
            <div className={classes.emergencyContent}>
              <Typography
                align="left"
                className={classes.emergencyTypography}
                variant="caption"
              >
                <FormattedMessage
                  id="address.emergency_care.common"
                  values={{
                    a: txt => (
                      <a
                        className="link"
                        href={
                          intl.formatMessage({
                            id: 'address.emergency_care.children_hospital.link',
                          },
                          { locale })
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
              </Typography>
            </div>
          )
        }
      </ListItem>
      {divider && (
        <li aria-hidden className={classes.li}>
          <Divider />
        </li>
      )}
    </>
  );
};

DivisionItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  distance: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['m', 'km']),
    text: PropTypes.string,
  }),
  divider: PropTypes.bool.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  locale: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

DivisionItem.defaultProps = {
  distance: null,
  className: null,
};

export default DivisionItem;
