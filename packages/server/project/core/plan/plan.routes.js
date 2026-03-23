import Router from 'express';
const router = Router();
import PlanController from './plan.controller.js';
import verifyToken from '../../middleware/userToken.js';

router.get('/get', verifyToken, PlanController.getAllPlans);
router.get('/downgrade-info', verifyToken, PlanController.downGradePlan);
router.post('/select', verifyToken, PlanController.assignPlan);
router.get('/get-history', verifyToken, PlanController.getHistory);
router.put('/delete/data', verifyToken,  PlanController.deleteData);
router.put('/expire/date', verifyToken,  PlanController.updatePlanExpired);
router.get('/usage', verifyToken, PlanController.planUsage);

router.get('/project-downgrade-info',verifyToken,PlanController.infoProjects);
router.get('/User-downgrade-info',verifyToken,PlanController.infoUser);
router.delete('/delete-downgraded-projects',verifyToken,PlanController.deleteProjects);


export default router;
