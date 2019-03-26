// TODO: Move this before commit
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { getDistricts } from '../../redux/selectors/district';
import { fetchDistrictsData, setHighlightedDistrict } from '../../redux/actions/district';

class AddressInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressData: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    this.fetchAddressData(match);
  }

  componentDidUpdate() {
    const { match } = this.props;
    const { addressData } = this.state;
    if (
      addressData
      && match.params.street === addressData.street.name.fi
      && match.params.number === addressData.number
      && match.params.municipality === addressData.street.municipality
    ) {
      // console.log('same address');
    } else {
      this.fetchAddressData(match);
    }
  }

  fetchAddressData = async (match) => {
    // TODO: check why municipality filter is not working
    await fetch(`https://api.hel.fi/servicemap/v2/search/?type=address&municipality=${match.params.municipality}&q=${match.params.street} ${match.params.number}`)
      .then(response => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const address = data.results[0];
          if (address.letter) {
            address.number += address.letter;
          }
          this.setState({ addressData: data.results[0] });
          this.fetchDistricts(data.results[0].location.coordinates);
        } else {
          console.log('error');
        }
      });
  }

  fetchDistricts = async (lnglat) => {
    const { fetchDistrictsData } = this.props;
    fetchDistrictsData({ lat: lnglat[1], lng: lnglat[0] });
  }


  showDistrictOnMap = (district) => {
    const { setHighlightedDistrict } = this.props;
    setHighlightedDistrict(district);
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    const { match } = this.props;
    this.fetchAddressData(match);
  }

  render() {
    const { match, districts } = this.props;
    const { addressData } = this.state;
    return (
      <div>
        <p>
          {addressData
            ? `${addressData.street.name.fi} ${addressData.number}, ${match.params.municipality}`
            : 'Loading...'}
        </p>
        {districts[0] ? (
          <p>
            {`Neighbourhood: ${districts[0].name.fi}`}
            <br />
            {`Postcode: ${districts[1].name.fi}`}
          </p>
        ) : null}

        {/* These will be probably moved to own child component later */}
        <ul>
          {districts.map(district => (
            <li key={district.id}>
              <ButtonBase
                onClick={() => {
                  this.showDistrictOnMap(district);
                }}
              >
                {district.name ? (
                  `${district.type}: ${district.name.fi}`
                ) : `${district.type}` }
              </ButtonBase>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const districts = getDistricts(state);
  return {
    districts,
  };
};

export default connect(
  mapStateToProps,
  { fetchDistrictsData, setHighlightedDistrict },
)(AddressInfo);

AddressInfo.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  fetchDistrictsData: PropTypes.func.isRequired,
  setHighlightedDistrict: PropTypes.func.isRequired,
  districts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AddressInfo.defaultProps = {
  match: {},
};
