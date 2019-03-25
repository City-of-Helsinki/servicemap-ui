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
      fetching: false,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    this.fetchAddressData(match);
  }

  fetchAddressData = async (match) => {
    this.setState({ fetching: true});
    await fetch(`https://api.hel.fi/servicemap/v2/search/?type=address&municipality=${match.params.municipality}&q=${match.params.street} ${match.params.number}`)
      .then(response => response.json())
      .then((data) => {
        this.setState({ addressData: data.results[0], fetching: false });
        this.fetchDistricts(data.results[0].location.coordinates);
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

  render() {
    const { match, districts } = this.props;
    const { addressData, fetching } = this.state;
    // TODO: better if
    console.log(addressData);
    // console.log(match.params.street, ' vs: ', addressData.street.name.fi);
    // console.log(match.params.number, ' vs: ', addressData.number);
    // console.log(match.params.municipality, ' vs: ', addressData.number);
    if (
      (!addressData && !fetching)
      || (match.params.street !== addressData.street.name.fi
      && match.params.number !== addressData.number)
      || match.params.municipality !== addressData.street.municipality
    ) {
      console.log('fetching address');
      this.fetchAddressData(match);
    }
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
