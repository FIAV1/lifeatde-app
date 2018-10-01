class LocalStorage {
    static get(key) {
        let object = localStorage.getItem(key);

        return JSON.parse(object);
    }

    static set(key, object) {
        let string = JSON.stringify(object);

        localStorage.setItem(key, string);
    }

    static delete(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

export default LocalStorage;