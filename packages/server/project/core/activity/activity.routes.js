import Router from 'express';
const router = Router();
import ActivityController from './activity.controller.js';
// import { viewAccessCheck } from '../../middleware/permissionMiddleware.js';
router.get('/fetch', ActivityController.activityFetch);
router.get('/search', ActivityController.activitySearch);
router.post('/filter', ActivityController.activityFilter);
export default router;
