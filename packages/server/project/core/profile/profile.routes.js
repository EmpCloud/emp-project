import Router from 'express';
const router = Router();
import profileController from './profile.controller.js';
import verifyToken from '../../middleware/verifyToken.js';

router.get('/fetch', verifyToken, profileController.profile);

export default router;
