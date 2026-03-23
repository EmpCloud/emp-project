import UploadService from './upload.service.js';

class UploadController {
    async create(req, res, next) {
        /* 	#swagger.tags = ['Upload']
                        #swagger.description = 'Which Uplaod multimedia file' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*
      #swagger.consumes = ['multipart/form-data'] 
      #swagger.parameters['files'] = {
                in: 'formData',
                type: 'array',
                minItems: 1,
                maxItems: 10,
                required: true,
                "collectionFormat": "multi",
                description: 'The file to upload',
                items: { type: 'file' }
                }*/
         /*	#swagger.parameters['category'] = {
               in: 'query',
               description: 'select File Type',
               required: true,
               enum: ['User', 'Project', 'Task', 'SubTask'],
        }*/
         /*  #swagger.parameters['categoryId'] = {
                       in: 'query',
                       required: true,
                       description: 'category Id',
        }*/

        return await UploadService.create(req, res, next);
    }
    async getListFiles(req, res, next) {
        /* #swagger.tags = ['Upload']
                       #swagger.description = 'This routes is used for fetch the files'  */

        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['imageId'] = {
                      in: 'query',
                      description: 'fetch by image Id',
       }*/
       /*	#swagger.parameters['category'] = {
               in: 'query',
               description: 'select File Type',
               enum: ['User', 'Project', 'Task', 'SubTask'],
        }*/
        /*	#swagger.parameters['type'] = {
               in: 'query',
               description: 'select File Type',
               enum: ['Image', 'Video', 'Document'],
        }*/
         /*  #swagger.parameters['categoryId'] = {
                       in: 'query',
                       description: 'category Id',
        }*/
        return await UploadService.getListFiles(req, res, next);
    }
    async deleteFiles(req, res, next) {
        /* 	#swagger.tags = ['Upload']
                        #swagger.description =  'This routes is used to delete the files' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['id'] = {
                      in: 'query',
                      description: 'Delete by Id',
       }*/
        return await UploadService.deleteFiles(req, res, next);

    }
}
export default new UploadController();
