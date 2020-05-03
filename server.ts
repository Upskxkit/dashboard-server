import {appServer} from "./lib/server";

const server = new appServer({
    "transport": "ws",
    "port": 8080,
    "host": "localhost"
}, () => {
});
