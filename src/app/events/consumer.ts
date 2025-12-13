import { createChannel } from "../config/rabbitmq";
import { notificationService } from "../modules/notification/notification.service";
import { getIO, io } from "../sockets/socket";

const QUEUE = "order-notifications";

export const initEventConsumer = async () => {
  const channel = await createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log("Listening for events on:", QUEUE);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());
    console.log("Event Received:", event.type);

    try {
      if (event.type === "order.created") {
        const notification = await notificationService.createNotification({
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

        const io = getIO();
        io.to("admins").emit("notification", payload);
      }

      channel.ack(msg); // remove from queue after success
    } catch (err) {
      console.error("Failed to process message:", err);
      channel.ack(msg); // retry
    }
  });
};
