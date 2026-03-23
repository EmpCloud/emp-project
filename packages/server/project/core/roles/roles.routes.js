import Router from 'express';
const router = Router();
import roleController from './roles.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', createAccessCheck, roleController.create);
router.get('/fetch', viewAccessCheck, roleController.fetchRoles);
router.get('/fetch-role-by-permission', viewAccessCheck, roleController.fetchRoleByPermissions);
router.get('/search', viewAccessCheck, roleController.search);
router.put('/update', editAccessCheck, roleController.updateRoles);
router.delete('/delete', deleteAccessCheck, roleController.deleteRoles);
router.delete('/multi/delete',deleteAccessCheck,roleController.multiDeleteRoles);
router.post('/filter', viewAccessCheck, roleController.filter);

export default router;
