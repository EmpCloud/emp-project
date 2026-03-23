import Joi from 'joi';

class SubTaskStatusValidation {
    createSubTaskStatus(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            subTaskStatus: Joi.string()
                .min(3)
                .max(30)
                .required(true)
                .regex(/^[a-zA-Z][a-zA-Z0-9][^,]+$/)
                .messages({ 'string.pattern.base': 'SubTask Status must start with alphabet & have no special characters' }),
            isDefault: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updtateSubTaskStatus(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            subTaskStatus: Joi.string()
                .min(3)
                .max(30)
                .regex(/^[a-zA-Z][a-zA-Z0-9][^,]+$/)
                .messages({ 'string.pattern.base': 'SubTask Status must start with alphabet & have no special characters' }),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new SubTaskStatusValidation();
