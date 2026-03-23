import Joi from 'joi';

class defaultScreenValidation {
    updateConfig(body) {
        const schema = Joi.object().keys({
            project: Joi.array().items(),
            task: Joi.array().items(),
            member:Joi.array().items(),
            group: Joi.array().items(),
            permission:Joi.array().items(),
            role:Joi.array().items(),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new defaultScreenValidation();
