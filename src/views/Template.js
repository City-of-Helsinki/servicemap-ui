import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { unitsFetchData, setFilter } from '../redux/actions'
import { getUnitsState, getLoadingState, getErrorState } from '../redux/selectors'

// Simple fetch + filter test using redux, redux-thunk and reselect
class Template extends Component {
  componentDidMount() {
    const { unitsFetchData } = this.props
    unitsFetchData()
  }

  render() {
    const { hasErrored, isLoading, units, setFilter } = this.props
    const cities = ['helsinki', 'espoo', 'vantaa']
    if (hasErrored) {
      return <p>Error fetching units</p>
    }
    if (isLoading) {
      return <p>Loading…</p>
    }
    return (
      <div>
        {cities.map(city => (
          <Button
            variant="outlined"
            color="primary"
            key={city}
            onClick={() => setFilter('municipality', city)}
          >
            {city}
          </Button>
        ))}
        <ul style={{ listStyleType: 'none' }}>
          {units.map(unit => (
            <li key={unit.id}>
              {unit.name.fi}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
// Import redux state to component props
const mapStateToProps = (state) => {
  const units = getUnitsState(state)
  const hasErrored = getErrorState(state)
  const isLoading = getLoadingState(state)
  return {
    units,
    hasErrored,
    isLoading,
  }
}

export default connect(
  mapStateToProps,
  { unitsFetchData, setFilter },
)(Template)

// Typechecking
Template.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object),
  hasErrored: PropTypes.bool,
  isLoading: PropTypes.bool,
  unitsFetchData: PropTypes.func,
  setFilter: PropTypes.func,
}

Template.defaultProps = {
  units: [],
  hasErrored: false,
  isLoading: false,
  unitsFetchData: null,
  setFilter: null,
}
