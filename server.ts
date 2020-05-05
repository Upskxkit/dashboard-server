import {appServer} from "./lib/server";

const port = process.env.PORT || 8080;

const server = new appServer({
    "transport": "ws",
    "port": +port,
    "host": "localhost"
}, () => {
});
