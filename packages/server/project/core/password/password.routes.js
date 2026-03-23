import Router from 'express';
const router = Router();
import PassWordControllers from './password.controller.js';

router.get('/get', PassWordControllers.getPassword);

export default router;
