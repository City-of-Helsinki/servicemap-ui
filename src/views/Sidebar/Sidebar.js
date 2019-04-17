import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Search from '../SearchView';
import UnitView from '../UnitView';
import HomeView from '../HomeView';
import ServiceView from '../Service/ServiceView';
import MobileMapView from '../MobileMapView';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Sidebar" style={{ height: '100%' }}>
        <Switch>
          <Route path="/:lng/unit/:unit" component={UnitView} />
          <Route path="/:lng/search" component={Search} />
          <Route path="/:lng/service/:service" component={ServiceView} />
          <Route path="/:lng/map" component={MobileMapView} />
          <Route path="/:lng/" component={HomeView} />
        </Switch>
      </div>
    );
  }
}
export default Sidebar;
