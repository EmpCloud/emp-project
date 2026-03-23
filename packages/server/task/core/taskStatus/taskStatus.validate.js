import Joi from 'joi';

class TaskStatusValidation {
    createTaskStatus(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskStatus: Joi.string()
                .min(1)
                .max(30)
                .required(true),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'TaskStatus must start with alphabet & have no special characters' }),
            isDefault: Joi.boolean().default(false),
            isOverwrite: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updateTaskStatus(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskStatus: Joi.string()
                .min(1)
                .max(30),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'TaskStatus must start with alphabet & have no special characters' }),
            isOverwrite: Joi.boolean(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new TaskStatusValidation();
