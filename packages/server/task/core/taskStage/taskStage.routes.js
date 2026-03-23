import Router from 'express';
const router = Router();
import TaskStageController from './taskStage.controller.js';

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';
//Task stage routes
router.post('/create', createAccessCheck, TaskStageController.createTaskStage);
router.get('/get', TaskStageController.getTaskStageById);
router.put('/update/:id', editAccessCheck, TaskStageController.updateTaskStage);
router.delete('/delete', deleteAccessCheck, TaskStageController.deleteTaskStageById);
router.delete('/multi/delete',TaskStageController.deleteMultiTaskStageById)

export default router;
