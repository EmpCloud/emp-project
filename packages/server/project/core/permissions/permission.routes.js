import Router from 'express';
const router = Router();

import PermissionController from './permission.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', createAccessCheck, PermissionController.create);
router.get('/fetch', PermissionController.fetchPermissions);
router.put('/update', editAccessCheck, PermissionController.updatePermissions);
router.delete('/delete', deleteAccessCheck, PermissionController.deletePermissions);
router.delete('/multi/delete', deleteAccessCheck, PermissionController.multideletePermissions);
router.put('/additional', PermissionController.updateNewPermission);
router.get('/search', PermissionController.searchPermissions);
router.post('/addPermissionConfigs',PermissionController.addPermissionConfig);
export default router;
