import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import AppContainer from './containers/AppContainer';
import Login from './containers/Login';
import ProjectContainer from './containers/ProjectContainer';
import NoMatch from './components/NoMatch';

class App extends Component {
	render() {
		return (
			<AppContainer {...this.props}>
				<Switch>
					<Route exact path='/login' component={Login}/>
					<Redirect exact from='/' to='/projects'/>
					<PrivateRoute exact path='/projects' component={ProjectContainer}/>
					<PrivateRoute exact path='/studygroups' component={ProjectContainer}/>
					<PrivateRoute component={NoMatch} />
					<Route exact path='/InternalServerError' component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	