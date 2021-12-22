const RoomRepository = require('../repository/room-repository');

/**
 * Create a new Chat Room
 * @param {string} name 
 * @param {string} email 
 * @returns {Promise} userId, roomId
 */
const newChatRoom = (name, email) => {

    let ids = RoomRepository.newChatRoom(name, email);
    return new Promise((resolve, _) => {
        resolve(ids);
    });
}

/**
 * Enter a char room
 * @param {string} name 
 * @param {string} email 
 * @param {string} roomId 
 * @returns {Promise<String>} userId
 */
const enterChatRoom = (name, email, roomId) => {

    let userId = RoomRepository.enterChatRoom(name, email, roomId);
    return new Promise((resolve, reject) => {
        if (userId !== null) {
            resolve(userId);
        } else {
            reject("Room not found");
        }
    });
}


/**
 * New message
 * @param {string} userId 
 * @param {string} msg 
 * @param {string} time 
 * @param {string} roomId 
 * @returns {Promise<String>} "message saved un/succesfully"
 */
const newMessage = (userId, msg, time, roomId) => {

    let success = RoomRepository.newMessage(userId, msg, time, roomId);
    return new Promise((resolve, reject) => {
        success ? resolve("Message saved successfully") : reject("Error while handling new message");
    });
}


/**
 * Send Messages
 * @param {string} userId user asking for msg
 * @param {string} roomId user's room id
 * @returns {Promise<Object>}
 */
const getMessage = (userId, roomId) => {

    let message = RoomRepository.getMessage(userId, roomId);
    return new Promise((resolve, reject) => {
        if (message === null)
            reject(`No messages pending for user=${userId} on room=${roomId}`);
        else
            resolve(message);
    });
}


/**
 * 
 * @param {String} userId 
 * @param {String} roomId 
 * @param {String} time 
 * @param {String} message 
 * @returns {Promise<String>} 
 */
const newNotification = (userId, roomId, time, message) => {
    let ok = RoomRepository.notification(userId, roomId, time, message);
    return new Promise((resolve, reject) => {
        if (ok) {
            resolve("Notification sent succesfully");
        } else {
            reject("Error while saving the notification");
        }
    });
}


/**
 * 
 * @param {String} userId 
 * @param {String} roomId 
 * @returns 
 */
const leaveRoom = (userId, roomId) => {
    let ok = RoomRepository.leaveRoom(userId, roomId);
    return new Promise((resolve, reject) => {
        if (ok.response) {
            resolve(ok.name);
        } else {
            reject("Error while removing the user");
        }
    });
}


module.exports = {
    newChatRoom,
    enterChatRoom,
    newMessage,
    getMessage,
    newNotification,
    leaveRoom
}