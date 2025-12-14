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
exports.notificationService = void 0;
const notification_model_1 = require("./notification.model");
class NotificationService {
    createNotification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_model_1.NotificationModel.create(payload);
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_model_1.NotificationModel.deleteOne({ _id: id });
        });
    }
    getNotifications(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
            const limit = Number(query === null || query === void 0 ? void 0 : query.limit) || 20;
            const skip = (page - 1) * limit;
            const notifications = yield notification_model_1.NotificationModel.find().sort({
                createdAt: -1,
            });
            const total = yield notification_model_1.NotificationModel.countDocuments();
            const meta = {
                page: page,
                limit: limit,
                total: total,
                skip: skip,
                totalPages: Math.ceil(total / limit),
            };
            return {
                data: notifications,
                meta,
            };
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_model_1.NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        });
    }
    markAllAsRead() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_model_1.NotificationModel.updateMany({ isRead: false }, { isRead: true });
        });
    }
}
exports.notificationService = new NotificationService();
