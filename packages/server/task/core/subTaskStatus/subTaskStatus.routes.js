import Router from 'express';
const router = Router();
import SubTaskStatusController from './subTaskStatus.controller.js';

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

//Task type routes
router.post('/create', createAccessCheck, SubTaskStatusController.createSubTaskStatus);
router.get('/get', SubTaskStatusController.getSubTaskStatus);
router.put('/update/:id', editAccessCheck, SubTaskStatusController.updateSubTaskStatus);
router.delete('/delete', deleteAccessCheck, SubTaskStatusController.deleteSubTaskStatus);

export default router;
