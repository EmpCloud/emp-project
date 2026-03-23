import Router from 'express';
const router = Router();
import MessageController from './messages.controller.js';
import uploadCheck from '../../middleware/multerFileUpload.js';
import { createAccessCheck, deleteAccessCheck, editAccessCheck, viewAccessCheck } from '../../middleware/permissionMiddleware.js';

router.get('/fetch', viewAccessCheck, MessageController.getMessages);

router.put('/edit', editAccessCheck, MessageController.editMessage);
router.put('/poll-vote', editAccessCheck, MessageController.votePoll);

router.post('/forward', createAccessCheck, MessageController.forwardMessage);
router.post('/send', createAccessCheck, MessageController.sendMessage);
router.post('/poll-create', createAccessCheck, MessageController.createPoll);

router.delete('/delete', deleteAccessCheck, MessageController.deleteMessage);

router.post('/upload', uploadCheck, MessageController.uploadFiles);

export default router;
