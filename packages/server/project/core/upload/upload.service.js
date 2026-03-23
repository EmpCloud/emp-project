import { Storage } from '@google-cloud/storage';

import Reuse from '../../utils/reuse.js';
import { UploadMessage } from '../language/language.translator.js'
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import config from 'config';

const storage = new Storage({ keyFilename: 'storageconfig.json' });
const bucketName = config.get("bucketName");
const bucket = storage.bucket(bucketName);

const PNG_MIME_TYPE = 'image/png';
const JPEG_MIME_TYPE = 'image/jpeg';
const JPG_MIME_TYPE = 'image/jpg';
const SVG_MIME_TYPE = 'image/svg';
const SVG_XML_MIME_TYPE = 'image/svg+xml';
const TEXT_FILE = 'text.txt';
const DOC_FILE = 'text/doc';
const HTML_FILE = 'text/html';
const HTM_FILE = 'text/htm';
const PDF_FILE = 'text/pdf';
const CSV_FILE = 'text/csv';
const MP4_FILE = 'video/mp4';

const FILE_MAX_SIZE = 10 * 1024 * 1024;

const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

const MIME_TYPES = [PNG_MIME_TYPE, SVG_MIME_TYPE, SVG_XML_MIME_TYPE, JPEG_MIME_TYPE, JPG_MIME_TYPE, TEXT_FILE, DOC_FILE, HTML_FILE, HTM_FILE, PDF_FILE, CSV_FILE];
const VIDEO_MIME_TYPES = [MP4_FILE];

class ProjectService {
    async create(req, res, next) {
        const reuse = new Reuse(req);
        Logger.info(reuse);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            let folderName;
            let category = req.query.category;
            let categoryId = req.query.categoryId;
            if (!categoryId) {
                return res.send(Response.projectFailResp(`${category} ${UploadMessage['ID_REQUIRED'][language ?? 'en']}`));
            }

            folderName = `${orgId}/${category}/${categoryId}`;
            if (!req.files) return res.send(Response.projectFailResp(UploadMessage['FILE_REQUIRED'][language ?? 'en']));
            if (req.files.length > 10) return res.send(Response.projectFailResp(UploadMessage['FILE_LIMIT_REACHED'][language ?? 'en']));

            let filesUrls = [];
            let negative = 0;
            let positive = 0;
            let result_status;

            req.files.map(async item => {
                if (item.size > FILE_MAX_SIZE && MIME_TYPES.find(type => type == item.mimetype)) {
                    negative++;
                    filesUrls.push({ message: 'Image size too large', fileName: item.originalname });
                } else if (item.size > VIDEO_MAX_SIZE && VIDEO_MIME_TYPES.find(type => type == item.mimetype)) {
                    negative++;
                    filesUrls.push({ message: 'video size too large', fileName: item.originalname });
                } else {
                    let url = await uploadImage(item, folderName);
                    positive++;
                    filesUrls.push({ url, message: 'Upload Successfully' });
                }
                if (positive > 0 && negative == 0) {
                    result_status = 200;
                } else if (negative > 0 && positive == 0) {
                    result_status = 400;
                } else if (positive > 0 || negative > 0) {
                    result_status = 201;
                }
                if (req?.files.length == filesUrls.length)
                    res.json({
                        code: result_status,
                        data: { filesUrls: filesUrls.filter(item => item.message === 'Upload Successfully') },
                        error: filesUrls.filter(item => item.message !== 'Upload Successfully'),
                    });
            });
            return true;
        } catch (err) {
            return res.send(Response.projectFailResp(UploadMessage['FAILED_TO_UPLOAD_FILES'][language ?? 'en'], err.message));
        }
    }

    async getListFiles(req, res, next) {
        const reuse = new Reuse(req);
        Logger.info(reuse);
        const { orgId, language } = reuse.result.userData?.userData;

        try {
            const url = `https://storage.googleapis.com/${bucketName}/${orgId}`
            let options;
            let fileInfos = [];
            const imageId = req.query.imageId;
            let category = req.query.category;
            let categoryId = req.query.categoryId;
            let type = req.query.type;

            if (imageId) {
                options = { prefix: `${orgId}/` };
                const [data] = await bucket.getFiles(options);
                data.forEach(async (file) => {
                    if (file.metadata.generation == imageId) {
                        fileInfos.push({
                            imageId: file.metadata.generation,
                            fileName: file.name,
                            viweLinkURL: `${url}/${file.name}`,
                            downloadLinkUrl: file.metadata.mediaLink,
                        });
                    }
                })
                if (fileInfos.length) {
                    Logger.info(fileInfos);
                    return res.send(Response.projectSuccessResp(UploadMessage['FILE_FETCH_SUCCESS'][language ?? 'en'], fileInfos));
                }
                else {
                    return res.send(Response.projectFailResp(`file not present/Please check Id`));
                }
            }
            if ((category && !categoryId) || (category && !type)) {
                options = { prefix: `${orgId}/${category}/` }
            }
            if ((category && categoryId) || (categoryId && !type)) {
                if (!category) {
                    return res.send(Response.projectFailResp('Please select category'));
                }
                options = { prefix: `${orgId}/${category}/${categoryId}/` }
            }
            if ((category && type) || (type && !categoryId)) {
                if (!category) {
                    return res.send(Response.projectFailResp('Please select category'));
                }
                if (!categoryId) {
                    return res.send(Response.projectFailResp(`${category} ${UploadMessage['ID_REQUIRED'][language ?? 'en']}`));
                }
                options = { prefix: `${orgId}/${category}/${categoryId}/${type}/` }
            }
            if (!category && !categoryId && !type && !imageId) {
                options = {
                    prefix: `${orgId}/`,
                };
            }
            const [files] = await bucket.getFiles(options);
            files.forEach((file) => {
                fileInfos.push({
                    imageId: file.metadata.generation,
                    fileName: file.name,
                    viweLinkURL: `${url}/${file.name}`,
                    downloadLinkUrl: file.metadata.mediaLink,
                });
            });

            Logger.info(fileInfos);
            fileInfos.length ? res.send(Response.projectSuccessResp(UploadMessage['FILE_FETCH_SUCCESS'][language ?? 'en'], fileInfos))
                : res.send(Response.projectFailResp(`Failed to fetch files`));
        } catch (err) {
            Logger.error(err);
            res.send(Response.projectFailResp(UploadMessage['FAILED_TO_FETCH_FILES'][language ?? 'en'], err.message));
        }
    }
    async deleteFiles(req, res, next) {
        const reuse = new Reuse(req);
        Logger.info(reuse);
        const { orgId, language } = reuse.result.userData?.userData;

        try {
            const Id = req.query.id;
            let data, found;
            let options
            if (Id) {
                options = {
                    prefix: `${orgId}/`,
                };
                const [files] = await bucket.getFiles(options);
                files.forEach(async (file) => {
                    if (file.metadata.generation == Id) {
                        found = file;
                    }
                })
                if (!found) {
                    return res.send(Response.projectFailResp(UploadMessage['FILE_NOT_FOUND'][language ?? 'en']));
                }
                else {
                    data = await found.delete();
                    return res.send(Response.projectSuccessResp(`Deleted file with id ${Id}`));
                }
            }
            else {
                options = {
                    prefix: `${orgId}/`
                }
            }
            data = bucket.getFiles(options, function (err, files) {
                for (var i in files) {
                    files[i].delete();
                }
            });
            if (data) {
                return res.send(Response.projectFailResp(UploadMessage['FAILED_TO_DELETE_FILES'][language ?? 'en']));
            }
            else {
                return res.send(Response.projectSuccessResp(UploadMessage['FILE_DELETE_SUCCESS'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(err);
            res.send(Response.projectFailResp(UploadMessage['FAILED_TO_DELETE_FILES'][language ?? 'en'], err.message));
        }
    }

}
const uploadImage = (file, folderName) =>
    new Promise(async (resolve, reject) => {
        let innerFolder;
        if (file.mimetype == PNG_MIME_TYPE || file.mimetype == JPEG_MIME_TYPE || file.mimetype == JPG_MIME_TYPE || file.mimetype == SVG_MIME_TYPE || file.mimetype == SVG_XML_MIME_TYPE) {
            innerFolder = `${folderName}/Image`
        }
        else if (file.mimetype == MP4_FILE) {
            innerFolder = `${folderName}/Video`
        }
        else if (file.mimetype == TEXT_FILE || DOC_FILE || HTML_FILE || HTM_FILE || PDF_FILE || CSV_FILE) {
            innerFolder = `${folderName}/Document`
        }
        const { originalname, buffer } = file;
        try {
            let folderExist = checkFolderExists(bucketName, innerFolder)
            if (!folderExist) {
                await storage.bucket(bucketName).file(innerFolder).save('');
            }
            const blob = storage.bucket(bucketName).file(`${innerFolder}/${originalname.replace(/ /g, '_')}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream
                .on('finish', async () => {
                    const options = {
                        entity: 'allUsers',
                        role: storage.acl.READER_ROLE,
                      };
            
                    try {
                        await blob.acl.add(options);
                        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

                        resolve(publicUrl);
                    } catch (aclError) {
                        reject(`Error applying ACL: ${aclError}`);
                    }
                })
                .on('error', (err) => {
                    reject(`Unable to upload file, something went wrong: ${err}`);
                })
                .end(buffer);
        } catch (err) {
            reject(`Error uploading image: ${err}`);
        }
    });


async function checkFolderExists(bucketName, folderPath) {
    try {
        const [files] = await storage.bucket(bucketName).getFiles({
            prefix: folderPath,
            maxResults: 1,
        });

        return files.length > 0;
    } catch (err) {
        Logger.error(err);
        throw err;
    }
}

export default new ProjectService();
