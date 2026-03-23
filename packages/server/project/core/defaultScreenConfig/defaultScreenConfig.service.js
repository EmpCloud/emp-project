import Response from '../../response/response.js';
import tableConfigValidation from './defaultScreenConfig.validation.js';
import Logger from '../../resources/logs/logger.log.js';
import DefaultScreenConfigSchema from './defaultScreenConfig.model.js';

class tableConfigService {
    async fetchScreenConfig(req, res, next) {
        try {
            const result = req.verified;
            let { _id: userId } = result?.userData?.userData;
            let configData;
            (result?.userData?.userData?.isAdmin) ?
            configData = await DefaultScreenConfigSchema.find({ adminId: userId }) :
            configData = await DefaultScreenConfigSchema.find({ userId: userId })
            configData.length ? res.send(Response.projectSuccessResp(`success`, await this.transformingData(configData[0]))) : res.send(Response.projectFailResp('Default Screen Config not found for the user', 'Invalid Admin Id'));
        } catch (error) {
            Logger.error(error)
            res.send(Response.projectFailResp('Error in fetch config details', error.message));
        }
    }

    async updateScreenConfig(req, res, next) {
        try {
            const result = req.verified;
            let { _id: userId } = result?.userData?.userData;
            const { value,error } = tableConfigValidation.updateConfig(req?.body);
           
            Logger.error(error);
            if (error) return res.send(Response.projectFailResp('validation error', error.message));
            let targetKey;
            for (const key in value) {
                  targetKey = key;
                  break;
                }
            const module = targetKey;
            const values = value[targetKey][0].value;
        
            const updateObject = {};
            updateObject[`${module}.${values}`] = value[targetKey][0];
            let updateData;
            (result?.userData?.userData?.isAdmin) ?
            updateData = await DefaultScreenConfigSchema.findOneAndUpdate({ adminId: userId }, { $set:  updateObject }, { returnDocument: 'after' })
            : updateData = await DefaultScreenConfigSchema.findOneAndUpdate({ userId: userId }, { $set:  updateObject }, { returnDocument: 'after' })
            Object.keys(updateData).length ? res.send(Response.projectSuccessResp(`success`, await this.transformingData(updateData))) : res.send(Response.projectFailResp('Error in Updating the config', 'something went wrong'));
        } catch (error) {
            Logger.error(error)
            res.send(Response.projectFailResp('Error in updating config details', error.message));
        }
    }

    async transformingData(inputData) {
        const transformedData = {
            project: [],
            task: [],
            member: [],
            group: [],
            permission: [],
            role:[],
            _id: inputData._id,
            adminId: inputData.adminId,
        };

        Object.keys(inputData.project).forEach(key => {
            if (key !== 'clientCompany' && key !== 'clientName') {
                transformedData.project.push(inputData.project[key]);
            }
        });

        Object.keys(inputData.task).forEach(key => {
            transformedData.task.push(inputData.task[key]);
        });

        Object.keys(inputData.member).forEach(key => {
            transformedData.member.push(inputData.member[key]);
        });

        Object.keys(inputData.group).forEach(key => {
            transformedData.group.push(inputData.group[key]);
        });
        
        Object.keys(inputData.permission).forEach(key => {
            transformedData.permission.push(inputData.permission[key]);
        });

        Object.keys(inputData.role).forEach(key => {
            transformedData.role.push(inputData.role[key]);
        });

        return transformedData;
    }
}

export default new tableConfigService();
