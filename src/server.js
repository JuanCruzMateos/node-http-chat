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
            let [_, type, resource] = url.pathname.split('/');
            if (type !== "api") {
                files.sendStatic(type, resource, response);
            } else {
                if (request.method === "GET")
                    RoomContoller.getMessage(url.searchParams.get("userId"), url.searchParams.get("roomId"), response);
                else if (request.method === "DELETE") {
                    RoomContoller.leaveRoom(url.searchParams.get("userId"), url.searchParams.get("roomId"), response);
                } else {
                    const userData = JSON.parse(body);
                    if (request.method === "POST") {
                        if (resource === "room") {
                            RoomContoller.newRoom(userData.name, userData.email, response);
                        } else {
                            RoomContoller.newMessage(url.searchParams.get("userId"), userData.msg, userData.time, url.searchParams.get("roomId"), response);
                        }
                    } else {  // PUT
                        RoomContoller.enterRoom(userData.name, userData.email, url.searchParams.get("roomId"), response);
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