import Router from 'express';
const router = Router();
import TaskController from './task.controller.js';

router.get('/search-default-values', TaskController.searchTaskDefaultValue);

import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';
// Task routes
router.post('/create', createAccessCheck, TaskController.createTask);
router.post('/comment/:id', TaskController.postComment);

router.get('/fetch', viewAccessCheck, TaskController.getTasks);
router.get('/status', viewAccessCheck, TaskController.taskStatus);
router.get('/search', viewAccessCheck, TaskController.searchTask);
router.get('/comment/get', TaskController.getComments);
router.get('/search-default-values', viewAccessCheck, TaskController.searchTaskDefaultValue);
router.post('/fetch/by-userId', viewAccessCheck, TaskController.fetchaTaskByuserId);
router.post('/add-reply',TaskController.addReply);
router.post('/filter', viewAccessCheck, TaskController.filterByKey);

router.put('/update/:id', editAccessCheck, TaskController.updateTask);
router.put('/comment/update/:id', TaskController.updateComment);
router.put('/update-reply',TaskController.updateReply)

router.delete('/delete', deleteAccessCheck, TaskController.deleteTask);
router.delete('/comment/delete', TaskController.deleteComment);
router.delete('/reply/delete', TaskController.deleteReply);
router.delete('/multiDelete', deleteAccessCheck, TaskController.multipleTaskDelete);
router.get('/fetch-report', viewAccessCheck, TaskController.getReports);

export default router;
