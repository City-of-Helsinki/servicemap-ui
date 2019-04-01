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
    const { unit, classes } = this.props;
    const { unitData, isFetching } = this.state;
    console.log(unit);

    if (isFetching) {
      return (
        <p>Loading unit data</p>
      );
    }

    if (unit && unitData) {
      return (
        <div className={classes.root}>
          <div className="Content">
            {
                unitData.picture_url
                && <img alt="Unit" src={unitData.picture_url} />
              }

            <Typography color="primary" variant="h3">
              {unitData.name && unitData.name.fi}
            </Typography>
            <span>
              {unitData.provider && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unitData.provider }} />}
            </span>
            <span>
              {unitData.data_source && <FormattedMessage id="unit.data_source" defaultMessage={'Source: {data_source}'} values={{ data_source: unitData.data_source }} />}
            </span>
            {
                unitData.contract_type
                && unitData.contract_type.description
                && unitData.contract_type.description.fi
                && <p className="text-small">{unitData.contract_type.description.fi}</p>
              }

            <p>{`${unitData.street_address && unitData.street_address.fi}, ${unitData.address_zip} ${unitData.municipality ? unitData.municipality.charAt(0).toUpperCase() + unitData.municipality.slice(1) : ''}`}</p>

            {
                unitData.www && unitData.www.fi
                && <a href={unitData.www.fi}><p>Kotisivu</p></a>
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
