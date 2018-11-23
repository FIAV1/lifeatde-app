import LocalStorage from './LocalStorage';
import history from './history';

class Api {
    static headers() {
        let token = LocalStorage.get('token');

        let headers = {
            'Accept': 'application/json',
        };

        if(token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    static get(route) {
        return this.xhr(route, null, 'GET')
    }

    static put(route, params) {
        return this.xhr(route, params, 'PUT')
    }

    static post(route, params) {
        return this.xhr(route, params, 'POST')
    }

    static delete(route, params) {
        return this.xhr(route, params, 'DELETE')
    }

    static async xhr (route, params, verb) {
        const scope = '/api';
        let url;
        
        if(params === 'none'){
            url = `${route}`;
            params = null;
        } else {
            url = `${scope}${route}`
        }

        let options = {
            method: verb,
            headers: Api.headers(),
        };

        if (params && params instanceof FormData) {
            options.body = params;
        } else if (params) {
            options.body = JSON.stringify(params);
            options.headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, options);

        if (response.ok) {
            return response.json();
        }
        if (response.status === 401) {
            LocalStorage.delete('token');
            LocalStorage.delete('user');
            history.push('/login');
        }
        if (response.status === 500) {
            let error = {
                errors: [{
                    detail: 'Server irraggiungibile, riprova più tardi :(',
                    status: 500
                }]
            };
            LocalStorage.delete('token');
            LocalStorage.delete('user');
            history.push('/login');
            throw error;
        }
        const error = await response.json();
        throw error;
    }

    static async download(route) {
        let options = {
            method: 'GET',
            headers: Api.headers()
        };
        const response = await fetch(route, options);
        let error = {
            errors: [{
                detail: 'C\'è stato un problema durante il download, riprova più tardi',
                status: response.status,
            }]
        };
        if (response.redirected) {
            try {
                return response.url;
            }
            catch (e) {
                throw error;
            }
        }
        else {
            throw error;
        }
    }
}

export default Api;