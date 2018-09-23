import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContainer from '../containers/AppContainer';
import Authentication from '../lib/Authentication';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render = { props => (
            Authentication.isAuthenticated() ? (
                <AppContainer {...props}>
                    <Component {...props} />
                </AppContainer>
            ) : (
                <Redirect
                    to={{
                    pathname: "/login",
                    state: { from: props.location }
                }}/>
            )
        )}
    />
);

export default PrivateRoute;