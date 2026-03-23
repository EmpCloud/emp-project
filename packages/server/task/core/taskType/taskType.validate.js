import Joi from 'joi';

class TaskTypeValidation {
    createTaskType(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskType: Joi.string()
                .min(1)
                .max(30)
                .required(true),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'TaskType must start with alphabet & have no special characters' }),
            isDefault: Joi.boolean().default(false),
            isOverwrite: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updateTaskType(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskType: Joi.string()
                .min(1)
                .max(30),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'TaskType must start with alphabet & have no special characters' }),
            isOverwrite: Joi.boolean(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new TaskTypeValidation();
