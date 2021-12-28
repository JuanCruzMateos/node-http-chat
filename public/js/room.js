"use strict";

function getIds() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const { roomId, userId } = Object.fromEntries(urlSearchParams.entries());
    return { roomId, userId };
}


function appendToChatArea(msg, user = "this") {
    const chatArea = document.getElementById("chat-area");
    const messageContainer = document.createElement("div");
    const messageDiv = document.createElement("div");
    const cut = document.createElement("div");
    const messageLabel = document.createElement("label");
    const message = document.createElement("p");

    messageContainer.classList.add("msg-container");
    messageDiv.classList.add("msg-div");

    if (user === "this") {
        message.classList.add("msg-user");
        cut.classList.add("cut-user");
        messageLabel.classList.add("header-user");
        messageLabel.innerHTML = `you [${msg.time}]`;
    } else {
        message.classList.add("msg-other");
        cut.classList.add("cut-other");
        messageLabel.classList.add("header-other");
        messageLabel.innerHTML = `${msg.user} [${msg.time}]`;

    }
    message.innerHTML = msg.msg;
    messageDiv.appendChild(message);
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(cut);
    messageContainer.appendChild(messageLabel);
    chatArea.appendChild(messageContainer);
    chatArea.scrollTop = chatArea.scrollHeight;
}


(async function askForMessages() {
    const { roomId, userId } = getIds();

    await fetch(`http://localhost:8080/api/message/${roomId}/${userId}`, {
        method: "GET",
        mode: "cors",
    })
        .then(response => response.json())
        .then(data => appendToChatArea(data, data.user))
        .catch(err => console.log(err))
        .finally(() => askForMessages());
})();


function sendMessage() {
    const { roomId, userId } = getIds();

    // @ts-ignore
    let msgtxt = document.getElementById("text-area").value;
    let msg = { msg: msgtxt, time: new Date().toLocaleTimeString().substring(0, 5) };
    appendToChatArea(msg);
    // @ts-ignore
    document.getElementById("text-area").value = "";
    document.getElementById("text-area").focus();
    fetch(`http://localhost:8080/api/message/${roomId}/${userId}`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(msg)
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(err => console.log("2", err));
}


function leaveRoom() {
    const { roomId, userId } = getIds();

    fetch(`http://localhost:8080/api/room/${roomId}/${userId}`, {
        method: "DELETE",
        mode: "cors",
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if (data) {
                window.location.href = `http://localhost:8080`;
            }
        })
        .catch(err => console.log("2", err));
}