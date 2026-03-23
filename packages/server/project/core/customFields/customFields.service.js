import { configFieldSchema, configViewFieldSchema, dynamicFieldSchema } from './customFields.model.js';
import { createFieldConfig } from './fields.constants.js';
import { totalFields, configSelectFields, filterFields, defaultFieldsInfo } from '../../utils/project.utils.js';
import { checkAndUpdateFields, customFieldsAddAndCheckExist } from '../../utils/customFields.utils.js';
import fieldsValidation from './fields.validate.js';
import logger from '../../resources/logs/logger.log.js';
import Response from '../../response/response.js';
import ConfigSchema from '../config/adminConfig.model.js';

class FieldService {
    async DefaultFiledAccess(req, res, next) {
        const result = req.verified;
        logger.info(result);
        const { orgId } = result?.userData?.userData;
        if (result.state == true) {
            try {
                let defaultProjectValues = [],
                    defaultTaskValues = [],
                    defaultSubTaskValues = [],
                    dynamicProjectFields = [],
                    dynamicTaskFields = [],
                    dynamicSubTaskFields = [],
                    defaultUserFields = [],
                    dynamicUserFields = [];
                const { projectFields, taskFields, subTaskFields, userFields } = createFieldConfig;
                defaultFieldsInfo(projectFields, defaultProjectValues, dynamicProjectFields);
                defaultFieldsInfo(taskFields, defaultTaskValues, dynamicTaskFields);
                defaultFieldsInfo(subTaskFields, defaultSubTaskValues, dynamicSubTaskFields);
                defaultFieldsInfo(userFields, defaultUserFields, dynamicUserFields);
                const addFields = await dynamicFieldSchema.find({ orgId: orgId });
                if (addFields) {
                    addFields.map(ele1 => {
                        if (ele1.createProjectField.fieldName != null) {
                            dynamicProjectFields.push(ele1.createProjectField.fieldName);
                        }
                        if (ele1.createTaskField.fieldName != null) {
                            dynamicTaskFields.push(ele1.createTaskField.fieldName);
                        }
                        if (ele1.createSubTaskField.fieldName != null) {
                            dynamicSubTaskFields.push(ele1.createSubTaskField.fieldName);
                        }
                    });
                }
                let defaultFields = {
                    projectDefaultFields: defaultProjectValues,
                    projectCustomFields: dynamicProjectFields,
                    taskDefaultFields: defaultTaskValues,
                    taskCustomFields: dynamicTaskFields,
                    subTaskDefaultFields: defaultSubTaskValues,
                    subTaskCustomFields: dynamicSubTaskFields,
                    userDefaultFields: defaultUserFields,
                    userCustomFields: dynamicUserFields,
                };
                logger.info(defaultFields);
                res.send(Response.projectSuccessResp('Successfully fetched default Fields data.', defaultFields));
            } catch (err) {
                logger.error(err);
                res.send(Response.projectFailResp('Error while fetching fields.', err));
            }
        } else {
            res.send(result);
        }
    }

    async addNewDynamicFields(req, res, next) {
        const result = req.verified;
        const { orgId: organizationId } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const data = req.body;
                let { createProjectField: projectField, createTaskField: taskField, createSubTaskField: subTaskField } = data;
                const { value, error } = fieldsValidation.dynamicFieldsCreate(data);
                if (error) return res.send(Response.projectFailResp('Validation failed', error));
                const { projectFields, taskFields, subTaskFields } = createFieldConfig;
                let addNewFields = await configFieldSchema.findOne({ orgId: organizationId });
                let { projectFields: addNewProjectFields, taskFields: addNewTaskFields, subTaskFields: addNewSubTaskFields } = addNewFields;
                let viewAccess = await configViewFieldSchema.findOne({ orgId: organizationId });
                let { projectViewFields, taskViewFields, subTaskViewFields } = viewAccess;
                let totalResponse = [],
                    createData;
                if (projectField) {
                    let projectFieldName = projectField.fieldName;
                    const isExist = await dynamicFieldSchema.find({ orgId: organizationId, 'createProjectField.fieldName': projectFieldName });
                    let { updateData, updateView } = customFieldsAddAndCheckExist(projectFields, projectFieldName, addNewProjectFields, projectViewFields, res);
                    if (isExist.length > 0) {
                        return res.send(Response.projectSuccessResp(`${projectFieldName} field is already present in project`));
                    } else {
                        await configFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'projectFields.$[]': updateData } }, { strict: false });
                        await configViewFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'projectViewFields.$[]': updateView } }, { strict: false });
                        let { createProjectField, orgId } = value;
                        let valueField = { createProjectField, orgId };
                        createData = await dynamicFieldSchema.create(valueField);
                        totalResponse.push(createData);
                    }
                }
                if (taskField) {
                    let taskFieldName = taskField.fieldName;
                    const taskIsExist = await dynamicFieldSchema.find({ orgId: organizationId, 'createTaskField.fieldName': taskFieldName });
                    let { taskUpdateData, taskUpdateView } = customFieldsAddAndCheckExist(taskFields, taskFieldName, addNewTaskFields, taskViewFields, res);
                    if (taskIsExist.length > 0) {
                        return res.send(Response.projectSuccessResp(`${taskFieldName} field is already present in task.`));
                    } else {
                        await configFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'taskFields.$[]': taskUpdateData } }, { strict: false });
                        await configViewFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'taskViewFields.$[]': taskUpdateView } }, { strict: false });
                        let { createTaskField, orgId, format } = value;
                        let valueField = { createTaskField, orgId, format };
                        createData = await dynamicFieldSchema.create(valueField);
                        totalResponse.push(createData);
                    }
                }
                if (subTaskField) {
                    let subTaskFieldName = subTaskField.fieldName;
                    const subTaskIsExist = await dynamicFieldSchema.find({ orgId: organizationId, 'createSubTaskField.fieldName': subTaskFieldName });
                    let { subTaskUpdateData, subTaskUpdateView } = customFieldsAddAndCheckExist(subTaskFields, subTaskFieldName, addNewSubTaskFields, subTaskViewFields, res);
                    if (subTaskIsExist.length > 0) {
                        return res.send(Response.projectSuccessResp(`${subTaskFieldName} field is already present in subTask.`));
                    } else {
                        await configFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'subTaskFields.$[]': subTaskUpdateData } }, { strict: false });
                        await configViewFieldSchema.updateOne({ orgId: organizationId }, { $set: { 'subTaskViewFields.$[]': subTaskUpdateView } }, { strict: false });
                        let { createSubTaskField, orgId } = value;
                        let valueField = { createSubTaskField, orgId };
                        createData = await dynamicFieldSchema.create(valueField);
                        totalResponse.push(createData);
                    }
                }
                if (totalResponse.length > 0) res.send(Response.projectSuccessResp('Field created successFully', { data: totalResponse }));
            } catch (err) {
                logger.error(err);
                return res.send(Response.projectFailResp('Failed to create Fields', err));
            }
        } else {
            res.send(result);
        }
    }

    async configFields(req, res, next) {
        const result = req.verified;
        const { orgId: organizationId } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const data = req.body;
                let checkValue = await checkAndUpdateFields(data, res, organizationId);
                let { projectObj, taskObj, subTaskObj } = checkValue;
                const { value, error } = fieldsValidation.configFieldsValidation(data, projectObj, taskObj, subTaskObj);
                if (error) return res.send(Response.projectFailResp('Validation failed', error));
                const isEnabledFeature = await ConfigSchema.findOne({ orgId: organizationId });
                if (data?.projectFields || data?.taskFields || data?.subTaskFields || data?.userFields) {
                    if (isEnabledFeature.projectFeature == false) {
                        return res.send(Response.projectFailResp("Project feature is not enabled, can't enable project fields."));
                    } else if (isEnabledFeature.taskFeature == false) {
                        return res.send(Response.projectFailResp("Task feature is not enabled, can't enable project fields."));
                    } else if (isEnabledFeature.subTaskFeature == false) {
                        return res.send(Response.projectFailResp("subTask feature is not enabled, can't enable project fields."));
                    } else if (isEnabledFeature.invitationFeature == false) {
                        return res.send(Response.projectFailResp("InvitationFeature  is not enabled, can't enable project fields."));
                    }
                }
                let createData = await configFieldSchema.findOneAndUpdate({ orgId: organizationId }, data, { new: true });
                if (createData) res.send(Response.projectSuccessResp('Fields config updated successFully', { data: createData }));
            } catch (err) {
                logger.error(err);
                return res.send(Response.projectFailResp('Error while adding config.', err));
            }
        } else {
            return res.send(result);
        }
    }

    async configViewFields(req, res, next) {
        const result = req.verified;
        const { orgId: organizationId } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const data = req.body;
                const { error } = fieldsValidation.configViewValidation(data);
                if (error) {
                    return res.send(Response.projectFailResp('Validation failed, error', error));
                }
                const enabledFields = await configFieldSchema.find({ orgId: organizationId });
                if (data?.projectViewFields) {
                    let totalEnabledFields = [],
                        visibleFields = [];
                    let fields;
                    let presentedFields = data?.projectViewFields;
                    enabledFields.forEach(entry => {
                        fields = entry['projectFields'];
                    });
                    totalFields(presentedFields, visibleFields);
                    configSelectFields(enabledFields, totalEnabledFields, fields);
                    const notAllowFields = filterFields(visibleFields, totalEnabledFields);
                    if (notAllowFields.length > 0) {
                        return res.send(
                            Response.projectFailResp(
                                notAllowFields.length > 1
                                    ? `Failed to enable ${notAllowFields} fields view access, please check field configurations`
                                    : `Failed to enable ${notAllowFields} field view access, please check field configurations`
                            )
                        );
                    }
                }
                if (data?.taskViewFields) {
                    let totalEnabledFields = [],
                        taskAllowedFields = [],
                        fields;
                    let taskViewFields = data?.taskViewFields;
                    enabledFields.forEach(entry => {
                        fields = entry['taskFields'];
                    });
                    totalFields(taskViewFields, taskAllowedFields);
                    configSelectFields(enabledFields, totalEnabledFields, fields);
                    const notAllowFields = filterFields(taskAllowedFields, totalEnabledFields);
                    if (notAllowFields.length > 0) {
                        return res.send(
                            Response.projectFailResp(
                                notAllowFields.length > 1
                                    ? `Failed to enable ${notAllowFields} fields view access, please check field configurations`
                                    : `Failed to enable ${notAllowFields} field view access, please check field configurations`
                            )
                        );
                    }
                }
                if (data?.subTaskViewFields) {
                    let totalEnabledFields = [],
                        taskAllowedFields = [],
                        fields;
                    let subTaskViewFields = data?.subTaskViewFields;
                    enabledFields.forEach(entry => {
                        fields = entry['subTaskFields'];
                    });
                    totalFields(subTaskViewFields, taskAllowedFields);
                    configSelectFields(enabledFields, totalEnabledFields, fields);
                    const notAllowFields = filterFields(taskAllowedFields, totalEnabledFields);
                    if (notAllowFields.length > 0) {
                        return res.send(
                            Response.projectFailResp(
                                notAllowFields.length > 1
                                    ? `Failed to enable ${notAllowFields} fields view access, please check field configurations`
                                    : `Failed to enable ${notAllowFields} field view access, please check field configurations`
                            )
                        );
                    }
                }
                const visibleAccess = await configViewFieldSchema.findOneAndUpdate({ orgId: organizationId }, data, { new: true });
                visibleAccess ? res.send(Response.projectSuccessResp('successfully updated view fields.', visibleAccess)) : res.send(Response.projectFailResp(`Failed to add fields`));
            } catch (error) {
                logger.error(error);
                return res.send(Response.projectFailResp('Error while adding view access.', error));
            }
        } else {
            return res.send(result);
        }
    }
}

export default new FieldService();
