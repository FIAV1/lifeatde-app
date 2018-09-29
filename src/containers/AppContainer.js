import React, { Component } from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Authentication from '../lib/Authentication';

class AppContainer extends Component {
    render() {
        if(!Authentication.isAuthenticated()) {
            return this.props.children
        }
        return(
            <div>
                <Navbar {...this.props}/>
                {this.props.children}
                <Footer />
            </div>
        )
    }
}

export default AppContainer;