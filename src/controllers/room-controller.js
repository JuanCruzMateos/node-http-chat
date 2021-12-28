const RoomService = require('../services/room-service');
const LongPolling = require('./long-polling');

/**
 * @method "POST"
 * @path = "/api/room"
 */
const newRoom = async (name, email, response) => {

    try {
        let ids = await RoomService.newChatRoom(name, email);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(JSON.stringify(ids));
    } catch (error) {
        console.log(error);
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write("");
    } finally {
        response.end();
    }
}

/**
 * @method "PUT"
 * @path = "/api/room/:roomId"
 */
const enterRoom = async (name, email, roomId, response) => {

    try {
        let newUserId = await RoomService.enterChatRoom(name, email, roomId);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(newUserId);
        RoomService.newNotification(newUserId, roomId, new Date().toLocaleTimeString().substring(0, 5), `${name} has entered the room`);
        LongPolling.checkPendingResponses(RoomService.getMessage); // mensaje de nuevo usuario
    } catch (error) {
        console.log(error);
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write('');
    } finally {
        response.end();
    }
}


/**
 * @method "PUT"
 * @path = "/api/message/:roomId/:userId"
 */
const newMessage = async (userId, msg, time, roomId, response) => {
    // Guardo el mensaje y respondo ok
    try {
        let res = await RoomService.newMessage(userId, msg, time, roomId);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(res);
        // Recorro las responses a la espera de un mensaje
        LongPolling.checkPendingResponses(RoomService.getMessage);
    } catch (error) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write(error);
    } finally {
        response.end();
    }
}


/**
 * @method "GET"
 * @path = "/api/message/:roomId/:userId"
 */
const getMessage = (userId, roomId, response) => {
    // Guardo la response a la espera de mensajes
    LongPolling.saveResponse(userId, roomId, response);
}


/**
 * @method "DELETE"
 * @path = /api/room/:roomId/:userId"
 */
const leaveRoom = async (userId, roomId, response) => {

    try {
        let name = await RoomService.leaveRoom(userId, roomId);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(name);
        RoomService.newNotification(userId, roomId, new Date().toLocaleTimeString().substring(0, 5), `${name} has left the room`)
        LongPolling.checkPendingResponses(RoomService.getMessage);
    } catch (error) {
        console.log(error);
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write('');
    } finally {
        response.end();
    }
}


module.exports = {
    newRoom,
    enterRoom,
    newMessage,
    getMessage,
    leaveRoom
}
