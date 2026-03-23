import Router from 'express';
const router = Router();
import GroupController from './group.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', createAccessCheck, GroupController.createGroup);
router.get('/fetch', GroupController.fetchGroup);
router.get('/search',  GroupController.searchGroup);
router.put('/update', GroupController.updateGroup);
router.delete('/delete', deleteAccessCheck, GroupController.deleteGroup);
router.delete('/multi/delete', deleteAccessCheck, GroupController.multideleteGroups);
router.post('/filter', viewAccessCheck, GroupController.groupFilter);

export default router;
