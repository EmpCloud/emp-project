import Router from 'express';
const router = Router();
import UploadController from './upload.controller.js';

import Multer from 'multer';

let processFile = Multer({
    storage: Multer.memoryStorage(),
}).array('files');

router.post('/upload-file', processFile, UploadController.create);
router.get('/getFiles', UploadController.getListFiles);
router.delete('/delete-files', UploadController.deleteFiles);

export default router;
