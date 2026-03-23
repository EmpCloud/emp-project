import Router from 'express';
const router = Router();
import adminConfigController from './adminConfig.controller.js';
import verifyToken from '../../middleware/userToken.js';
import { viewAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', verifyToken, viewAccessCheck, adminConfigController.createAdminConfig);
router.get('/fetch', verifyToken, viewAccessCheck, adminConfigController.fetchAdminConfig);
router.put('/update', verifyToken, viewAccessCheck, adminConfigController.updateAdminConfig);
export default router;
