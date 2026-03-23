import Router from 'express';
const router = Router();
import userController from './users.controller.js';
import { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck } from '../../middleware/permissionMiddleware.js';
import Multer from 'multer';

const uploadDocFile = Multer({
    dest: 'public/uploadsFile/userFile'
}).array('files');



router.post('/create', createAccessCheck, userController.createUser);
router.get('/fetch', userController.fetchUser);
router.get('/fetch-users-by-roles', viewAccessCheck, userController.fetchUserByRoles);
router.get('/search',  userController.searchUser);
router.post('/filter',  userController.filter);
router.get('/fetch-emp-users', viewAccessCheck, userController.getUser);
router.get('/recoverable-users', viewAccessCheck, userController.fetchRecoverable);
router.get('/stat', viewAccessCheck, userController.stats);
router.get('/fetch/suspend',viewAccessCheck,userController.fetchSuspend);
router.put('/update', editAccessCheck, userController.updateUser);
router.put('/restore-users', editAccessCheck, userController.restoreUser);
router.delete('/delete', deleteAccessCheck, userController.deleteUser);
router.delete('/multi/delete', deleteAccessCheck, userController.multiDeleteUsers);
router.delete('/force-delete-users', deleteAccessCheck, userController.forceDelete);
router.put('/user-suspend', userController.suspendUser);
router.put('/update-profile', userController.updateProfile);
router.post('/resend-verify-mail',userController.resendVerifyMail);
router.put('/update-password',userController.updateUserPassword);


//Bulk User Register 
router.post('/bulk-register',createAccessCheck,uploadDocFile,userController.bulkUserRegister);
router.get('/downloadForBulkUpdate',viewAccessCheck,userController.downloadForBulkUpdate);
router.post('/bulk-update',editAccessCheck,uploadDocFile,userController.bulkUserUpdate);
export default router;
