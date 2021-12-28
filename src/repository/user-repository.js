const fs = require('fs');
const FILENAME = "./active-users.json";

let users;

fs.readFile(FILENAME, "utf-8", (error, data) => {
    if (error) {
        console.error(error);
    } else {
        users = JSON.parse(data);
        console.log(users);
    }
});

const existsUser = email => {
    return Boolean(users.find(user => user.email === email));
}

const saveUser = (name, email, roomId) => {
    users.push({ name, email, roomId });
    fs.writeFile(FILENAME, JSON.stringify(users), (error) => {
        if (error)
            throw error;
    });
}

const deleteUser = email => {
    users = users.filter(user => user.email !== email);
    fs.writeFile(FILENAME, JSON.stringify(users), (error) => {
        if (error)
            throw error;
    });
}

module.exports = {
    existsUser,
    saveUser,
    deleteUser
}