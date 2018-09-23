import Api from './Api';
import LocalStorage from './LocalStorage';
import jwt_decode from 'jwt-decode';

class Authentication {
    static isAuthenticated() {
        let user = LocalStorage.get('user')

        if(user) {
            let token = user.data.attributes.token;
            let decoded = jwt_decode(token);

            if(decoded.exp>(Date.now()/1000)){
                return true;
            }
        }
        
        return false;
    }

    static invalidToken({errors}, history) {
        if(errors.some(error => [401, 403].indexOf(error.status) > -1)) {
            LocalStorage.delete('user');
            history.push('/');
        }
    }

    static login(history, credentials) {
        return Api.post(history, '/login', credentials).then(response => {
            LocalStorage.set('user', response);
            return response;
        }).catch(e => {
            throw e
        });
    }

    static logout(history) {
        LocalStorage.delete('user');
        history.push('/login');
    }
}

export default Authentication;