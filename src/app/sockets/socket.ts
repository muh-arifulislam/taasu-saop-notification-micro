import { Server } from "socket.io";

export let io: Server;

export const setupSocketServer = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Admin connected:", socket.id);

    socket.on("join-admin", () => {
      socket.join("admins");
      console.log(`Admin joined: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("❌ Socket.IO not initialized yet");
  return io;
};
