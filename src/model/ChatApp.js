const { User } = require('./User');
const { ChatRoom } = require('./ChatRoom');
const { Message } = require('./Message');


class ChatApp {
    constructor() {
        this._activeRooms = new Map();
    }

    exists(roomId) {
        return this._activeRooms.has(roomId);
    }

    /**
     * Create a new Chat Room
     * @param {Object} userData {.name, .email}
     */
    newChatRoom(userData) {
        let newRoom = new ChatRoom();
        let roomUser = new User(userData.name, userData.email);

        newRoom.addUser(roomUser);
        this._activeRooms.set(newRoom.id, newRoom);
        return { userId: roomUser.id, roomId: newRoom.id }
    }

    /**
     * Enter a char room
     * @param {Object} userData {.name, .email}
     * @param {string} roomId 
     * @returns {null | string}
     */
    enterChatRoom(userData, roomId) {

        if (!this._activeRooms.has(roomId)) {
            return null;
        } else {
            let user = new User(userData.name, userData.email);
            let room = this._activeRooms.get(roomId);
            room.addUser(user);
            return user.id;
        }
    }

    /**
     * New message
     * @param {string} userId 
     * @param {string} msg 
     * @param {string} time 
     * @param {string} roomId 
     */
    newMessage(userId, msg, time, roomId) {

        if (this._activeRooms.has(roomId)) {
            let room = this._activeRooms.get(roomId);
            if (room.users.size > 1) {
                let message = new Message(room.getUser(userId), msg, time);
                for (let [id, _] of room.users.entries()) {
                    if (id !== userId)
                        message.to(id);
                }
                room.addMessage(message);
            }
        }
    }

    /**
     * Send Messages
     * @param {string} userId user asking for msg
     * @param {string} roomId user's room id
     * @returns {null | Object}
     */
    getMsg(userId, roomId) {
        let response = null;;

        if (this._activeRooms.has(roomId)) {
            let room = this._activeRooms.get(roomId);
            let message = room.nextMessage();
            if (message !== null) {
                if (message.waitingToBeSendTo(userId)) {
                    message.markSent(userId);
                    if (message.sentToAll())
                        room.removeMessage();
                    response = {
                        user: message.user.name,
                        msg: message.msg,
                        time: message.time
                    }
                }
            }
        }
        return response;
    }

}

module.exports = {
    ChatApp
};
