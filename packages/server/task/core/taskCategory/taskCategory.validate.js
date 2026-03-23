import Joi from 'joi';

class TaskCategoryValidation {
    createTaskCategory(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskCategory: Joi.string()
                .min(1)
                .max(30)
                .required(),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'Task Category must start with alphabet & have no special characters' }),
            isDefault: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updateTaskCategory(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            taskCategory: Joi.string()
                .min(1)
                .max(30),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                // .messages({ 'string.pattern.base': 'Task Category must start with alphabet & have no special characters' }),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new TaskCategoryValidation();
