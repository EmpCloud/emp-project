import joi from 'joi';
import joi_date from '@joi/date';
const Joi = joi.extend(joi_date);;

class SubTaskValidation {
    createSubTask(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().allow(null).allow("").hex().length(24).messages({ 'string.length': 'Please select valid projectId', 'string.hex': 'Please select valid projectId' }),
            taskId: Joi.string().required().hex().length(24).messages({ 'string.length': 'Please select valid taskId', 'string.hex': 'Please select valid taskId' }),
            subTaskStageName: Joi.string().trim(true).default('Default'),
            subTaskCategory: Joi.string().default('Default'),
            subTaskTitle: Joi.string()
                .required(),
            subTaskDetails: Joi.string().allow('', null),
            subTaskType: Joi.string()
                .default('Feature'),
            dueDate:  Joi.date().min(new Date().toISOString().split('T')[0]),
            estimationDate: Joi.date().min(new Date().toISOString().split('T')[0]),
            estimationTime: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).required(),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            actualHours: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).default("00:00").allow('', null),
            subTaskAssignedTo: Joi.array()
                .items({
                    id: Joi.string().hex().length(24).required(),
                })
                .unique('id'),
            // group: Joi.array()
            //     .items({
            //         groupId: Joi.string().hex().length(24).required(),
            //     })
            //     .unique('groupId'),
            attachment: Joi.array().items(Joi.string()),
            epicLink: Joi.array().items(Joi.string()),
            priority: Joi.string().default('Low').valid('High', 'Medium', 'Low'),
            subTaskStatus: Joi.string().default('Todo'),
            progress: Joi.number().default(0),
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
    updateSubtask(body) {
        const schema = Joi.object().keys({
            projectId: Joi.string().allow(null).hex().length(24).messages({ 'string.length': 'Please select valid projectId', 'string.hex': 'Please select valid projectId' }),
            taskId: Joi.string().hex().length(24).messages({ 'string.length': 'Please select valid taskId', 'string.hex': 'Please select valid taskId' }),
            subTaskStageName: Joi.string().trim(true),
            subTaskTitle: Joi.string(),
            subTaskDetails: Joi.string().allow('', null),
            subTaskType: Joi.string(),
            subTaskCategory: Joi.string(),
            dueDate:  Joi.date(),
            estimationDate: Joi.date(),
            actualHours: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/).default("00:00").allow('', null),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            subTaskAssignedTo: Joi.array()
                .items({
                    id: Joi.string().hex().length(24).required(),
                })
                .unique('id'),
            // group: Joi.array()
            //     .items({
            //         groupId: Joi.string().hex().length(24).required().empty(Joi.array().length(0)),
            //     })
            //     .unique('groupId'),
            estimationTime: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/),
            attachment: Joi.array().items(Joi.string()),
            epicLink: Joi.array().items(Joi.string()),
            priority: Joi.string().valid('High', 'Medium', 'Low'),
            subTaskStatus: Joi.string(),
            createdAt: Joi.date(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    deleteActivityValidation(body) {
        const schema = Joi.object().keys({
            subtask_id: Joi.string().default(null),
            activity_id: Joi.string().when('subtask_id', {
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
            userName: Joi.array().items(
                Joi.string().trim(true)
            ),
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
            subtask_id: Joi.string().default(null),
            comment_id: Joi.string().when('subtask_id', {
                is: null,
                then: Joi.required(),
            }),
            otherwise: Joi.optional().allow(null, ''),
            userName: Joi.array().items(
                Joi.string().trim(true)
            ),
            reply:Joi.array().items({
                comment:Joi.string().trim(true),
                userName:Joi.array().items(
                    Joi.string().trim(true)
                )
            }),
            orderBy: Joi.string(),
            sort: Joi.string()
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
                const resultValues = booleanValue.validate(body, type);
                return resultValues;
                break;
        }
    }

    deleteMultiple(body) {
        const schema = Joi.object().keys({
        SubTaskId: Joi.array()
            .items({
                id: Joi.string().trim(true),
            })
            .unique('id'),
        })
        const result = schema.validate(body);
        return result;
    }
}
export default new SubTaskValidation();
