import { connect, Connection, Channel } from "amqplib";
import config from ".";

let connection: Connection | null = null;
let isConnecting = false;

export const getRabbitConnection = async (): Promise<Connection> => {
  // Return existing connection if available
  if (connection) {
    return connection;
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    // Wait for the ongoing connection attempt
    return new Promise((resolve, reject) => {
      const checkConnection = setInterval(() => {
        if (connection) {
          clearInterval(checkConnection);
          resolve(connection);
        } else if (!isConnecting) {
          clearInterval(checkConnection);
          reject(new Error("Connection failed"));
        }
      }, 100);
    });
  }

  try {
    isConnecting = true;
    connection = await connect(config.rabbitMQ_url as string);

    connection.on("close", () => {
      console.error("RabbitMQ connection closed, reconnecting...");
      connection = null;
      // Use setImmediate to avoid blocking
      setImmediate(() => {
        getRabbitConnection().catch((err) => {
          console.error("Failed to reconnect:", err);
          setTimeout(() => getRabbitConnection(), 5000);
        });
      });
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
      connection = null;
    });

    console.log("RabbitMQ connection established");
    return connection;
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
    connection = null;
    throw err;
  } finally {
    isConnecting = false;
  }
};

export const createChannel = async (): Promise<Channel> => {
  const conn = await getRabbitConnection();
  const channel: Channel = await conn.createChannel();

  // Handle channel errors and closure
  channel.on("error", (err) => {
    console.error("RabbitMQ channel error:", err);
  });

  channel.on("close", () => {
    console.log("RabbitMQ channel closed");
  });

  return channel;
};
