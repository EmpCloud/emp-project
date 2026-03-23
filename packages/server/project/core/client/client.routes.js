import clientController from "./client.controller.js";
import Router from 'express';
const router = Router();
import { viewAccessCheck, createAccessCheck, editAccessCheck, deleteAccessCheck } from "../../middleware/permissionMiddleware.js";
router.post('/add-client', createAccessCheck, clientController.clientCreate);
router.post('/add-company', createAccessCheck,clientController.createCompany )
router.get('/fetch-client', viewAccessCheck, clientController.fetchClient);
router.get('/fetch-company', viewAccessCheck, clientController.fetchCompany);
router.get('/report', clientController.clientDetails);
router.put('/update-client', editAccessCheck, clientController.updateClient);
router.put('/update-company', editAccessCheck, clientController.updateCompany);
router.delete('/delete-client', deleteAccessCheck, clientController.deleteClient);

export default router;