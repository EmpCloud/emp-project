import Router from 'express';
const router = Router();
import TaskStatusController from './taskStatus.controller.js';
import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

//Task type routes
router.post('/create', createAccessCheck, TaskStatusController.createTaskStatus);
router.get('/fetch', TaskStatusController.getTaskStatus);
router.put('/update/:id', editAccessCheck, TaskStatusController.updateTaskStatus);
router.delete('/delete', deleteAccessCheck, TaskStatusController.deleteTaskStatus);
router.get('/search', viewAccessCheck, TaskStatusController.searchTaskStatus);
router.delete('/multi/delete', TaskStatusController.deleteMultiTaskStatus)
export default router;
