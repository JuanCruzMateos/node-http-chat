const { v4: uuidv4 } = require('uuid');

class User {
    /**
     * Constructor
     * @param {String | void} name 
     * @param {String | void} email 
     */
    constructor(name, email) {
        this._id = uuidv4();
        this._name = name;
        this._email = email;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }

    set name(name) {
        this._name = name;
    }

    toString() {
        return `id=${this._id}, name=${this._name}, email=${this._email}`
    }
}

module.exports = {
    User
}
