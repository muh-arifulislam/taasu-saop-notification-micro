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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEventConsumer = void 0;
const rabbitmq_1 = require("../config/rabbitmq");
const notification_service_1 = require("../modules/notification/notification.service");
const socket_1 = require("../sockets/socket");
const QUEUE = "order-notifications";
const initEventConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const channel = yield (0, rabbitmq_1.createChannel)();
    yield channel.assertQueue(QUEUE, { durable: true });
    console.log("Listening for events on:", QUEUE);
    channel.consume(QUEUE, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (!msg)
            return;
        const event = JSON.parse(msg.content.toString());
        console.log("Event Received:", event.type);
        try {
            if (event.type === "order.created") {
                const notification = yield notification_service_1.notificationService.createNotification({
                    title: "New Order Received",
                    message: `Order ${event.payload.orderId} has been placed.`,
                    userId: "admin",
                    eventId: event.eventId,
                    type: "order",
                    isRead: false,
                });
                // Broadcast to admin dashboard
                const payload = {
                    _id: notification._id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    createdAt: notification.createdAt,
                    isRead: notification.isRead,
                };
                const io = (0, socket_1.getIO)();
                io.to("admins").emit("notification", payload);
            }
            channel.ack(msg); // remove from queue after success
        }
        catch (err) {
            console.error("Failed to process message:", err);
            channel.ack(msg); // retry
        }
    }));
});
exports.initEventConsumer = initEventConsumer;
