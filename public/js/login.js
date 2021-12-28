"use strict";

const BASEURL = "http://localhost:8080";

const newRoom = document.getElementById("newRoom");
newRoom.onclick = (event) => {
    event.preventDefault();
    // @ts-ignore :: .value tira error
    const name = document.getElementById("name").value;
    // @ts-ignore
    const email = document.getElementById("email").value;
    const user = { name, email };

    if (name === "" || email === "" || !isValid(email)) {
        alert("ingrese datos validos")
    } else {
        let newRoom = request("POST", `${BASEURL}/api/room`, user);
        newRoom()
            .then(res => res.json())
            .then(data => {
                window.location.href = `${BASEURL}/room?roomId=${data.roomId}&userId=${data.userId}`
            })
            .catch(e => console.log(e));
    }
}


const enterRoom = document.getElementById("enterRoom");
enterRoom.onclick = (event) => {
    event.preventDefault();
    // @ts-ignore :: .value tira error
    const name = document.getElementById("name").value;
    // @ts-ignore
    const email = document.getElementById("email").value;
    // @ts-ignore
    const roomId = document.getElementById("roomId").value;
    const user = { name, email, roomId }

    if (name === "" || email === "" || roomId === "" || !isValid(email)) {
        alert("ingrese datos validos");
    } else {
        let enterRoom = request("PUT", `${BASEURL}/api/room/${roomId}`, user);
        enterRoom()
            .then(res => res.text())
            .then(userId => {
                if (userId)
                    window.location.href = `${BASEURL}/room?roomId=${roomId}&userId=${userId}`
                else
                    window.location.href = `${BASEURL}/notFound404`;
            })
            .catch(e => console.log("error", e));
    }
}


function isValid(email) {
    return /(\S+)@(\S+).com/.test(email);
}


function request(method, url, data) {
    return async () => {
        const response = await fetch(url, {
            method,
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(data)
        });
        return response;
    }
}