import { Router } from "express";
import { notificationController } from "./notification.controller";

const router = Router();

router.patch("/read-all/", notificationController.markAllAsRead);

router.delete("/:id", notificationController.deleteNotification);

router.patch("/:id/read", notificationController.markAsRead);

router.get("/", notificationController.getNotifications);

export const NotificationRoutes = router;
