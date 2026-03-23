import Response from '../response/response.js';
import { configFieldSchema, dynamicFieldSchema } from '../core/customFields/customFields.model.js';
import { checkingFieldValues, filterFieldsValues } from './project.utils.js';
import Logger from '../resources/logs/logger.log.js';
import ProjectValidation from '../core/project/project.validate.js';
import { projectMessageNew } from '../core/language/language.translator.js';
import { projectObj, subTaskObj, taskObj, validConstants } from '../core/customFields/fields.constants.js';

async function configFieldsAdd(organizationId, project, res, language) {
    let projectValues = [];
    project.map(ele => {
        projectValues.push(Object.keys(ele));
    });
    let obj = {};
    let configProjectFields = [],
        enabledFields = [],
        requiredFields = [],
        unRequiredFields = [],
        extraFields = [],
        newProject;
    const configFields = await configFieldSchema.findOne({ orgId: organizationId });
    configProjectFields.push(configFields.projectFields[0]);
    const addFields = await dynamicFieldSchema.find({ orgId: organizationId });
    if (addFields) {
        addFields.map(el => {
            if (el.createProjectField.fieldName) {
                extraFields.push(el.createProjectField.fieldName);
            }
        });
    }
    checkingFieldValues(configProjectFields, enabledFields, requiredFields, unRequiredFields);
    let filteredRequiredFields = filterFieldsValues(projectValues, requiredFields);
    const isPresented = requiredFields.filter(word => !filteredRequiredFields.includes(word));
    if (isPresented.length > 0) {
        return res.send(Response.projectFailResp(isPresented.length > 1 ? `Validation failed,${isPresented} fields required` : `Validation failed,${isPresented} field required`));
    }
    let totalEnabledFields = requiredFields.concat(enabledFields);
    Logger.info(totalEnabledFields);
    let output = filterFieldsValues(projectValues, unRequiredFields);
    if (output.length > 0) {
        res.send(Response.projectFailResp(output.length > 1 ? `Validation failed,${output} fields are not enabled ` : `Validation failed,${output} field is not enabled `));
    }
    // adding custom fields from admin in the project
    let Error;
    let newExtraFields = filterFieldsValues(projectValues, extraFields);
    await Promise.all(
        newExtraFields.map(async function (ele) {
            project.forEach(entry => {
                Object.keys(entry).map(el => {
                    if (el == ele) {
                        obj[el] = entry[el];
                    }
                });
            });
            (await dynamicFieldSchema.find({ 'createProjectField.fieldName': ele })).map(mi => {
                let { min, max } = mi.createProjectField.conditions;
                let type = mi.createProjectField.type;
                let format = mi.createProjectField.format;
                let object = {};
                Object.keys(obj).map(el => {
                    if (el == ele) {
                        object[el] = obj[el];
                        if (mi.createProjectField.fieldName == ele) {
                            const { value, error } = ProjectValidation.createExtraFields(object, type, min, max, format);
                            if (error) {
                                Error = error;
                            } else {
                                newExtraFields.map(ele => {
                                    project.map(el => {
                                        delete el[ele];
                                    });
                                });
                                newProject = project;
                            }
                        }
                    }
                });
            });
        })
    );
    return { newProject, obj: obj, Error: Error };
}
async function checkAndUpdateFields(data, res, organizationId) {
    const projectExtraFields = Object.keys(data.projectFields[0]).filter(word => !Object.keys(projectObj[0]).includes(word));
    const taskExtraFields = Object.keys(data.taskFields[0]).filter(word => !Object.keys(taskObj[0]).includes(word));
    const subTaskExtraFields = Object.keys(data.subTaskFields[0]).filter(word => !Object.keys(subTaskObj[0]).includes(word));
    let findFields, fieldName;
    if (projectExtraFields.length > 0) {
        await Promise.all(
            projectExtraFields.map(async function (el) {
                fieldName = el;
                findFields = await dynamicFieldSchema.findOne({ orgId: organizationId, 'createProjectField.fieldName': el });
            })
        );
        if (!findFields) {
            return res.send(Response.projectFailResp(`Failed to enable ${fieldName} field, please check field name`));
        }
    }
    projectObj.map(ele => {
        projectExtraFields.map(el => {
            ele[el] = validConstants;
        });
    });
    if (taskExtraFields.length > 0) {
        await Promise.all(
            taskExtraFields.map(async function (el) {
                fieldName = el;
                findFields = await dynamicFieldSchema.findOne({ orgId: organizationId, 'createTaskField.fieldName': el });
            })
        );
        if (!findFields) {
            return res.send(Response.projectFailResp(`Failed to enable ${fieldName} field, please check field name`));
        }
    }
    taskObj.map(ele => {
        taskExtraFields.map(el => {
            ele[el] = validConstants;
        });
    });
    if (subTaskExtraFields.length > 0) {
        await Promise.all(
            subTaskExtraFields.map(async function (el) {
                fieldName = el;
                findFields = await dynamicFieldSchema.findOne({ orgId: organizationId, 'createSubTaskField.fieldName': el });
            })
        );
        if (!findFields) {
            return res.send(Response.projectFailResp(`Failed to enable ${fieldName} field, please check field name`));
        }
    }
    subTaskObj.map(ele => {
        subTaskExtraFields.map(el => {
            ele[el] = validConstants;
        });
    });
    return { projectObj: projectObj, taskObj: taskObj, subTaskObj: subTaskObj };
}
function customFieldsAddAndCheckExist(moduleFields, fieldName, updateFields, viewFields, res) {
    Object.keys(moduleFields[0]).map(ele => {
        if (ele == fieldName) {
            return res.send(Response.projectSuccessResp(`${fieldName} field is already present`));
        }
    });
    let updateData;
    updateFields.map(ele => {
        let { _id, ...newData } = ele.toJSON();
        newData[fieldName] = 0;
        updateData = newData;
    });
    let updateView;
    viewFields.map(ele => {
        let { _id, ...newData } = ele.toJSON();
        newData[fieldName] = 0;
        updateView = newData;
    });
    return { updateData: updateData, updateView: updateView };
}
export { configFieldsAdd, checkAndUpdateFields, customFieldsAddAndCheckExist };
