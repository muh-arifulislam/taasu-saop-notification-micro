import mongoose from "mongoose";
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./app/config";
import { initEventConsumer } from "./app/events/consumer";
import { setupSocketServer } from "./app/sockets/socket";

let server: Server;
export let io: SocketIOServer;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connected");

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });

    // Setup HTTP + Socket.IO
    setupSocketServer(server);

    // 👇👇 IMPORTANT: Start RabbitMQ Listener AFTER socket is ready
    await initEventConsumer();
    console.log("🐇 RabbitMQ Consumer initialized!");
  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
