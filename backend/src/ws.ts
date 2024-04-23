import * as WebSocket from "ws";
import * as http from "http";
import app from "./app";
import { HomeMsg, HomeMsgSchema } from "./types/chat";

export const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server, path: "/homechat" });

const broadcast = (data: HomeMsg, sender: WebSocket): void => {
    wss.clients.forEach((client) => {
        if (client !== sender) client.send(JSON.stringify(data));
    });
};

wss.on("connection", (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on("message", (message: string) => {
        try {
            const msg = HomeMsgSchema.parse(JSON.parse(message));
            broadcast(msg, ws);
        } catch (error) {
            console.error(error);
        }
    });
});
