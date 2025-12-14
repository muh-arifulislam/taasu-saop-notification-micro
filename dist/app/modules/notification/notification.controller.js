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
exports.notificationController = void 0;
const notification_service_1 = require("./notification.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
class NotificationController {
    constructor() {
        // Admin panel: fetch notifications
        this.getNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { data, meta } = yield notification_service_1.notificationService.getNotifications(req.query);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: "Fetch all notifications successful",
                data,
                meta,
            });
        }));
        // Mark a single notification as read
        this.markAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield notification_service_1.notificationService.markAsRead(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: "Notification mark as read successful.",
                data: result,
            });
        }));
        // delete a single notification
        this.deleteNotification = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield notification_service_1.notificationService.deleteNotification(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: "Notification is deleted successful.",
                data: result,
            });
        }));
        // Mark all as read
        this.markAllAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            yield notification_service_1.notificationService.markAllAsRead();
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_1.default.OK,
                message: "All notifications marked as read",
                data: null,
            });
        }));
    }
}
exports.notificationController = new NotificationController();
