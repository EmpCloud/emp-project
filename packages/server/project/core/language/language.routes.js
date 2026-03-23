import Router from 'express';
const router = Router();
import LanguageController from './language.controller.js';

router.put('/language', LanguageController.updateLanguage);

export default router;
