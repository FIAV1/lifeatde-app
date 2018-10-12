import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppContainer from './containers/AppContainer';
import Login from './containers/Login';
import ProjectCardsContainer from './containers/ProjectCardsContainer';
import PrivateRoute from './components/PrivateRoute';
import NoMatch from './components/NoMatch';

class App extends Component {
	render() {
		return (
			<AppContainer {...this.props}>
				<Switch>
					<Route exact path='/login' component={Login}/>
					<Redirect exact from='/' to='/projects'/>
					<PrivateRoute exact path='/projects' component={ProjectCardsContainer}/>
					<PrivateRoute exact path='/studygroups' component={ProjectCardsContainer}/>
					<PrivateRoute component={NoMatch} />
					<Route exact path='/InternalServerError' component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	