import Joi from 'joi';

class ChatValidation {
    createGroup(body) {
        const schema = Joi.object().keys({
            chatName: Joi.string()
                .min(3)
                .max(20)
                .required(true)
                .regex(/^[a-zA-Z][a-zA-Z0-9 @']+$/)
                .messages({ 'string.pattern.base': 'Chat name must start with alphabet' }),
            users: Joi.array().items().unique(),
            createdAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    renameGroup(body) {
        const schema = Joi.object().keys({
            chatName: Joi.string()
                .min(3)
                .max(20)
                .required(true)
                .regex(/^[a-zA-Z][a-zA-Z0-9 @']+$/)
                .messages({ 'string.pattern.base': 'Chat name must start with alphabet' }),
            createdAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}

export default new ChatValidation();
