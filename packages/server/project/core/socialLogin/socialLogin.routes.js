import SocialLoginController from './socialLogin.controller.js'
import Router from 'express';
const router = Router();

router.get('/social-login', SocialLoginController.socialLogin);
router.post('/google-callback', SocialLoginController.googleCallback);
router.post('/facebook-callback', SocialLoginController.facebookCallback);
router.post('/twitter-callback', SocialLoginController.twitterCallback);

export default router;
