import multer, { MulterError } from 'multer';
import config from 'config';
import fs from 'fs';

// Valid File Types Allowed
const imageMimeType = ['image/jpg', 'image/png', 'image/jpeg'];
const docMimeType = ['application/pdf', 'application/doc', 'application/xlsx', 'application/docx', 'application/txt', 'application/zip', 'application/vnd.rar'];
const mediaMimeType = ['video/mkv', 'video/mp4', 'video/avi'];

function uploadCheck(req, res, next) {
    // Storage Path for Uploaded File
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads');
        },
        filename: function (req, file, cb) {
            const { _id: userId } = req?.verified?.userData?.userData;
            cb(null, Date.now() + '-' + userId + '.' + file.originalname.split('.').pop());
        },
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 50, // 50MB - Maximum Uploading Size Limit
        },
    }).array('files', config.get('file.upload_count'));

    const fileDelete = async item => {
        fs.unlink(`./public/uploads/${item.filename}`, function (err) {
            if (err) {
                return console.error(err, 'File Not Found');
            } else {
                return console.log('Invalid Files not uploaded ');
            }
        });
    };

    upload(req, res, async function (err) {
        let uploaded_arry = [];
        let failed_arry = [];
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                code: 400,
                message: 'File too large.',
            });
        }
        try {
            if (!req?.files) throw new Error('Please select files to upload');

            for (let item of req?.files) {
                // Validating Image Size & Type
                if (imageMimeType.includes(item.mimetype)) {
                    if (item.size < 1024 * 1024 * config.get('file.max_image_size')) {
                        uploaded_arry.push(item);
                    } else {
                        await fileDelete(item);
                        let data = {
                            item: item.originalname,
                            message: `Failed. Please upload image less than ${config.get('file.max_image_size')} mb size`,
                        };
                        failed_arry.push(data);
                    }
                }
                // Validating Document Size & Type
                else if (docMimeType.includes(item.mimetype)) {
                    if (item.size < 1024 * 1024 * config.get('file.max_doc_size')) {
                        uploaded_arry.push(item);
                    } else {
                        await fileDelete(item);
                        let data = {
                            item: item.originalname,
                            message: `Failed Upload. Document size limit ${config.get('file.max_doc_size')}Mb. Valid Document type pdf, doc, docx, xlsx, txt, zip, rar .`,
                        };
                        failed_arry.push(data);
                    }
                }
                // Validating Media Size & Type
                else if (mediaMimeType.includes(item.mimetype)) {
                    if (item.size < 1024 * 1024 * config.get('file.max_media_size')) {
                        item.type = 1;
                        uploaded_arry.push(item);
                    } else {
                        await fileDelete(item);
                        let data = {
                            item: item.originalname,
                            message: `Failed Upload. Media size limit ${config.get('file.max_media_size')}Mb. Valid Media types mp4, mkv & avi .`,
                        };
                        failed_arry.push(data);
                    }
                }
                // For rest other files
                else {
                    uploaded_arry.push(item);
                }
            }
            req.uploaded_arry = uploaded_arry;
            req.failed_arry = failed_arry;
            next();
        } catch (error) {
            return res.status(400).json({
                code: 400,
                error: error.message || 'Something went wrong.',
            });
        }
    });
}

export default uploadCheck;
