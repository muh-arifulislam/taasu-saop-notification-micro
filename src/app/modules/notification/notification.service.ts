import { NotificationModel } from "./notification.model";
import { INotification } from "./notification.interface";

class NotificationService {
  async createNotification(payload: INotification) {
    return await NotificationModel.create(payload);
  }

  async deleteNotification(id: string) {
    return await NotificationModel.deleteOne({ _id: id });
  }

  async getNotifications(query: Record<string, unknown>) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });

    const total = await NotificationModel.countDocuments();
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
  }

  async markAsRead(notificationId: string) {
    return await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead() {
    return await NotificationModel.updateMany(
      { isRead: false },
      { isRead: true }
    );
  }
}

export const notificationService = new NotificationService();
