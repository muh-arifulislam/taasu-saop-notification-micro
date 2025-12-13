import { Router } from "express";
import { NotificationRoutes } from "../modules/notification/notification.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
