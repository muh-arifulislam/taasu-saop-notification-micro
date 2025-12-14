"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_route_1 = require("../modules/notification/notification.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/notifications",
        route: notification_route_1.NotificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
