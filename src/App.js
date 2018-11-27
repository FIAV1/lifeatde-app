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
import BookCardsContainer from './containers/BookCardsContainer';
import BookContainer from './containers/BookContainer';
import BookNewContainer from './containers/BookNewContainer';
import BookEditContainer from "./containers/BookEditContainer";
import PrivateRoute from './components/common/PrivateRoute';
import NoMatch from './components/common/NoMatch';
import ProjectNewContainer from './containers/ProjectNewContainer';
import ProjectEditContainer from './containers/ProjectEditContainer';
import UserProfile from './containers/UserProfile';
import StudyGroupNewContainer from './containers/StudyGroupNewContainer';
import StudyGroupEditContainer from './containers/StudyGroupEditContainer';

class App extends Component {
	render() {
		return (
			<AppContainer {...this.props}>
				<Switch>
					<Route exact path='/login' component={Login}/>
					<Redirect exact from='/' to='/projects'/>
					<PrivateRoute exact path='/projects' component={ProjectCardsContainer}/>
					<PrivateRoute exact path='/projects/new' component={ProjectNewContainer}/>
					<PrivateRoute exact path='/projects/:id' component={ProjectContainer}/>
					<PrivateRoute exact path='/projects/:id/edit' component={ProjectEditContainer}/>
					<PrivateRoute exact path='/study_groups' component={StudyGroupCardsContainer}/>
					<PrivateRoute exact path='/study_groups/new' component={StudyGroupNewContainer}/>
					<PrivateRoute exact path='/study_groups/:id' component={StudyGroupContainer}/>
					<PrivateRoute exact path='/study_groups/:id/edit' component={StudyGroupEditContainer}/>
					<PrivateRoute exact path='/news' component={NewsCardsContainer}/>
					<PrivateRoute exact path='/search' component={SearchContainer}/>
					<PrivateRoute exact path='/books' component={BookCardsContainer}/>
                    <PrivateRoute exact path='/books/new' component={BookNewContainer}/>
                    <PrivateRoute exact path='/books/:id' component={BookContainer}/>
<<<<<<< HEAD
					<PrivateRoute exact path='/users/:id' component={UserProfile} />
=======
                    <PrivateRoute exact path='/books/:id/edit' component={BookEditContainer}/>
>>>>>>> * Implementate create e edit di un libro
					<PrivateRoute component={NoMatch} />
				</Switch>
			</AppContainer>
		);
	}
}
	
export default App;
	