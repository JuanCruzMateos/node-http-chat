const RoomService = require('../services/room-service');
const LongPolling = require('./long-polling');

/**
 * @method "POST"
 * @path = "/api/room"
 */
const newRoom = (name, email, response) => {
    let newIds = RoomService.newChatRoom(name, email);

    newIds
        .then(ids => {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write(JSON.stringify(ids));
        })
        .catch(error => {
            console.log(error);
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(JSON.stringify({}));
        })
        .finally(() => response.end());
}

/**
 * @method "PUT"
 * @path = "/api/room/:roomId"
 */
const enterRoom = (name, email, roomId, response) => {
    let newUserId = RoomService.enterChatRoom(name, email, roomId);

    newUserId
        .then(userId => {
            // console.log(userId);
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write(userId);
            RoomService.newNotification(userId, roomId, new Date().toLocaleTimeString().substring(0, 5), `${name} has entered the room`);
        })
        .catch(error => {
            console.log(error);
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write('');
        })
        .finally(() => {
            response.end();
            LongPolling.checkPendingResponses(RoomService.getMessage); // mensaje de nuevo usuario
        });
}


/**
 * @method "PUT"
 * @path = "/api/message/:roomId/:userId"
 */
const newMessage = (userId, msg, time, roomId, response) => {
    // Guardo el mensaje y respondo ok
    let msgPromise = RoomService.newMessage(userId, msg, time, roomId);

    msgPromise
        .then(res => {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write(res);
            // Recorro las responses a la espera de un mensaje
            LongPolling.checkPendingResponses(RoomService.getMessage);
        })
        .catch(error => {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(error);
        })
        .finally(() => response.end());
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
const leaveRoom = (userId, roomId, response) => {
    let prom = RoomService.leaveRoom(userId, roomId);

    prom.
        then(name => {
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write(name);
            RoomService.newNotification(userId, roomId, new Date().toLocaleDateString().substring(0, 5), `${name} has left the room`)
        }).catch((err) => {
            console.log(err);
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write('');
        })
        .finally(() => {
            response.end();
            LongPolling.checkPendingResponses(RoomService.getMessage);
        });
}


module.exports = {
    newRoom,
    enterRoom,
    newMessage,
    getMessage,
    leaveRoom
}
