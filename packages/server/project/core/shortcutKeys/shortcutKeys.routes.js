import Router from 'express';
const router = Router();
import ShortcutKeysController from './shortcutKeys.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';

router.post('/create', createAccessCheck, ShortcutKeysController.createShortcutKey);
router.get('/get', viewAccessCheck, ShortcutKeysController.readShortcutKeys);
router.put('/update', editAccessCheck, ShortcutKeysController.updateShortcutKey);
router.delete('/delete', deleteAccessCheck, ShortcutKeysController.deleteShortcutKey);

export default router;
