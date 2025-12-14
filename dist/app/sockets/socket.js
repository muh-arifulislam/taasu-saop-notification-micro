"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocketServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const setupSocketServer = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    exports.io.on("connection", (socket) => {
        console.log("Admin connected:", socket.id);
        socket.on("join-admin", () => {
            socket.join("admins");
            console.log(`Admin joined: ${socket.id}`);
        });
    });
    return exports.io;
};
exports.setupSocketServer = setupSocketServer;
const getIO = () => {
    if (!exports.io)
        throw new Error("❌ Socket.IO not initialized yet");
    return exports.io;
};
exports.getIO = getIO;
