import Router from 'express';
const router = Router();
import verifyToken from '../../middleware/verifyToken.js';
import dashboardController from './dashboard.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/config', verifyToken, createAccessCheck, dashboardController.createDashboardConfig); //This Api is for both create and switch dashboard configuration
router.get('/config-get', verifyToken, viewAccessCheck, dashboardController.fetchConfig);
router.put('/config-update', verifyToken, editAccessCheck, dashboardController.updateDashboardConfig);

export default router;
