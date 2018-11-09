import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authentication from '../../lib/Authentication';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render = { props => (
            Authentication.isAuthenticated() ? (
                <Component {...props} />
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