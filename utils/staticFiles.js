const fs = require('fs');
const ejs = require('ejs');
const path = require('path');


function sendFile(file, type, response) {
    response.setStatus = 200;
    response.setHeader("Content-Type", `text/${type}`);
    response.end(file);
}


function sendHTML(pathName, response) {
    let absPath;
    if (pathName === "/")
        absPath = path.join(__dirname, "..", "public", "login.html");
    else
        absPath = path.join(__dirname, "..", "public", "notFound404.html");
    fs.readFile(absPath, (err, file) => {
        if (err) throw err;
        else sendFile(file, "html", response);
    });
}


function sendStatic(type, file, response) {

    let absPath = path.join(__dirname, "..", "public", type, file);
    if (type === "js")
        type = "javascript";
    fs.readFile(absPath, (err, file) => {
        if (err) throw err;
        else sendFile(file, type, response);
    });
}


function renderEJS(file, data, response) {
    ejs.renderFile(file, data, (err, str) => {
        if (err)
            throw err;
        else {
            response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': str.length });
            response.write(str);
            response.end();
        }
    });
}


module.exports = {
    sendHTML,
    sendStatic,
    renderEJS,
}
