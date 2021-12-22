const { User } = require('./User');

class Message {
    /**
     * 
     * @param {User} user 
     * @param {string} msg 
     */
    constructor(user, msg, time) {
        this._user = user;
        this._time = time;
        this._msg = msg;
        this._resTo = {};
    }

    get user() {
        return this._user;
    }

    get msg() {
        return this._msg;
    }

    get time() {
        return this._time;
    }

    waitingToBeSendTo(userId) {
        if (userId in this._resTo)
            return this._resTo[userId];
        return false;
    }

    to(userId) {
        this._resTo[userId] = true;
    }

    markSent(userId) {
        if (userId in this._resTo)
            this._resTo[userId] = false;
    }

    /**
     * Obs:
     *  > si vacio [] -> Boolean([]) === true -> !true = 
     * !undefined === true
     * @returns {boolean}
     */
    sentToAll() {
        let verif = Object.values(this._resTo);
        if (verif.length === 0)
            return true;
        return !verif.find(b => b);
    }
}

module.exports = {
    Message
}
