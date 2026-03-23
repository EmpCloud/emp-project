import Router from 'express';
const router = Router();
import TaskTypeController from './taskType.controller.js';

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

//Task type routes
router.post('/create', createAccessCheck, TaskTypeController.createTaskType);
router.get('/fetch', TaskTypeController.getTaskType);
router.put('/update/:id', editAccessCheck, TaskTypeController.updateTaskType);
router.delete('/delete', deleteAccessCheck, TaskTypeController.deleteTaskType);
router.get('/search', viewAccessCheck, TaskTypeController.searchTaskType);
router.delete('/multi/delete', TaskTypeController.deleteMultiTaskType)

export default router;
