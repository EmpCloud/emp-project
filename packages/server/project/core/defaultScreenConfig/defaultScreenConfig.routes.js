import Router from 'express';
const router = Router();
import defaultScreenConfig from './defaultScreenConfig.controller.js';

router.get('/fetch-default-config', defaultScreenConfig.fetchScreenConfig);
router.put('/update-default-config', defaultScreenConfig.updateScreenConfig);

export default router;
