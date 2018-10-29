import LocalStorage from './LocalStorage';
import history from './history';

class Api {
    static headers() {
        let user = LocalStorage.get('user')

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'application/json',
            'X-Request-With': 'XMLHttpRequest',
        }

        if(user) {
            headers['Authorization'] = `Bearer ${user.data.attributes.token}`;
        }

        return headers;
    }

    static download(route) {
        return this.test(route, 'GET')
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

    static xhr (route, params, verb) {
        const scope = '/api'
        let url;
        
        if(params === 'none'){
            url = `${route}`;
            params = null;
        } else {
            url = `${scope}${route}`
        }

        let options = Object.assign({method: verb}, params ? {body: JSON.stringify(params)} : null)

        options.headers = Api.headers()

        return fetch(url, options).then( response => {

            if (response.ok) {
                return response.json();
            }

            if(response.status === 401) {
                LocalStorage.delete('user');
                history.push('/login');
            }

            if(response.status === 500) {
                let error = {
                    errors: [{
                            detail: 'Server irraggiungibile, riprova più tardi :(',
                            status: 500
                        }]
                };
                LocalStorage.delete('user');
                history.push('/login')
                throw error;
            }

            return response.json().then(error => {throw error});
        });
    }

    static test(route, verb) {
        let options = Object.assign({method: verb}, null)

        options.headers = Api.headers();

        return fetch(route, options).then(response => {
            if(response.ok) {
                return response.blob();
            }
            
            return response.blob().then(error => {throw error});
        });
    }
}

export default Api;