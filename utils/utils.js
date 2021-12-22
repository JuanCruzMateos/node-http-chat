function log(method, href, pathname, searchParams) {
    console.log("-----------------------------------------------------");
    console.log("method:", method, "\n");

    console.log("href:", href);
    console.log("pathname:", pathname);
    console.log("searchParams:", searchParams);
    console.log("-----------------------------------------------------\n");
}

// function log(...params) {
//     for (let p of params) {
//         console.log(p);
//     }
// }

module.exports = {
    log
}