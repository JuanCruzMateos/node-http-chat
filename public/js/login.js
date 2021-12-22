"use strict";

const newRoom = document.getElementById("newRoom");
newRoom.onclick = (event) => {
    event.preventDefault();
    // @ts-ignore :: .value tira error
    const name = document.getElementById("name").value;
    // @ts-ignore
    const email = document.getElementById("email").value;
    const user = { name, email }

    if (name === "" || email === "" || !isValid(email)) {
        alert("ingrese datos validos")
    } else {
        let newRoom = request("POST", "http://localhost:8080/api/room", user);
        newRoom()
            .then(res => res.json())
            .then(data => {
                window.location.href = `http://localhost:8080/room?roomId=${data.roomId}&userId=${data.userId}`
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
        let enterRoom = request("PUT", `http://localhost:8080/api/room?roomId=${roomId}`, user);
        enterRoom()
            .then(res => res.text())
            .then(userId => {
                if (userId)
                    window.location.href = `http://localhost:8080/room?roomId=${roomId}&userId=${userId}`
                else
                    window.location.href = `http://localhost:8080/notFound404`;
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


// // busco el formulario
// const form = document.getElementById("form");

// // agrego evento submit
// form.addEventListener("submit", event => {
//     event.preventDefault();

//     console.log(event);
//     // @ts-ignore :: .value tira error
//     const name = document.getElementById("name").value;
//     // @ts-ignore
//     const email = document.getElementById("email").value;
//     // @ts-ignore
//     const roomId = document.getElementById("roomId").value;

//     const user = { name, email }

//     if (!roomId) {
//         let newRoom = request("POST", "http://localhost:8080/api/room", user);
//         newRoom()
//             .then(res => res.json())
//             .then(data => {
//                 window.location.href = `http://localhost:8080/room?roomId=${data.roomId}&userId=${data.userId}`
//             })
//             .catch(e => console.log(e));
//     } else {
//         let enterRoom = request("PUT", `http://localhost:8080/api/room?roomId=${roomId}`, user);
//         enterRoom()
//             .then(res => res.json())
//             .then(data => {
//                 if (data.userId === null)
//                     window.location.href = `http://localhost:8080/notFound404`
//                 else
//                     window.location.href = `http://localhost:8080/room?roomId=${roomId}&userId=${data.userId}`
//             })
//             .catch(e => console.log(e));
//     }
// });