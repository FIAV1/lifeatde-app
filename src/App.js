import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppContainer from './containers/AppContainer';
import Login from './containers/Login';
import ProjectCardsContainer from './containers/ProjectCardsContainer';
import ProjectContainer from './containers/ProjectContainer';
import PrivateRoute from './components/PrivateRoute';
import SearchContainer from './containers/SearchContainer';
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
					<PrivateRoute exact path='/search' component={SearchContainer}/>
					<PrivateRoute exact path='/projects/:id' component={ProjectContainer}/>
					<PrivateRoute component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	