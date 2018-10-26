import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppContainer from './containers/AppContainer';
import Login from './containers/Login';

import ProjectCardsContainer from './containers/ProjectCardsContainer';
import StudyGroupCardsContainer from './containers/StudyGroupCardsContainer';
import NewsCardsContainer from './containers/NewsCardsContainer';

import PrivateRoute from './components/PrivateRoute';
import NoMatch from './components/NoMatch';
import SearchContainer from './containers/SearchContainer';

class App extends Component {
	render() {
		return (
			<AppContainer {...this.props}>
				<Switch>
					<Route exact path='/login' component={Login}/>
					<Redirect exact from='/' to='/projects'/>
					<PrivateRoute exact path='/projects' component={ProjectCardsContainer}/>
					<PrivateRoute exact path='/studygroups' component={StudyGroupCardsContainer}/>
					<PrivateRoute exact path='/news' component={NewsCardsContainer}/>
					<PrivateRoute exacts path='/search' component={SearchContainer}/>
					<PrivateRoute component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	