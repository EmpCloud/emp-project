import Joi from 'joi';

class MessageValidation {
    sendMsg(body) {
        const schema = Joi.object().keys({
            content: Joi.string().required(true).max(2000),
            createdAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
    addPoll(body) {
        const schema = Joi.object().keys({
            question: Joi.string().required(true).max(2000),
            options: Joi.string().required(true),
            createdAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}

export default new MessageValidation();
