import { Request, Response } from "express";
import { notificationService } from "./notification.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

class NotificationController {
  // Admin panel: fetch notifications
  getNotifications = catchAsync(async (req, res) => {
    const { data, meta } = await notificationService.getNotifications(
      req.query
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Fetch all notifications successful",
      data,
      meta,
    });
  });

  // Mark a single notification as read
  markAsRead = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await notificationService.markAsRead(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notification mark as read successful.",
      data: result,
    });
  });

  // delete a single notification
  deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notification is deleted successful.",
      data: result,
    });
  });

  // Mark all as read
  markAllAsRead = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    await notificationService.markAllAsRead();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All notifications marked as read",
      data: null,
    });
  });
}

export const notificationController = new NotificationController();
