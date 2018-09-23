import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Login from './containers/Login';
import ProjectContainer from './containers/ProjectContainer';
import NoMatch from './components/NoMatch';

class App extends Component {
	render() {
		return (
			<Switch>
				<Route exact path='/login' component={Login}/>
				<PrivateRoute exact path='/' component={ProjectContainer}/>
				<Route component={NoMatch} />
			</Switch>
		);
	}
}
	
export default App;
	