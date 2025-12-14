"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannel = exports.getRabbitConnection = void 0;
const amqplib_1 = require("amqplib");
const _1 = __importDefault(require("."));
let connection = null;
let isConnecting = false;
const getRabbitConnection = () => __awaiter(void 0, void 0, void 0, function* () {
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
                }
                else if (!isConnecting) {
                    clearInterval(checkConnection);
                    reject(new Error("Connection failed"));
                }
            }, 100);
        });
    }
    try {
        isConnecting = true;
        connection = yield (0, amqplib_1.connect)(_1.default.rabbitMQ_url);
        connection.on("close", () => {
            console.error("RabbitMQ connection closed, reconnecting...");
            connection = null;
            // Use setImmediate to avoid blocking
            setImmediate(() => {
                (0, exports.getRabbitConnection)().catch((err) => {
                    console.error("Failed to reconnect:", err);
                    setTimeout(() => (0, exports.getRabbitConnection)(), 5000);
                });
            });
        });
        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
            connection = null;
        });
        console.log("RabbitMQ connection established");
        return connection;
    }
    catch (err) {
        console.error("Failed to connect to RabbitMQ:", err);
        connection = null;
        throw err;
    }
    finally {
        isConnecting = false;
    }
});
exports.getRabbitConnection = getRabbitConnection;
const createChannel = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, exports.getRabbitConnection)();
    const channel = yield conn.createChannel();
    // Handle channel errors and closure
    channel.on("error", (err) => {
        console.error("RabbitMQ channel error:", err);
    });
    channel.on("close", () => {
        console.log("RabbitMQ channel closed");
    });
    return channel;
});
exports.createChannel = createChannel;
