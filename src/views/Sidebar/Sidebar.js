import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import AddressInfo from './AddressInfo';

const Test = () => (
  <div> Temporary </div>
);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Sidebar" style={{ height: '100%' }}>
        <Switch>
          <Route path="/:lng/unit/:unit" component={Test} />
          <Route path="/:lng/search" component={Test} />
          <Route path="/:lng/address/:municipality/:street/:number" component={AddressInfo} />
        </Switch>
      </div>
    );
  }
}
export default Sidebar;
