import Router from 'express';
const router = Router();
import unauthorizedController from './unauthorized.controller.js';
import verifyToken from '../../middleware/verifyToken.js';

router.post('/verify-user', unauthorizedController.verifyUser);
router.post('/set-password', unauthorizedController.setPassword);
router.post('/user-login', unauthorizedController.UserLogin);
router.post('/forgot-password', unauthorizedController.forgotPassword);
router.put('/reset-password', unauthorizedController.resetPassword);
router.post('/generate-token', unauthorizedController.generateToken);
router.put('/update-password',verifyToken, unauthorizedController.updatePassword);

export default router;
