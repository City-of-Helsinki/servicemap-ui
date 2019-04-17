import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Divider, Typography, withStyles, Link,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { fetchSelectedUnitData } from '../../redux/actions/unit';
import { getSelectedUnit } from '../../redux/selectors/unit';
import { getLocaleString } from '../../redux/selectors/locale';
import { changeSelectedUnit } from '../../redux/actions/filter';

import InfoList from './components/InfoList';
import styles from './styles/styles';
import TitleBar from '../../components/TitleBar/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import ServiceItem from '../../components/ListItems/ServiceItem';

// TODO: Add proper component's when ready

class UnitView extends React.Component {
  constructor(props) {
    super(props);
    this.unitTitle = React.createRef();
    this.state = {
      needUpdate: true,
    };
  }

  componentDidMount() {
    const { match, changeSelectedUnit } = this.props;
    const { params } = match;
    if (params && params.unit) {
      const { unit } = params;
      changeSelectedUnit(unit);
    }
    this.unitTitle.current.focus();
  }

  componentDidUpdate() {
    const { unit } = this.props;
    const { needUpdate } = this.state;
    // Fetch the rest of the unit data once the component receives redux data
    if (unit && !unit.complete && needUpdate) {
      this.updateUnitData(unit);
    }
  }

  updateUnitData = (unit) => {
    const { fetchSelectedUnitData } = this.props;
    this.setState({ needUpdate: false });
    fetchSelectedUnitData(unit.id);
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
      classes, getLocaleText, intl, fetchState, unit,
    } = this.props;

    const TopBar = (
      <div>
        <TitleBar titleRef={this.unitTitle} title={unit ? unit.name && unit.name.fi : ''} />
      </div>
    );

    if (fetchState.isFetching) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {TopBar}
            <p>Loading unit data</p>
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
                && <img aria-hidden className={classes.image} alt="Unit" src={unit.picture_url} />
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
            />

            {/* E-services */}
            <InfoList
              data={[
                { type: 'LINK', value: unit.www ? { name: intl.formatMessage({ id: 'unit.homepage' }), www: unit.www } : null },
                ...this.sectionFilter(unit.connections, 'LINK'),
                ...this.sectionFilter(unit.connections, 'ESERVICE_LINK'),
                // ...this.sectionFilter(unit.connections, 'OTHER_INFO'),
              ]}
              title={<FormattedMessage id="unit.e.services" />}
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
                <Divider />
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
            <TitledList title={<FormattedMessage id="unit.services" />}>
              {
                unit.services.map(service => (
                  <ServiceItem key={service.id} service={service} />
                ))
              }
            </TitledList>

            <span>
              {unit.provider && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.provider }} />}
            </span>
            <span>
              {unit.data_source && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.data_source }} />}
            </span>
            {
                unit.contract_type
                && unit.contract_type.description
                && <p className="text-small">{getLocaleText(unit.contract_type.description)}</p>
            }
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
  const fetchState = state.units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit,
    fetchState,
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    changeSelectedUnit, fetchSelectedUnitData,
  },
)(UnitView)));

// Typechecking
UnitView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  fetchState: PropTypes.objectOf(PropTypes.any),
  changeSelectedUnit: PropTypes.func.isRequired,
  fetchSelectedUnitData: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

UnitView.defaultProps = {
  unit: null,
  fetchState: null,
  match: {},
};
