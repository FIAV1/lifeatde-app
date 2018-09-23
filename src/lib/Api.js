import LocalStorage from './LocalStorage';

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

    static get(history, route) {
        return this.xhr(history, route, null, 'GET')
    }

    static put(history, route, params) {
        return this.xhr(history, route, params, 'PUT')
    }

    static post(history, route, params) {
        return this.xhr(history, route, params, 'POST')
    }

    static delete(history, route, params) {
        return this.xhr(history, route, params, 'DELETE')
    }

    static xhr (history, route, params, verb) {
        const scope = '/api'
        const url = `${scope}${route}`

        let options = Object.assign({method: verb}, params ? {body: JSON.stringify(params)} : null)

        options.headers = Api.headers()

        return fetch(url, options).then( resp => {
            let json = resp.json()
            if (resp.ok) {
                return json;
            }
            if([401, 403].indexOf(resp.status) > -1 ) {
                LocalStorage.delete('user');
                history.push('/');
            }
            return json.then(err => {throw err})
        })
    }
}

export default Api