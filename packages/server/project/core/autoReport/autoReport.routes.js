import Router from 'express';
const router = Router();
import autoReportController from './autoReport.controller.js';
import verifyToken from '../../middleware/userToken.js';

router.post('/create', verifyToken,autoReportController.sendAutoReport);
router.get('/get',verifyToken,autoReportController.fetchReportDetails);
router.put('/update',verifyToken,autoReportController.updateReport);
router.post('/testmail',verifyToken,autoReportController.sendTestMailReport);
router.delete('/delete',verifyToken,autoReportController.deleteReport);



export default router;
