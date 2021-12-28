'use strict';
const { User } = require('../model/User');
const { ChatRoom } = require('../model/ChatRoom');
const { Message } = require('../model/Message');

const activeRooms = new Map();

const garbageCollertor = () => {
    // let now = new Date();
    for (const [id, room] of activeRooms.entries()) {
        if (room.isEmpty()) {
            activeRooms.delete(id);
        }
    }
}

setInterval(() => {
    console.log("running the gbc");
    garbageCollertor();
    console.log("active rooms", activeRooms);
}, 1000 * 60);


/**
 * Create a new Chat Room
 * @param {string} name 
 * @param {string} email 
 * @returns {Object} userId, roomId
 */
const newChatRoom = (name, email) => {
    let newRoom = new ChatRoom();
    let roomUser = new User(name, email);

    newRoom.addUser(roomUser);
    activeRooms.set(newRoom.id, newRoom);
    return { userId: roomUser.id, roomId: newRoom.id };
}

/**
 * Enter a char room
 * @param {string} name 
 * @param {string} email 
 * @param {string} roomId 
 * @returns {String} userId
 */
const enterChatRoom = (name, email, roomId) => {

    if (!activeRooms.has(roomId)) {
        return null;
    } else {
        let user = new User(name, email);
        let room = activeRooms.get(roomId);
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
 * @returns {boolean}
 */
const newMessage = (userId, msg, time, roomId) => {
    let response = false;

    if (activeRooms.has(roomId)) {
        let room = activeRooms.get(roomId);
        // if (room.users.size > 1) {
        let message = new Message(room.getUser(userId), msg, time);
        for (let [id, _] of room.users.entries()) {
            if (id !== userId)
                message.to(id);
        }
        room.addMessage(message);
        response = true;
        // }
    }
    return response;
}

/**
 * Send Messages
 * @param {string} userId user asking for msg
 * @param {string} roomId user's room id
 * @returns {Object} message
 */
const getMessage = (userId, roomId) => {
    let response = null;

    if (activeRooms.has(roomId)) {
        let room = activeRooms.get(roomId);
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


const notification = (userId, roomId, time, message) => {
    let response = false;

    if (activeRooms.has(roomId)) {
        let room = activeRooms.get(roomId);
        // if (room.users.size > 1) {
        let msg = new Message(room.bot, message, time);
        for (const [id, _] of room.users.entries()) {
            if (id !== userId) {
                msg.to(id);
            }
        }
        room.addMessage(msg);
        response = true;
        // }
    }
    return response;
}


const leaveRoom = (userId, roomId) => {
    let response = false;
    let name;

    if (activeRooms.has(roomId)) {
        let room = activeRooms.get(roomId);
        if (room.hasUser(userId)) {
            name = room.getUser(userId).name;
            room.removeUser(userId);
            response = true;
        }
    }
    return { response, name };
}


module.exports = {
    newChatRoom,
    enterChatRoom,
    newMessage,
    getMessage,
    notification,
    leaveRoom
}