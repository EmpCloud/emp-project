import Joi from 'joi';

class RoleValidation {
    createRole(body) {
        const schema = Joi.object().keys({
            is_default: Joi.boolean().default(false),
            rolesDetails: Joi.array()
                .items(
                    Joi.string()
                        .trim(true)
                        .regex(/^[a-zA-Z]/)
                )
                .unique()
                .messages({ 'array.unique': 'enter unique roles only.' }),
        });
        const result = schema.validate(body);
        return result;
    }
    fetchRole(body) {
        const schema = Joi.object().keys({
            skipValue: Joi.number().integer(),
            limitValue: Joi.number().integer(),
            orderby: Joi.string().valid('createdAt', 'updatedAt', '_id', 'roles', 'is_default,orgId'),
        });
        const result = schema.validate(body);
        return result;
    }
    updateRole(body) {
        const schema = Joi.object().keys({
            roleName: Joi.string()
                .trim(true)
                .regex(/^[a-zA-Z]/),
        });
        const result = schema.validate(body);
        return result;
    }
    roleFilter(body) {
        const schema = Joi.object().keys({
            roleName: Joi.string().allow(null),
            assignMember: Joi.array()
                .items(
                    Joi.object().keys({
                        id: Joi.string(),
                    })
                )
                .unique(),
            createdAt: Joi.object().keys({
                startDate: Joi.date().allow(null),
                endDate: Joi.date().allow(null),
            }),
            updatedAt: Joi.object().keys({
                startDate: Joi.date().allow(null),
                endDate: Joi.date().allow(null),
            }),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new RoleValidation();
