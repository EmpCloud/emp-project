import Router from 'express';
const router = Router();
import SprintController from './sprint.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

// Static routes MUST come before parameterized routes
router.get('/backlog', viewAccessCheck, SprintController.getBacklog);
router.get('/velocity', viewAccessCheck, SprintController.getVelocityChart);

router.post('/create', createAccessCheck, SprintController.createSprint);
router.get('/fetch', viewAccessCheck, SprintController.listSprints);

// Parameterized routes
router.get('/:id', viewAccessCheck, SprintController.getSprintDetail);
router.put('/:id', editAccessCheck, SprintController.updateSprint);
router.post('/:id/start', editAccessCheck, SprintController.startSprint);
router.post('/:id/complete', editAccessCheck, SprintController.completeSprint);
router.post('/:id/tasks', editAccessCheck, SprintController.addTaskToSprint);
router.delete('/:id/tasks/:taskId', deleteAccessCheck, SprintController.removeTaskFromSprint);
router.get('/:id/burndown', viewAccessCheck, SprintController.getBurndownData);

export default router;
