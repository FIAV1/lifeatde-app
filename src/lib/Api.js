class Api {
    static headers() {
        let token = null;

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'application/json',
            'X-Request-With': 'XMLHttpRequest',
        }

        if(token = localStorage.getItem('token')) {
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

    static xhr (route, params, verb) {
        const scope = '/api'
        const url = `${scope}${route}`

        let options = Object.assign({method: verb}, params ? {body: JSON.stringify(params)} : null)

        options.headers = Api.headers()

        return fetch(url, options).then( resp => {
            let json = resp.json()
            if (resp.ok) {
                return json;
            }
            return json.then(err => {throw err})
        })
    }
}

export default Api