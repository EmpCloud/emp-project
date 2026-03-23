import Joi from 'joi';
import moment from 'moment';
let validValues=[null," "]
class ConfigValidation {
    createAdmin(body) {
        const schema = Joi.object()
            .keys({
                firstName: Joi.string().trim(true).min(1).required(),
                lastName: Joi.string().trim(true).min(1),
                userName: Joi.string().trim(true).min(3).max(20).required(),
                profilePic: Joi.string().trim(true).allow(null),
                password: Joi.string().trim(true).required(),
                isEmpMonitorUser:Joi.boolean(),
                empMonitorId:Joi.string(),
                countryCode: Joi.string()
                    .max(10)
                    .regex(/^\+[0-9]*$/)
                    .trim(true)
                    .allow(null)
                    .messages({ 'string.pattern.base': 'Country Code must start with + and contain only number' }),
                phoneNumber: Joi.number().integer().min(0).max(10 ** 10 - 1).required().messages({
                    'number.min': 'Mobile number should be 10 digit.',
                    'number.max': 'Mobile number should be 10 digit'
                }),
                email: Joi.string().email().required(),
                planName:Joi.string().default('Free'),
                orgId: Joi.string()
                    .max(12)
                    .min(4)
                    .required(),
                orgName: Joi.string()
                    .trim(true)
                    .required(),
                address: Joi.string().trim(true).min(4).max(1000).required(),
                isOverwrite: Joi.boolean().default(false),
                city: Joi.string()
                    .trim(true)
                    .allow(null),
                state: Joi.string()
                    .trim(true).allow(null),
                country: Joi.string()
                    .trim(true)
                    .required(),
                zipCode: Joi.string()
                    .trim(true)
                    .min(4)
                    .max(6)
                    .allow(null,'')
                    .regex(/^[0-9]*$/)
                    .messages({ 'string.pattern.base': 'zip code can contain only number' }),
                forgotTokenExpire: Joi.date().default(moment().add(1, 'day')?._d),
                emailTokenExpire: Joi.date().default(moment().add(1, 'day')?._d),
                createdAt: Joi.date().default(moment()._d),
                updatedAt: Joi.date().default(moment()._d),
                planStartDate:Joi.string(),
                planExpireDate:Joi.string()
            })
            .required();
        const result = schema.validate(body);
        return result;
    }
  
    updateAdmin(body) {
        const schema = Joi.object()
            .keys({
                firstName: Joi.string()
                    .trim(true)
                    .min(1),
                lastName: Joi.string()
                    .trim(true)
                    .min(1),
                profilePic: Joi.string().trim(true).allow(null),
                countryCode: Joi.string()
                    .trim(true)
                    .allow(null)
                    .regex(/^\+[0-9]*$/)
                    .trim(true)
                    .messages({ 'string.pattern.base': 'Country Code must start with + and contain only number' }),
                phoneNumber: Joi.alternatives([
                    Joi.number(),
                    Joi.string().valid(...validValues)
                ]),
                address: Joi.string().allow(null,""),
                isOverwrite: Joi.boolean(),
                city: Joi.string()
                    .trim(true)
                    .allow(null),
                state: Joi.string()
                    .trim(true)
                    .allow(null),
                country: Joi.string()
                    .trim(true)
                    .required(),
                planData: Joi.object().keys({
                    userFeatureCount: Joi.number()
                }),
                zipCode: Joi.string()
                    .trim(true)
                    .allow(null)
                    .min(4)
                    .max(6)
                    .regex(/^[0-9]*$/)
                    .messages({ 'string.pattern.base': 'zip code can contain only number' }),
            })
            .required();
        const result = schema.validate(body);
        return result;
    }

    fetchAdmin(body) {
        const schema = Joi.object({
            email: Joi.alternatives()
                .try(
                    Joi.string().email(),
                    Joi.string()
                )
                .required(),
            password: Joi.string(),
            actualPassword: Joi.string(),
        }).required();
    
        const result = schema.validate(body);
        return result;
    }
    verifyAdmin(body) {
        const schema = Joi.object().keys({
            activationLink: Joi.string().required().trim(true),
            adminMail: Joi.string().email().required().trim(true),
            orgId: Joi.string().required().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
    updatePassword(body) {
        const schema = Joi.object()
            .keys({
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().min(6).max(25).required(),
            })
            .required();
        const result = schema.validate(body);
        return result;
    }
}
export default new ConfigValidation();
