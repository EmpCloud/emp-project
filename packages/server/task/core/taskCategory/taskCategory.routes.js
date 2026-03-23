import Router from 'express';
const router = Router();
import TaskCategoryController from './taskCategory.controller.js';

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

//Task category routes
router.post('/create', createAccessCheck, TaskCategoryController.createTaskCategory);
router.get('/get', TaskCategoryController.getTaskCategoryById);
router.put('/update/:id', editAccessCheck, TaskCategoryController.updateTaskCategory);
router.delete('/delete', deleteAccessCheck, TaskCategoryController.deleteTaskCategoryById);
router.delete('/multi/delete', TaskCategoryController.deleteMultiTaskCategoryById)

export default router;
