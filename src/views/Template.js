import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
// import { connect } from 'react-redux'
// import { unitsFetchData, setFilter } from '../redux/actions'
// import { getUnitsState, getLoadingState, getErrorState } from '../redux/selectors'

// Simple fetch + filter test using redux, redux-thunk and reselect
class Template extends Component {
  componentDidMount() {
    const { unitsFetchData } = this.props
    // unitsFetchData()
  }

  render() {
    // const { hasErrored, isLoading, units, setFilter } = this.props
    return (
      <p>
        Running server side
      </p>
    );
  }
}
// Import redux state to component props
/*const mapStateToProps = (state) => {
  const units = getUnitsState(state)
  const hasErrored = getErrorState(state)
  const isLoading = getLoadingState(state)
  return {
    units,
    hasErrored,
    isLoading,
  }
} */

export default Template

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
