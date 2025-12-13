export interface INotification {
  _id?: string;
  title: string;
  message: string;
  userId: string; // Admin or specific user
  isRead: boolean;
  type: "order" | "chat" | "system"; // Extendable
  eventId: string; // To ensure idempotency from RabbitMQ
  createdAt?: Date;
  updatedAt?: Date;
}
