import Responses from '../response/response.js';
import { checkCollection, checkingFieldValues, filterFieldsValues } from './common.utils.js';
import TaskValidation from '../core/task/task.validate.js';
import SubTaskValidation from '../core/subTask/subTask.validate.js';
import Logger from '../resources/logs/logger.log.js';

async function configTaskFieldsAdd(organizationId, task, res, language) {
    let taskValues;
    taskValues = Object.keys(task);
    let configTaskFields = [],
        enabledFields = [],
        requiredFields = [],
        unRequiredFields = [],
        extraFields = [],
        newTask;
    let obj = {};
    const dynamicCollection = `configfieldschemas`;
    const dynamicDataBase = await checkCollection(dynamicCollection);
    const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
    configFields.forEach(entry => {
        entry['taskFields'].map(run => {
            configTaskFields.push(run);
        });
    });
    const dynamicSchema = `dynamicfieldschemas`;
    const dbDynamic = await checkCollection(dynamicSchema);
    if(dbDynamic){
    const addFields = await dbDynamic.collection(dynamicSchema).find({ orgId: organizationId }).toArray();
    if (addFields) {
        addFields.map(el => {
            if (el.createTaskField.fieldName) {
                extraFields.push(el.createTaskField.fieldName);
            }
        });
    }
}
    checkingFieldValues(configTaskFields, enabledFields, requiredFields, unRequiredFields);
    let fieldsPresent = filterFieldsValues(taskValues, requiredFields);
    const isPresented = requiredFields.filter(word => !fieldsPresent.includes(word));
    let output;
    if (isPresented.length > 0) {
        return res.send(Responses.taskFailResp(isPresented.length > 1 ? `Validation failed,${isPresented} fields required` : `Validation failed,${isPresented} field required`));
    }
    let totalEnabledFields = requiredFields.concat(enabledFields);
    Logger.info(totalEnabledFields);
    output = filterFieldsValues(taskValues, unRequiredFields);
    if (output.length > 0) {
        res.send(Responses.taskFailResp(`Validation failed,${output} fields are not enabled `));
    }
    // adding custom fields from admin in the project
    let Error;
    let newExtraFields = filterFieldsValues(taskValues, extraFields);
    await Promise.all(
        newExtraFields.map(async function (ele) {
            Object.keys(task).map(el => {
                if (el == ele) {
                    obj[el] = task[el];
                }
            });
            (await dbDynamic.collection(dynamicSchema).find({ 'createTaskField.fieldName': ele }).toArray()).map(mi => {
                let { min, max } = mi.createTaskField.conditions;
                let type = mi.createTaskField.type;
                let object = {};
                Object.keys(obj).map(el => {
                    if (el == ele) {
                        object[el] = obj[el];
                        if (mi.createTaskField.fieldName == ele) {
                            const { value, error } = TaskValidation.createExtraFields(object, type, min, max);
                            if (error) {
                                Error = error;
                            } else {
                                newExtraFields.map(ele => {
                                    delete task[ele];
                                });
                                newTask = task;
                            }
                        }
                    }
                });
            });
        })
    );
    return { newTask, obj: obj, Error: Error };
}
async function configSubTaskFieldsAdd(organizationId, subTask, res, language) {
    let subTaskValues;
    subTaskValues = Object.keys(subTask);
    let configTaskFields = [],
        enabledFields = [],
        requiredFields = [],
        unRequiredFields = [],
        extraFields = [],
        newSubTask;
    let obj = {};
    const dynamicCollection = `configfieldschemas`;
    const dynamicDataBase = await checkCollection(dynamicCollection);
    const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
    configFields.forEach(entry => {
        entry['subTaskFields'].map(run => {
            configTaskFields.push(run);
        });
    });
    checkingFieldValues(configTaskFields, enabledFields, requiredFields, unRequiredFields);
    let fieldsPresent = filterFieldsValues(subTaskValues, requiredFields);
    const isPresented = requiredFields.filter(word => !fieldsPresent.includes(word));
    let output;
    if (isPresented.length > 0) {
        return res.send(Responses.taskFailResp(isPresented.length > 1 ? `Validation failed,${isPresented} fields required` : `Validation failed,${isPresented} field required`));
    }
    let totalEnabledFields = requiredFields.concat(enabledFields);
    Logger.info(totalEnabledFields);
    output = filterFieldsValues(subTaskValues, unRequiredFields);
    if (output.length > 0) {
        res.send(Responses.taskFailResp(`Validation failed,${output} fields are not enabled `));
    }
    // adding custom fields from admin in the project
    const dynamicSchema = `dynamicfieldschemas`;
    const dbDynamic = await checkCollection(dynamicSchema);
    if(dbDynamic){
    const addFields = await dbDynamic.collection(dynamicSchema).find({ orgId: organizationId }).toArray();
    if (addFields) {
        addFields.map(el => {
            if (el.createSubTaskField.fieldName) {
                extraFields.push(el.createSubTaskField.fieldName);
            }
        });
    }
   }
    let Error;
    let newExtraFields = filterFieldsValues(subTaskValues, extraFields);
    await Promise.all(
        newExtraFields.map(async function (ele) {
            Object.keys(subTask).map(el => {
                if (el == ele) {
                    obj[el] = subTask[el];
                }
            });
            (await dbDynamic.collection(dynamicSchema).find({ 'createSubTaskField.fieldName': ele }).toArray()).map(mi => {
                let { min, max } = mi.createSubTaskField.conditions;
                let type = mi.createSubTaskField.type;
                let object = {};
                Object.keys(obj).map(el => {
                    if (el == ele) {
                        object[el] = obj[el];
                        if (mi.createSubTaskField.fieldName == ele) {
                            const { value, error } = SubTaskValidation.createExtraFields(object, type, min, max);
                            if (error) {
                                Error = error;
                            } else {
                                newExtraFields.map(ele => {
                                    delete subTask[ele];
                                });
                                newSubTask = subTask;
                            }
                        }
                    }
                });
            });
        })
    );
    return { newSubTask, obj: obj, Error: Error };
}
export { configTaskFieldsAdd, configSubTaskFieldsAdd };
