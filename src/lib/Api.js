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
        const url = `${scope}${route}`

        let options = Object.assign({method: verb}, params ? {body: JSON.stringify(params)} : null)

        options.headers = Api.headers()

        return fetch(url, options).then( response => {
            let json = response.json()
            if (response.ok) {
                return json;
            }
            if(response.status === 401 ) {
                LocalStorage.delete('user');
                history.push('/');
            }
            return json.then(err => {throw err})
        })
    }
}

export default Api;