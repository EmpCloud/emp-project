
import joi from 'joi';
import joi_date from '@joi/date';
const Joi = joi.extend(joi_date);

class TaskValidation {
    createTask(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().default(null).hex().length(24).allow('',null).messages({ 'string.length': 'Please select valid projectId', 'string.hex': 'Please select valid projectId' }),
            standAloneTask: Joi.boolean().default(true),
            stageName: Joi.string().trim(true),
            taskTitle: Joi.string()
                .min(3)
                .max(100)
                .required(true),
            taskDetails: Joi.string()
                .min(0)
                .max(5000)
                .allow('', null)
                .trim(true),
            taskType: Joi.string()
                .default('Feature'),
            taskStatus: Joi.string()
                .default('Todo'),
            category: Joi.string()
                .default('Todo'),
            progress: Joi.number().default(0),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            taskCreator: Joi.object().keys({
                id: Joi.string(),
                orgId: Joi.string().trim(true),
                email: Joi.string().trim(true),
                firstName: Joi.string().trim(true),
                lastName: Joi.string().trim(true),
                role: Joi.string().trim(true),
                verified: Joi.boolean(),
                profilePic: Joi.string().trim(true),
                createdAt: Joi.date(),
                updatedAt: Joi.date(),
                __v: Joi.number(),
                _id: Joi.string().trim(true),
                password: Joi.string().trim(true),
                profilePic: Joi.string().trim(true),
                adminId: Joi.string().trim(true),
                Project_details: Joi.object(),
                task_details: Joi.object(),
                permission: Joi.string().trim(true),
            }),
            estimationDate: Joi.date().min(new Date().toISOString().split('T')[0]),
            dueDate: Joi.date().min(new Date().toISOString().split('T')[0]),
            estimationTime: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).required(),
            actualHours: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).default("00:00").allow('', null),
            priority: Joi.string().valid('High', 'Medium', 'Low'),
            assignedTo: Joi.array()
                .items({
                    id: Joi.string().hex().length(24),
                    orgId: Joi.string().trim(true),
                    email: Joi.string().trim(true),
                    firstName: Joi.string().trim(true),
                    lastName: Joi.string().trim(true),
                    role: Joi.string().trim(true),
                    verified: Joi.boolean(),
                    profilePic: Joi.string().trim(true),
                    createdAt: Joi.date(),
                    updatedAt: Joi.date(),
                    __v: Joi.number(),
                    _id: Joi.string().trim(true),
                    password: Joi.string().trim(true),
                    profilePic: Joi.string().trim(true),
                    adminId: Joi.string().trim(true),
                    Project_details: Joi.object(),
                    task_details: Joi.object(),
                    permission: Joi.string().trim(true),
                })
                .unique('id').messages({ 'string.pattern.base': 'Cannot add duplicate users please select different user' }),
            // group: Joi.array().items({
            //   groupId: Joi.string().hex().length(24).required()
            // }).unique("groupId"),
            attachment: Joi.array().items(Joi.string()),
            epicLink: Joi.array().items(Joi.string()),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
            checkBox:Joi.string().trim(true),
            url:Joi.string().trim(true),
            labels: Joi.string().trim(true),
            priority: Joi.string().valid('High','Medium','Low'),
            input_64: Joi.string().trim(true).max(64),
            input_256: Joi.string().trim(true).max(256),
            input_1000: Joi.string().trim(true).max(1000),
            date_mm_dd_yyyy: Joi.date().format(('MM-DD-YYYY')),
            date_dd_mm_yyyy: Joi.date().format(('DD-MM-YYYY')),
            date_dd_mon_yyyy: Joi.date().format(('DD-Mon-YY')),
            date_yy_mon_dd: Joi.date().format(('YY_Mon_DD')),
            dateTime_ddmmyyyy_hhmmss: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_mmddyyyy_hhmmss: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_ddmonyyyy_hhmmss:Joi.string().regex(/^(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_yymondd_hhmmss: Joi.string().regex(/^(\d{4})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_ddmmyyyy_hhmm:  Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/),
            dateTime_mmddyyyy_hhmm: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/),
            dateTime_yymondd_hhmm: Joi.string().regex(/^(\d{4})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2})$/),
            dateTime_ddmonyyyy_hhmm:  Joi.string().regex(/^(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4}) (\d{2}):(\d{2})$/),
            numberInput1: Joi.number().integer().max(6),
            numberInput2: Joi.number().integer().max(10)
        });
        const result = schema.validate(body);
        return result;
    }

    updatetask(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().allow(null,'').hex().length(24).messages({ 'string.length': 'Please select valid projectId', 'string.hex': 'Please select valid projectId' }),
            stageName: Joi.string().trim(true),
            taskTitle: Joi.string()
                .min(3)
                .max(100),
            taskDetails: Joi.string()
                .min(0)
                .max(5000)
                .allow('', null)
                .trim(true),
            taskType: Joi.string(),
            taskStatus: Joi.string(),
            category: Joi.string(),
            taskCreator: Joi.object().keys({
                id: Joi.string(),
                orgId: Joi.string().trim(true),
                email: Joi.string().trim(true),
                firstName: Joi.string().trim(true),
                lastName: Joi.string().trim(true),
                role: Joi.string().trim(true),
                verified: Joi.boolean(),
                profilePic: Joi.string().trim(true),
                createdAt: Joi.date(),
                updatedAt: Joi.date(),
                __v: Joi.number(),
                _id: Joi.string().trim(true),
                password: Joi.string().trim(true),
                profilePic: Joi.string().trim(true),
                adminId: Joi.string().trim(true),
                Project_details: Joi.object(),
                task_details: Joi.object(),
                permission: Joi.string().trim(true),
            }),
            estimationTime: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/),
            estimationDate: Joi.date(),
            dueDate:  Joi.date(),
            actualHours: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).default("00:00").allow('', null),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            priority: Joi.string().valid('High', 'Medium', 'Low'),
            assignedTo: Joi.array()
                .items({
                    id: Joi.string().hex().length(24),
                    orgId: Joi.string().trim(true),
                    email: Joi.string().trim(true),
                    firstName: Joi.string().trim(true),
                    lastName: Joi.string().trim(true),
                    role: Joi.string().trim(true),
                    verified: Joi.boolean(),
                    profilePic: Joi.string().trim(true),
                    createdAt: Joi.date(),
                    updatedAt: Joi.date(),
                    __v: Joi.number(),
                    _id: Joi.string().trim(true),
                    password: Joi.string().trim(true),
                    profilePic: Joi.string().trim(true),
                    adminId: Joi.string().trim(true),
                    Project_details: Joi.object(),
                    task_details: Joi.object(),
                    permission: Joi.string().trim(true),
                })
                .unique('id').messages({ 'string.pattern.base': 'Cannot add duplicate users please select different user' }),
            // group: Joi.array()
            //     .items({
            //         groupId: Joi.string().hex().length(24).required().empty(Joi.array().length(0)),
            //     })
            //     .unique('groupId'),
            attachment: Joi.array().items(Joi.string()),
            epicLink: Joi.array().items(Joi.string()),
            createdAt: Joi.date(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
    getTaskValidation(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().min(24).max(24),
            taskId: Joi.string().min(24).max(24),
        });
        const result = schema.validate(body);
        return result;
    }
    deleteValidation(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().min(24).max(24),
            taskId: Joi.string().min(24).max(24),
        });
        const result = schema.validate(body);
        return result;
    }

    deleteActivityValidation(body) {
        const schema = Joi.object().keys({
            task_id: Joi.string().min(24).max(24).default(null),
            activity_id: Joi.string().min(24).max(24).when('task_id', {
                is: null,
                then: Joi.required(),
            }),
            otherwise: Joi.optional().allow(null, ''),
        });
        const result = schema.validate(body);
        return result;
    }

    postCommentValidation(body) {
        const schema = Joi.object().keys({
            comment: Joi.string().max(500),
            userName:Joi.array().items(Joi.string().trim(true)),
            reply:Joi.array().items({
                comment:Joi.string().trim(true),
                userName:Joi.array().items(
                    Joi.string().trim(true)
                )
            })
        });
        const result = schema.validate(body);
        return result;
    }
    updateCommentValidaton(body) {
        const schema = Joi.object().keys({
            comment: Joi.string().max(500),
            userName:Joi.array().items(
                Joi.string().trim(true),
            ),
            isEdited: Joi.boolean().default(true),
            reply:Joi.array().items({
                comment:Joi.string().trim(true),
                userName:Joi.array().items(
                    Joi.string().trim(true)
                )
            })
        });
        const result = schema.validate(body);
        return result;
    }

    commentValidation(body) {
        const schema = Joi.object().keys({
            task_id: Joi.string().min(24).max(24).default(null),
            comment_id: Joi.string().min(24).max(24).when('task_id', {
                is: null,
                then: Joi.required(),
            }),
            otherwise: Joi.optional().allow(null, ''),
        });
        const result = schema.validate(body);
        return result;
    }
    createExtraFields(body,type,min,max) {
        switch (type) {
            case 'string':
                const stringValue =  Joi.object().pattern(/^/, Joi.string().min(min).max(max));
                const result =  stringValue.validate(body,type,min,max);
                return result;
                break;
            case 'number':
                const numberValue= Joi.object().pattern(/^/, Joi.number().integer().min(min).max(max));
                const results = numberValue.validate(body,type,min,max);
                return results;
                break;
            case 'date':
                const dateValue= Joi.object().pattern(/^/, Joi.date().iso());
                const resultValue =  dateValue.validate(body, type);
                return resultValue;
                break;
            case 'boolean':
                const booleanValue= Joi.object().pattern(/^/, Joi.boolean()); 
                const resultValues = dateTypes.validate(body, type);
                return resultValue;
                break;
        }
    }

    deleteMultiple(body) {
        const schema = Joi.object().keys({
        TaskId: Joi.array()
            .items({
                id: Joi.string().trim(true),
            })
            .unique('id'),
        })
        const result = schema.validate(body);
        return result;
    }
}
export default new TaskValidation();
