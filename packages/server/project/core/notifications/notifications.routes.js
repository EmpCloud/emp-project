import Router from 'express';
const router = Router();
import NotificationController from '../notifications/notifications.controller.js';

router.get('/get', NotificationController.fetchNotification);
router.put('/mark-read', NotificationController.readNotification);
router.delete('/delete', NotificationController.deleteNotification);

export default router;
