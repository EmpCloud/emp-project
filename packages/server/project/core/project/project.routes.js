import Router from 'express';
const router = Router();
import ProjectController from './project.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', createAccessCheck, ProjectController.create);
router.post('/comment-post', ProjectController.postComment);
router.post('/comment-reply',ProjectController.addReply);

router.get('/fetch', viewAccessCheck, ProjectController.getAll);
router.get('/comment-get', ProjectController.getComment);
router.get('/search', viewAccessCheck, ProjectController.search);
router.post('/filter', viewAccessCheck, ProjectController.filter);
router.get('/stat', viewAccessCheck, ProjectController.getStat);
router.get('/exist', viewAccessCheck, ProjectController.projectExist);
router.get('/status', viewAccessCheck, ProjectController.projectStatus);
router.get('/totalTime/fetch', viewAccessCheck, ProjectController.timeCalculate);
router.get('/userdetails',viewAccessCheck,ProjectController.ProjectUserProgress)

router.put('/update/:id', editAccessCheck, ProjectController.update);
router.put('/comment-update', ProjectController.updateComment);
router.put('/comment-reply-update',ProjectController.updateReply);
router.put('/remove-member/:id', editAccessCheck, ProjectController.removeMember);

router.delete('/delete', deleteAccessCheck, ProjectController.delete);
router.delete('/comment-delete', ProjectController.deleteComment);
router.delete('/reply-delete',ProjectController.deleteReply);
router.delete('/multiDelete', deleteAccessCheck, ProjectController.multipleProjectDelete)
router.get('/analytics',ProjectController.getAnalytics)
export default router;
