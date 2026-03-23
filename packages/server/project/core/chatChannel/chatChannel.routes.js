import Router from 'express';
import { createAccessCheck, deleteAccessCheck, editAccessCheck, viewAccessCheck } from '../../middleware/permissionMiddleware.js';

const router = Router();
import ChatController from './chatChannel.controllers.js';

router.post('/private', createAccessCheck, ChatController.privateChatChannel);
router.post('/group', createAccessCheck, ChatController.groupChatChannel);

router.get('/fetch', viewAccessCheck, ChatController.fetchChatChannel);
router.get('/fetch-users', viewAccessCheck, ChatController.fetchUsers);
router.get('/group-members', viewAccessCheck, ChatController.groupMembers);

router.put('/group-rename', editAccessCheck, ChatController.renameGroup);
router.put('/group-remove', editAccessCheck, ChatController.removeFromGroup);
router.put('/group-add', editAccessCheck, ChatController.addToGroup);

router.delete('/delete', deleteAccessCheck, ChatController.deleteChatChannel);

export default router;
