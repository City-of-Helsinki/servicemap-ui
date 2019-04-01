import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { fetchUnit, fetchUnits } from '../../redux/actions/unit';
import { getSelectedUnit } from '../../redux/selectors/unit';
import { changeSelectedUnit } from '../../redux/actions/filter';
import queryBuilder from '../../utils/queryBuilder';
import styles from './styles';

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

  render() {
    const { classes } = this.props;
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
            {
                unit.picture_url
                && <img className={classes.image} alt="Unit" src={unit.picture_url} />
              }

            <Typography color="primary" variant="h3">
              {unit.name && unit.name.fi}
            </Typography>
            <span>
              {unit.provider && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.provider }} />}
            </span>
            <span>
              {unit.data_source && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unit.data_source }} />}
            </span>
            {
                unit.contract_type
                && unit.contract_type.description
                && unit.contract_type.description.fi
                && <p className="text-small">{unit.contract_type.description.fi}</p>
              }

            <p>{`${unit.street_address && unit.street_address.fi}, ${unit.address_zip} ${unit.municipality ? unit.municipality.charAt(0).toUpperCase() + unit.municipality.slice(1) : ''}`}</p>

            {
                unit.www && unit.www.fi
                && <a href={unit.www.fi}><p>Kotisivu</p></a>
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
const mapStateToProps = state => ({
  unit: getSelectedUnit(state),
});

export default withStyles(styles)(connect(
  mapStateToProps,
  { fetchUnit, fetchUnits, changeSelectedUnit },
)(UnitView));

// Typechecking
UnitView.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  changeSelectedUnit: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitView.defaultProps = {
  unit: null,
  match: {},
};
