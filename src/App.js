import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppContainer from './containers/AppContainer';
import Login from './containers/Login';

import ProjectCardsContainer from './containers/ProjectCardsContainer';
import ProjectContainer from './containers/ProjectContainer';
import StudyGroupCardsContainer from './containers/StudyGroupCardsContainer';
import StudyGroupContainer from './containers/StudyGroupContainer';
import NewsCardsContainer from './containers/NewsCardsContainer';
import SearchContainer from './containers/SearchContainer';
import BookCardsContainer from "./containers/BookCardsContainer";
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
					<PrivateRoute exact path='/search' component={SearchContainer}/>
					<PrivateRoute exact path='/projects/:id' component={ProjectContainer}/>
					<PrivateRoute exact path='/study_groups' component={StudyGroupCardsContainer}/>
					<PrivateRoute exact path='/study_groups/:id' component={StudyGroupContainer}/>
					<PrivateRoute exact path='/news' component={NewsCardsContainer}/>
					<PrivateRoute exacts path='/search' component={SearchContainer}/>
                    <PrivateRoute exact path='/books' component={BookCardsContainer}/>
					<PrivateRoute component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	