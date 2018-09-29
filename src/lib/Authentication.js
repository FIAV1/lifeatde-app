import Api from './Api';
import LocalStorage from './LocalStorage';
import jwt_decode from 'jwt-decode';
import history from '../lib/history';

class Authentication {
    static isAuthenticated() {
        try {
            let user = LocalStorage.get('user')

            if(user) {
                let token = user.data.attributes.token;
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

    static login(credentials) {
        return Api.post('/login', credentials).then(response => {
            LocalStorage.set('user', response);
        }).catch(e => {
            throw e
        });
    }

    static logout() {
        try {
            LocalStorage.delete('user');
            history.push('/login');
        } catch(error) {
            history.push('/login');
        }
    }
}

export default Authentication;