import Joi from 'joi';
import { userObj, projectViewObj, taskViewObj, subTaskViewObj, userViewObj } from './fields.constants.js';
const customJoi = Joi.defaults(schema =>
    schema.options({
        allowUnknown: true,
    })
);
class fieldValidation{
    configFieldsValidation(body,projectObj,taskObj, subTaskObj) {
        const schema = customJoi.object().keys({
            projectFields: Joi.array()
                .items(...projectObj.values(k => k))
                .default(Array.from(projectObj.values())),
            taskFields: Joi.array()
                .items(...taskObj.values(k => k))
                .default(Array.from(taskObj.values())),
            subTaskFields: Joi.array()
                .items(...subTaskObj.values(k => k))
                .default(Array.from(subTaskObj.values())),
            userFields: Joi.array()
                .items(...userObj.values(k => k))
                .default(Array.from(userObj.values())),
        });
        const result = schema.validate(body,projectObj,taskObj, subTaskObj);
        return result;
    }

    configViewValidation(body) {
        const schema = customJoi.object().keys({
            projectViewFields: Joi.array()
                .items(...projectViewObj.values(k => k))
                .default(Array.from(projectViewObj.values())),
            taskViewFields: Joi.array()
                .items(...taskViewObj.values(k => k))
                .default(Array.from(taskViewObj.values())),
            subTaskViewFields: Joi.array()
                .items(...subTaskViewObj.values(k => k))
                .default(Array.from(subTaskViewObj.values())),
            userViewFields: Joi.array()
                .items(...userViewObj.values(k => k))
                .default(Array.from(userViewObj.values())),
        });
        const result = schema.validate(body);
        return result;
    }
    dynamicFieldsCreate(body) {
        const schema = Joi.object().keys({
            createProjectField: Joi.object().keys({
                fieldName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/),
                type: Joi.string().valid('number', 'string', 'date', 'boolean'),
                conditions: Joi.object().keys({
                    min: Joi.number().required(),
                    max: Joi.number().required(),
                    valid: Joi.number(),
                }),
                format: Joi.string(),
            }),
            createTaskField: Joi.object().keys({
                fieldName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/),
                type: Joi.string().valid('number', 'string', 'date', 'boolean'),
                conditions: Joi.object().keys({
                    min: Joi.number().required(),
                    max: Joi.number().required(),
                    valid: Joi.number(),
                }),
            }),
            createSubTaskField: Joi.object().keys({
                fieldName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/),
                type: Joi.string().valid('number', 'string', 'date', 'boolean'),
                conditions: Joi.object().keys({
                    min: Joi.number().required(),
                    max: Joi.number().required(),
                    valid: Joi.number(),
                }),
            }),
            orgId: Joi.string(),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new fieldValidation();