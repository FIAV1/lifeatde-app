import jwt_decode from 'jwt-decode';

import Api from './Api';
import LocalStorage from './LocalStorage';
import history from './history';

class Authentication {
    static isAuthenticated() {
        try {
            let token = LocalStorage.get('token')

            if(token) {
                let decoded = jwt_decode(token);

                if(decoded.exp>(Date.now()/1000)){
                    return true;
                }
            }
            
            return false;
        } catch(error) {
            return false
        }
    }

    static async login(credentials) {
        return Api.post('/login', credentials).then(response => {
            LocalStorage.set('user', response);
            LocalStorage.set('token', response.data.attributes.token);
            return response;
        }).catch(e => {
            throw e
        });
    }

    static logout() {
        try {
            LocalStorage.delete('token');
            LocalStorage.delete('user');
            history.push('/login');
        } catch(error) {
            LocalStorage.delete('token');
            LocalStorage.delete('user');
            history.push('/login');
        }
    }
}

export default Authentication;