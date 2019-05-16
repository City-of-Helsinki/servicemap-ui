/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Divider, Typography, withStyles, Link,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';

import { focusUnit } from '../Map/utils/mapActions';
import InfoList from './components/InfoList';
import styles from './styles/styles';
import TitleBar from '../../components/TitleBar/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import ServiceItem from '../../components/ListItems/ServiceItem';
import Container from '../../components/Container';
import { uppercaseFirst } from '../../utils';

// TODO: Add proper component's when ready

class UnitView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centered: false,
    };
  }

  componentDidMount() {
    const {
      match, fetchSelectedUnit, unit,
    } = this.props;
    const { params } = match;

    if (params && params.unit) {
      const unitId = params.unit;
      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        return;
      }
      fetchSelectedUnit(unitId);
    }
  }

  componentDidUpdate() {
    const { map, unit } = this.props;
    const { centered } = this.state;
    if (unit && map && map._layersMaxZoom && !centered) {
      this.centerMap(map, unit);
    }
  }

  componentWillUnmount() {
    const { changeSelectedUnit } = this.props;
    changeSelectedUnit(null);
  }

  centerMap = (map, unit) => {
    this.setState({ centered: true });
    if (unit.location && unit.location.coordinates) {
      focusUnit(map, unit);
    }
  }

  // Filters connections data by section
  sectionFilter = (list, section) => {
    const filteredList = [];
    let i = 0;
    list.forEach((item) => {
      if (!item.section_type) {
        filteredList.push({ type: section, value: item, id: i });
      } else if (item.section_type === section) {
        // Don't add duplicate elements
        if (!filteredList.some(e => e.value.name.fi === item.name.fi)) {
          filteredList.push({ type: section, value: item, id: i });
          i += 1;
        }
      }
    });
    return filteredList;
  }

  render() {
    const {
      classes, getLocaleText, intl, unit,
    } = this.props;

    const TopBar = (
      <div>
        <TitleBar title={unit && unit.name ? getLocaleText(unit.name) : ''} />
      </div>
    );

    if (unit && !unit.complete) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopBar}
            <p>
              <FormattedMessage id="general.loading" />
            </p>
          </div>
        </div>
      );
    }

    if (unit && unit.complete) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopBar}
            {
                unit.picture_url
                && <img className={classes.image} alt={`${intl.formatMessage({ id: 'unit.picture' })}${getLocaleText(unit.name)}`} src={unit.picture_url} />
            }

            {/* Highlights */}
            <div className={classes.marginVertical}>
              {this.sectionFilter(unit.connections, 'HIGHLIGHT').map(item => (
                <Typography
                  key={item.id}
                  className={classes.left}
                  variant="body1"
                >
                  {getLocaleText(item.value.name)}
                </Typography>
              ))}
            </div>

            {/* Contact information */}
            <InfoList
              data={[
                { type: 'ADDRESS', value: unit.street_address },
                ...this.sectionFilter(unit.connections, 'OPENING_HOURS'),
                { type: 'PHONE', value: { phone: unit.phone } },
                ...this.sectionFilter(unit.connections, 'PHONE_OR_EMAIL'),
              ]}
              title={<FormattedMessage id="unit.contact.info" />}
              titleComponent="h4"
            />

            {/* E-services */}
            <InfoList
              data={[
                { type: 'LINK', value: unit.www ? { name: intl.formatMessage({ id: 'unit.homepage' }), www: unit.www } : null },
                // ...this.sectionFilter(unit.connections, 'LINK'),
                ...this.sectionFilter(unit.connections, 'ESERVICE_LINK'),
                // ...this.sectionFilter(unit.connections, 'OTHER_INFO'),
              ]}
              title={<FormattedMessage id="unit.e.services" />}
              titleComponent="h4"
            />

            {/* Unit description  TODO: Make this own component */}
            {unit.description || this.sectionFilter(unit.connections, 'OTHER_INFO').length > 0 ? (
              <div className={classes.left}>
                {/* Description title */}
                <Typography
                  className={classes.subtitle}
                  component="h4"
                  variant="subtitle1"
                >
                  {<FormattedMessage id="unit.description" />}
                </Typography>
                <Divider className={classes.divider} aria-hidden="true" />
                {/* Description text */}
                {unit.description ? (
                  <Typography className={classes.paragraph} variant="body2">
                    {unit.description ? getLocaleText(unit.description) : null}
                  </Typography>
                ) : null}
                {/* Other info texts + links */}
                {this.sectionFilter(unit.connections, 'OTHER_INFO').map((item) => {
                  if (item.value.www) {
                    return (
                      <Typography
                        key={item.id}
                        className={classes.paragraph}
                        variant="body2"
                      >
                        <Link className={classes.link} href={getLocaleText(item.value.www)} target="_blank">
                          {`${getLocaleText(item.value.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
                        </Link>

                      </Typography>
                    );
                  }
                  return (
                    <Typography
                      key={item.id}
                      className={classes.paragraph}
                      variant="body2"
                    >
                      {getLocaleText(item.value.name)}
                    </Typography>
                  );
                })}
              </div>
            ) : null}

            {/* Unit services */}
            <TitledList
              title={<FormattedMessage id="unit.services" />}
              titleComponent="h4"
            >
              {
                unit.services.map(service => (
                  <ServiceItem key={service.id} service={service} />
                ))
              }
            </TitledList>

            <Container margin text>
              <Typography variant="body2">
                {
                  unit.contract_type
                  && unit.contract_type.description
                  && `${uppercaseFirst(getLocaleText(unit.contract_type.description))}. `
                }
                {
                  unit.data_source
                  && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.data_source }} />
                }
              </Typography>
            </Container>
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <div className="Content">
          {TopBar}
          <Typography color="primary" variant="body1">
            <FormattedMessage id="unit.details.notFound" />
          </Typography>
        </div>
      </div>
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const unit = getSelectedUnit(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  return {
    unit,
    getLocaleText,
    map,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit, fetchSelectedUnit },
)(UnitView))));

// Typechecking
UnitView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  fetchSelectedUnit: PropTypes.func.isRequired,
  changeSelectedUnit: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

UnitView.defaultProps = {
  unit: null,
  match: {},
  map: null,
};
