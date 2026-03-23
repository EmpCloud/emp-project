import Router from 'express';
const router = Router();
import SubTaskTypeController from './subTaskType.controller.js';
import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

//Task type routes
router.post('/create', createAccessCheck, SubTaskTypeController.createSubTaskType);
router.get('/get', SubTaskTypeController.getSubTaskType);
router.put('/update/:id', editAccessCheck, SubTaskTypeController.updateSubTaskType);
router.delete('/delete', deleteAccessCheck, SubTaskTypeController.deleteSubTaskType);

export default router;
