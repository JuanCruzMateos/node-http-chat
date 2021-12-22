const { v4: uuidv4 } = require("uuid");
const { User } = require("./User");
const { Message } = require("./Message")


class ChatRoom {
    constructor() {
        this._id = uuidv4();
        this._users = new Map();
        this._messages = []; // queue
        this._bot = new User("bot", null);
        this.lastInteraction = new Date();
    }

    /**
     * 
     * @param {User} user 
     */
    addUser(user) {
        this._users.set(user.id, user);
    }

    hasUser(userId) {
        return this._users.has(userId);
    }

    /**
     * Si no existe no tiene efecto
     * @param {String} userId
     */
    removeUser(userId) {
        this._users.delete(userId);
    }

    /**
     * Return the user with the id
     * @param {string} id 
     * @returns 
     */
    getUser(id) {
        return this._users.get(id);
    }

    /**
     * 
     * @param {Message} msg 
     */
    addMessage(msg) {
        this._messages.push(msg);
    }

    /**
     * 
     * @returns {Message}
     */
    nextMessage() {
        return (this._messages.length > 0) ? this._messages[0] : null;
    }


    removeMessage() {
        this._messages.shift();
    }


    isEmpty() {
        return this._users.size === 0;
    }

    get id() {
        return this._id;
    }


    get users() {
        return this._users;
    }

    get messages() {
        return this._messages;
    }

    get bot() {
        return this._bot;
    }
}

module.exports = {
    ChatRoom
}

