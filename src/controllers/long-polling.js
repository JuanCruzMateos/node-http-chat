"use strict";


let pendingResponses = [];


function PendingResponse(userId, roomId, response) {
    this.userId = userId;
    this.roomId = roomId;
    this.response = response;
}


PendingResponse.prototype.toString = function toString() {
    return `userId=${this.userId}, roomId=${this.roomId}`;
}


const saveResponse = (userId, roomId, response) => {
    pendingResponses.push(new PendingResponse(userId, roomId, response));
    // pendingResponses.forEach(r => console.log(r.toString()));
}


const checkPendingResponses = getMessage => {
    let update = [];

    pendingResponses.forEach(waiting => {
        const { userId, roomId, response } = waiting;
        let hasMessage = getMessage(userId, roomId);
        hasMessage
            .then(message => {
                response.writeHead(200, { "Content-Type": "text/plain" })
                response.end(JSON.stringify(message));
            }).catch((err) => {
                console.log(err);
                update.push(waiting);
            });
    });
    pendingResponses = update;
}

module.exports = {
    saveResponse,
    checkPendingResponses
}