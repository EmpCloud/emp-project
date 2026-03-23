import Joi from 'joi';

class GroupValidation {
    createGroup(body) {
        const schema = Joi.array().items({
            groupName: Joi.string()
                .min(2)
                .max(50)
                .required(),
            groupDescription: Joi.string()
            .required()
            .max(5000),
            groupLogo: Joi.string().trim(true).allow(null),
            assignedMembers: Joi.array()
                .items({
                    userId: Joi.string().trim(true).hex().length(24).messages({ 'string.length': 'Please select valid userId' }),
                })
                .unique('userId')
                .required(),
        });
        const result = schema.validate(body);
        return result;
    }

    updateGroup(body) {
        const schema = Joi.object().keys({
            groupName: Joi.string()
                .min(3)
                .max(50),
            groupDescription: Joi.string()
            .max(5000),            
            groupLogo: Joi.string().trim(true).allow(null),
            assignedMembers: Joi.array()
                .items({
                    userId: Joi.string().trim(true).hex().length(24).messages({ 'string.length': 'Please select valid userId' }),
                })
                .unique('userId'),
        });
        const result = schema.validate(body);
        return result;
    }
    groupFilterValidation(body) {
        const schema = Joi.object().keys({
            userId: Joi.array().items({
                id: Joi.string().allow(null),
            }),
            groupName: Joi.string().allow(null),
            createdAt: Joi.object().keys({
                startDate: Joi.alternatives([
                    Joi.date(),
                    Joi.string().allow(null)
                  ]),
                endDate: Joi.alternatives([
                    Joi.date(),
                    Joi.string().allow(null)
                  ]),
            }),
            updatedAt: Joi.object().keys({
                startDate: Joi.alternatives([
                    Joi.date(),
                    Joi.string().allow(null)
                  ]),
                endDate: Joi.alternatives([
                    Joi.date(),
                    Joi.string().allow(null)
                  ]),
            }),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new GroupValidation();
