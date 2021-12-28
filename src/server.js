'use strict';
const http = require('http');
const RoomContoller = require('./controllers/room-controller');
const files = require('../utils/staticFiles');
const { log } = require('../utils/utils');


const BASEURL = "http://localhost:8080";


/**
 * 
 * @param {*} request 
 * @param {http.ServerResponse} response 
 */
function handleRequest(request, response) {
    response.setHeader("Access-Control-Allow-Origin", '*');

    let body = "";

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', async () => {
        const url = new URL(request.url, BASEURL);
        log(request.method, url.href, url.pathname, url.searchParams)

        if (url.pathname === "/" || url.pathname === "/notFound404")
            files.sendHTML(url.pathname, response);
        else if (url.pathname === "/room")
            files.renderEJS("./templates/chatroom.ejs", { id: url.searchParams.get("roomId") }, response);
        else {
            const [_, type, ...resource] = url.pathname.split('/');
            console.log(_, type, resource);
            if (type !== "api") {
                files.sendStatic(type, resource[0], response);
            } else {
                if (request.method === "GET") {
                    const [_, roomId, userId] = resource;
                    RoomContoller.getMessage(userId, roomId, response);
                } else if (request.method === "DELETE") {
                    const [_, roomId, userId] = resource;
                    RoomContoller.leaveRoom(userId, roomId, response);
                } else {
                    const userData = JSON.parse(body);
                    if (request.method === "POST") {
                        if (resource[0] === "room") {
                            RoomContoller.newRoom(userData.name, userData.email, response);
                        } else {
                            const [_, roomId, userId] = resource;
                            RoomContoller.newMessage(userId, userData.msg, userData.time, roomId, response);
                        }
                    } else {  // PUT
                        const [_, roomId] = resource;
                        console.log(roomId);
                        RoomContoller.enterRoom(userData.name, userData.email, roomId, response);
                    }
                }
            }
        }
    });

    request.on('close', () => { });
}

const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
