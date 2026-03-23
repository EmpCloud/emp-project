import Router from 'express';
const router = Router();
import SubTaskController from './subTask.controller.js';

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';
import subTaskController from './subTask.controller.js';
// Task routes
router.post('/create', createAccessCheck, SubTaskController.createSubTask);
router.post('/create-comment/:id', SubTaskController.postComment);
router.post('/add-reply',subTaskController.addReply);
router.post('/ReportHeaderGrid',subTaskController.filterSubTask);

router.get('/getAll', viewAccessCheck, SubTaskController.getSubTask);
router.get('/search', viewAccessCheck, SubTaskController.searchSubTask);
router.get('/get-comments', SubTaskController.getComments);
router.put('/update/:id', editAccessCheck, SubTaskController.updateSubTask);
router.put('/update-comment/:id', SubTaskController.updateComment);
router.put('/update-reply',SubTaskController.updateReply)

router.delete('/delete', deleteAccessCheck, SubTaskController.deleteSubTasks);
router.delete('/delete-comment',  SubTaskController.deleteComment);
router.delete('/delete-reply', SubTaskController.deleteReply);
router.delete('/multiDelete', deleteAccessCheck, SubTaskController.multipleSubtaskDelete);



export default router;
