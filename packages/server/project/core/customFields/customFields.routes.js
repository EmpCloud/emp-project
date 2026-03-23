import Router from 'express';
const router = Router();
import FieldsController from './customFields.controller.js';
import verifyToken from '../../middleware/verifyToken.js';
import { viewAccessCheck } from '../../middleware/permissionMiddleware.js';

router.get('/fields/fetch', verifyToken,viewAccessCheck, FieldsController.DefaultFiledAccess);
router.post('/fields/create', verifyToken,viewAccessCheck, FieldsController.addNewDynamicFields);
router.post('/fields/update', verifyToken,viewAccessCheck, FieldsController.configFields);
router.post('/fields/view/update', verifyToken,viewAccessCheck, FieldsController.configViewFields);
export default router;