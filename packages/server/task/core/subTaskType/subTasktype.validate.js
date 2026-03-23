import Joi from 'joi';

class SubTaskTypeValidation {
    createSubTaskType(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            subTaskType: Joi.string()
                .min(3)
                .max(30)
                .required()
                .regex(/^[a-zA-Z][a-zA-Z0-9][^,]+$/)
                .messages({ 'string.pattern.base': 'SubTask Type must start with alphabet & have no special characters' }),
            isDefault: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updtateSubTaskType(body) {
        const schema = Joi.object().keys({
            adminId: Joi.string(),
            subTaskType: Joi.string()
                .min(3)
                .max(30)
                .regex(/^[a-zA-Z][a-zA-Z0-9][^,]+$/)
                .messages({ 'string.pattern.base': 'SubTask Type must start with alphabet & have no special characters' }),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new SubTaskTypeValidation();
