import ConfigSchema from './adminConfig.model.js';
import { configFieldSchema, configViewFieldSchema } from '../customFields/customFields.model.js';
import Response from '../../response/response.js';
import adminSchema from '../admin/admin.model.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import ConfigValidation from './adminConfig.validate.js';
import { SaveData, project } from '../config/defaults/project.schema.js';
import { SaveDefaultTaskData, task } from '../config/defaults/task.schema.js';
import { saveDefaultSubData, subtask } from '../config/defaults/subtask.schema.js';
import { SaveDefaultTaskTypeData, defaultTaskTypes } from '../config/defaults/taskType.schema.js';
import { SaveDefaultTaskStatusData, defaultTaskStatus } from '../config/defaults/taskStatus.schema.js';
import { SaveDefaultTaskStageData, defaultTaskStages } from '../config/defaults/taskStages.schema.js';
import { SaveDefaultTaskCategoryData, defaultTaskCategory } from '../config/defaults/taskCategory.schema.js';
import { saveUserData, userInfo } from '../config/defaults/user.schema.js';
import { CalenderData, SaveCalenderData } from './defaults/calendar.schema.js';
import logger from '../../resources/logs/logger.log.js';
import { AdminConfigNew } from '../language/language.translator.js';
import { checkCollection } from '../../utils/project.utils.js';
import { SaveDefaultChatChannel, chatChannel } from './defaults/chatChannel.schema.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import { viewFieldConfig, createFields } from '../customFields/fields.constants.js';
import event from '../event/eventEmitter.js';
import NotificationService from '../notifications/notifications.service.js';
import permissionModel from '../permissions/permission.model.js';
import { defaultPermission } from '../permissions/permission.model.js'
import roleModel from '../roles/roles.model.js';
import { defaultRole } from '../roles/roles.model.js';
import shortcutKeyModel from '../shortcutKeys/shortcutKeys.model.js';
import { shortcutKey } from '../shortcutKeys/shortcutKeys.model.js';
class UserService {
    async createAdminConfig(req, res) {
        const result = req.verified;
        const { language, orgId: organizationId, _id: adminId, firstName: userName,lastName, profilePic: userProfilePic } = result?.userData?.userData;
        try {
            const data = req?.body;
            const isDataExist = await ConfigSchema.findOne({ orgId: organizationId });
            data.orgId = organizationId;
            if (!isDataExist) {
                let featureCount = 0;
                const configurations = Object.entries(data);
                configurations.forEach(async entry => {
                    const [key, value] = entry;
                    if (value == true) {
                        switch (key) {
                            case 'projectFeature':
                                featureCount += 1;
                                break;
                            case 'taskFeature':
                                featureCount += 1;
                                break;
                            case 'subTaskFeature':
                                featureCount += 1;
                                break;
                            case 'shortcutKeyFeature':
                                featureCount += 1;
                                break;
                            case 'invitationFeature':
                                featureCount += 1;
                                break;
                            case 'calendar':
                                featureCount += 1;
                                break;
                        }
                    }
                });
                if (featureCount === 0) return res.send(Response.projectFailResp(`Please select at least one feature.`));
                const isPresent = await configFieldSchema.find({ orgId: organizationId });
                if (isPresent.length == 0) {
                    createFields.orgId = organizationId;
                    await configFieldSchema.create(createFields);
                    viewFieldConfig.orgId = organizationId;
                    await configViewFieldSchema.create(viewFieldConfig);
                }
                let Data = await ConfigSchema.create(data);

                configurations.forEach(async entry => {
                    const [key, value] = entry;
                    if (value == true) {
                        switch (key) {
                            case 'projectFeature':
                                SaveData('Org_' + organizationId + '_' + key, project);
                                break;
                            case 'taskFeature':
                                SaveDefaultTaskData('Org_' + organizationId + '_' + key, task);
                                SaveDefaultTaskTypeData( defaultTaskTypes, adminId);
                                SaveDefaultTaskStatusData( defaultTaskStatus, adminId);
                                SaveDefaultTaskStageData( defaultTaskStages, adminId);
                                SaveDefaultTaskCategoryData( defaultTaskCategory, adminId);
                                break;
                            case 'subTaskFeature':
                                saveDefaultSubData('Org_' + organizationId + '_' + key, subtask);
                                break;
                            case 'shortcutKeyFeature':
                                await shortcutKeyModel.insertMany(shortcutKey);
                                break;
                            case 'invitationFeature':
                                saveUserData(`org_${organizationId}_user`, userInfo);
                                for (let item of defaultRole) {
                                    item.orgId = organizationId;
                                }
                                await roleModel.insertMany(defaultRole);
                                for (let item of defaultPermission) {
                                    item.orgId = organizationId;
                                }
                                await permissionModel.insertMany(defaultPermission);
                                break;
                            case 'chatFeature':
                                SaveDefaultChatChannel(`Org_${organizationId}_chatchannel`, chatChannel, adminId);
                                // SaveDefaultMessages(`Org_${organizationId}_messages`, messages, adminId);
                                break;
                            case 'calendar':
                                SaveCalenderData(`Org_${organizationId}_calendar`, CalenderData);
                                break;
                        }
                        await adminSchema.findOneAndUpdate({ orgId: organizationId }, { isConfigSet: true });
                    }
                });
                let user = data;
                let userData = await adminSchema.findOne({ email: result?.userData?.userData?.email });
                let { dashboardConfigData, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } = userData.toJSON();
                let accessToken = jwt.sign({ userData : filtereData}, config.get('token_secret'), { expiresIn: '24h' });
                //storing config activity log
                let enabledValue = [];
                configurations.forEach(async entry => {
                    const [key, value] = entry;
                    if (value == true) {
                        enabledValue.push(key);
                    }
                });
                enabledValue.toString();
                let configData = activityOfUser(`${userName +' '+ lastName} enabled ${enabledValue} `, 'Config', userName, 'Created', organizationId, adminId, userProfilePic);
                configData['configId'] = Data.id;
                event.emit('activity', configData);
                res.send(Response.projectSuccessResp(AdminConfigNew['ADMIN_CREATE_SUCCESS'][language ?? 'en'], { user, accessToken }));
            } else {
                res.send(Response.projectFailResp(AdminConfigNew['ADMIN_CONFIG_EXIST'][language ?? 'en'], `${data?.orgId}`));
            }
        } catch (err) {
            logger.error(`Error in catch ${err}`);
            return res.send(Response.projectFailResp(AdminConfigNew['ADMIN_CREATE_FAIL'][language ?? 'en'], err.message));
        }
    }

    async fetchAdminConfig(req, res) {
        const result = req.verified;
        const { language, _id: userId, adminId, firstName: userName,lastName,profilePic: userProfilePic, orgId: organizationId } = result?.userData?.userData;
        try {
            let resultData = await adminSchema.findOne({ orgId: organizationId });
            if (resultData.isConfigSet == true) {
                const isDataExist = await ConfigSchema.findOne({ orgId: organizationId });
                let configData = activityOfUser(`${userName+lastName} viewed config details `, 'Config', userName, 'Viewed', organizationId, userId, userProfilePic);
                configData['configId'] = isDataExist.id;
                event.emit('activity', configData);
                res.send(Response.projectSuccessResp(AdminConfigNew['ADMIN_FETCH_SUCCESS'][language ?? 'en'], { isDataExist }));
            } else {
                res.send(Response.projectFailResp(AdminConfigNew['ADMIN_FETCH_FAIL'][language ?? 'en']));
            }
        } catch (err) {
            logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(AdminConfigNew['ADMIN_ERROR'][language ?? 'en'], err.message));
        }
    }

    async updateAdminConfig(req, res) {
        const result = req.verified;
        let { language, _id: userId, adminId, firstName: userName,lastName, profilePic: userProfilePic, orgId: organizationId, isConfigSet } = result?.userData?.userData;
        try {
            // const configId = req.params.id;
            const data = req.body;
            logger.info(`data ${JSON.stringify(data)}`);
            const { error } = ConfigValidation.updateConfigValidation(data);
            if (error) {
                return res.send(Response.projectFailResp(`validation failed, please give proper data`, error.message));
            }
            
           if(result.type !== 'user'){
             adminId = result?.userData?.userData._id;
           }
           
            // Fetching config data
            const configData = await ConfigSchema.findOne({ orgId: organizationId });
            logger.info(`configData ${JSON.stringify(configData)}`);
            if (!configData) return res.send(Response.projectFailResp(`Admin config data not exist for the organization.`));
            // Config object is converted to array to loop into it
            const configurations = Object.entries(data);
            // Looping through configs for invalid operations
            for (const [key, value] of configurations) {
                switch (key) {
                    case 'projectFeature':
                        if (value === false && configData.projectFeature)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Project feature cannot be disabled.`));
                        break;
                    case 'taskFeature':
                        if (value === false && configData.taskFeature)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Task feature cannot be disabled.`));
                        break;
                    case 'subTaskFeature':
                        if (value === false && configData.subTaskFeature)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Subtask feature cannot be disabled.`));
                        break;
                    case 'shortcutKeyFeature':
                        if (value === false && configData.shortcutKeyFeature)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Shortcut feature cannot be disabled.`));
                        break;
                    case 'invitationFeature':
                        if (value === false && configData.invitationFeature)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Invitation feature cannot be disabled.`));
                        break;
                    case 'calendar':
                        if (value === false && configData.calendar)
                            // User is not able to disable feature
                            return res.send(Response.projectFailResp(`Calendar feature cannot be disabled.`));
                        break;
                }
            }
            // if task is not enabled then subtask can't be enabled
            if (data.subTaskFeature && !configData.taskFeature && !data.taskFeature) return res.send(Response.projectFailResp(`Task feature must be enabled to enable subtask.`));
            // updating the config
            const updatedConfig = await ConfigSchema.findOneAndUpdate({ orgId: organizationId }, data, {
                new: true,
            });
            logger.info(`updatedConfig ${JSON.stringify(updatedConfig)}`);
            let updatedFeatures = [];
            //Looping through config data for new feature enabling
            configurations.forEach(async entry => {
                const [key, value] = entry;
                if (value == true) {
                    switch (key) {
                        case 'projectFeature':
                            if (configData.projectFeature) break; // If feature is already enabled then no need to create collections
                            updatedFeatures.push(' Project');
                            SaveData('Org_' + organizationId + '_' + key, project);
                            break;
                        case 'taskFeature':
                            if (configData.taskFeature) break; // If feature is already enabled then no need to create collections
                            updatedFeatures.push(' Task');
                            SaveDefaultTaskData('Org_' + organizationId + '_' + key, task);
                            SaveDefaultTaskTypeData( defaultTaskTypes, adminId);
                            SaveDefaultTaskStatusData( defaultTaskStatus, adminId);
                            SaveDefaultTaskStageData( defaultTaskStages, adminId);
                            SaveDefaultTaskCategoryData( defaultTaskCategory, adminId);
                            break;
                        case 'subTaskFeature':
                            if (configData.subTaskFeature) break; // If feature is already enabled then no need to create collections
                            updatedFeatures.push(' Subtask');
                            saveDefaultSubData('Org_' + organizationId + '_' + key, subtask);
                            break;
                        case 'shortcutKeyFeature':
                            if (configData.shortcutKeyFeature) break; // If feature is already enabled then no need to create collections
                            updatedFeatures.push(' Shortcut Key');
                            await shortcutKeyModel.insertMany(shortcutKey);                            
                            break;
                        case 'invitationFeature':
                            if (configData.invitationFeature) break;
                            updatedFeatures.push(' Invitation');
                            saveUserData(`org_${organizationId}_user`, userInfo);
                            for (let item of defaultRole) {
                                item.orgId = organizationId;
                            }
                            await roleModel.insertMany(defaultRole);
                            for (let item of defaultPermission) {
                                item.orgId = organizationId;
                            }
                            await permissionModel.insertMany(defaultPermission);
                            break;
                        case 'calendar':
                            if (configData.calendar) break;
                            updatedFeatures.push(' Calendar');
                            SaveCalenderData(`Org_${organizationId}_calendar`, CalenderData);
                            break;
                    }
                }
            });
           
            if (updatedFeatures.length > 0) {
                let updatingValue = updatedFeatures.toString();
                let configUpdateData = activityOfUser(`${userName+lastName} updated the ${updatingValue} value `, 'Config', userName, 'Updated', organizationId, userId, userProfilePic);
                configUpdateData['configId'] = configData.id;
                event.emit('activity', configUpdateData);
                // Notification to Admin
                if (isConfigSet === true) {
                    const message = `${userName+lastName }Updated the ${updatingValue} value`;
                    await NotificationService.adminNotification(message, adminId, userId,{ collection: 'configschemas', id: null });
                }
            }
            return updatedFeatures.length
                ? res.send(Response.projectSuccessResp(`Successfully enabled${updatedFeatures.toString()} features`))
                : res.send(Response.projectSuccessResp(`Features are updated.`));
        } catch (err) {
            logger.error(`Error in catch ${JSON.stringify(err)}`);
            return res.send(Response.projectFailResp(`Error while updating admin config.`));
        }
    }
}

export default new UserService();
