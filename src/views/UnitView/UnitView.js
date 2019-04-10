import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Divider, Typography, withStyles, Link,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AddressIcon from '@material-ui/icons/Place';
import { fetchUnit, fetchUnits } from '../../redux/actions/unit';
import { getSelectedUnit } from '../../redux/selectors/unit';
import { getLocaleString } from '../../redux/selectors/locale';
import { changeSelectedUnit } from '../../redux/actions/filter';

import InfoList from './components/InfoList';
import styles from './styles/styles';
import queryBuilder from '../../utils/queryBuilder';
import TitleBar from '../../components/TitleBar/TitleBar';

// TODO: Add proper component's when ready

class UnitView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitData: null,
      isFetching: true,
    };
  }

  componentDidMount() {
    const { match, changeSelectedUnit } = this.props;
    const { params } = match;
    if (params && params.unit) {
      const { unit } = params;
      changeSelectedUnit(unit);
      console.log('change selected unit to: ', unit);

      /* TODO:  Instead of this fetch function, create appropriate redux fetch for unit
                that updates the existing data of the unit */
      this.setState({ isFetching: true });
      queryBuilder.setType('unit', unit).run()
        .then(response => response.json())
        .then(data => this.setState({
          unitData: data,
          isFetching: false,
        }));
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
    const { classes, getLocaleText, intl } = this.props;
    const { unitData, isFetching } = this.state;
    let { unit } = this.props;
    if (unitData) {
      unit = unitData;
    }
    if (isFetching) {
      return (
        <p>Loading unit data</p>
      );
    }

    if (unit) {
      return (
        <div className={classes.root}>
          <div className="Content">
            <TitleBar title={unit.name && unit.name.fi} />
            {
                unit.picture_url
                && <img className={classes.image} alt="Unit" src={unit.picture_url} />
              }

            {/* Unit title */}
            <div className={classes.title}>
              <AddressIcon className={classes.left} />
              <Typography
                className={classes.left}
                component="h3"
                variant="h6"
              >
                {unit.name && getLocaleText(unit.name)}
              </Typography>
            </div>
            <Divider className={classes.divider} />

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
            {unit.description || this.sectionFilter(unit.connections, 'OTHER_INFO') ? (
              <div className={classes.left}>
                {/* Description title */}
                <Typography className={classes.subtitle} variant="subtitle1">
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
                        className={classes.paragraph}
                        component="a"
                        variant="body2"
                      >
                        <Link color="#2242C7" href={getLocaleText(item.value.www)} target="_blank">
                          {`${getLocaleText(item.value.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
                        </Link>

                      </Typography>
                    );
                  }
                  return (
                    <Typography className={classes.paragraph} variant="body2">
                      {item.value.name.fi}
                    </Typography>
                  );
                })}
              </div>
            ) : null}

            {/* Unit services */}
            <InfoList
              data={this.sectionFilter(unit.services, 'SERVICE')}
              title={<FormattedMessage id="unit.services" />}
            />

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
      <Typography color="primary" variant="body1">
        <FormattedMessage id="unit.details.notFound" />
      </Typography>
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const unit = getSelectedUnit(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit,
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { fetchUnit, fetchUnits, changeSelectedUnit },
)(UnitView)));

// Typechecking
UnitView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  changeSelectedUnit: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

UnitView.defaultProps = {
  unit: null,
  match: {},
};
