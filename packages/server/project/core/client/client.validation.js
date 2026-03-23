import Joi from 'joi';
class clientVlaidationService {
    createClient(body) {
        const schema = Joi.object().keys({
            clientName: Joi.string().required(true),
            orgId: Joi.string(),
            projectIds: Joi.array().items({
                id: Joi.string().min(24).max(24)
            })
        })
        const result = schema.validate(body);
        return result;
    }
    createCompany(body) {
        const schema = Joi.object().keys({
            clientCompany: Joi.string().required(true),
            clientName: Joi.array().items({
                id: Joi.string().min(24).max(24)
            }),
            orgId: Joi.string(),
            projectIds: Joi.array().items({
                id: Joi.string().min(24).max(24)
            })
        })
        const result = schema.validate(body);
        return result;
    }

    updateClient(body) {
        const schema = Joi.object().keys({
            clientName: Joi.string(),
            orgId: Joi.string(),
            projectIds: Joi.array().items({
                id: Joi.string().min(24).max(24)
            })
        })
        const result = schema.validate(body);
        return result;
    }
    updateCompany(body) {
        const schema = Joi.object().keys({
            clientCompany: Joi.string(),
            clientName: Joi.array().items({
                id: Joi.string().min(24).max(24)
            }),
            orgId: Joi.string(),
            projectIds: Joi.array().items({
                id: Joi.string().min(24).max(24)
            })
        })
        const result = schema.validate(body);
        return result;
    }
}
export default new clientVlaidationService();