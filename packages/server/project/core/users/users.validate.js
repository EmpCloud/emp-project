import joi from 'joi';
import joi_date from '@joi/date';
const Joi = joi.extend(joi_date);
import uuidv1 from 'uuidv1';
import moment from 'moment';

class UserValidation {
    createUser(body) {
        const schema = Joi.object().keys({
            emp_id: Joi.number(),
            orgId: Joi.string().trim(true),
            firstName: Joi.string()
                .required()
                .trim(true)
                .min(1),
            lastName: Joi.string()
                .trim(true)
                .min(1),
            password: Joi.string().trim(true),
            userName: Joi.string(),
            email: Joi.string().trim(true).email().required(),
            role: Joi.string()
                .trim(true)
                .default('Member'),
            permission: Joi.string()
                .trim(true)
                .default('read'),
            profilePic: Joi.string().trim(true).default(null),
            empMonitorId: Joi.string().trim(true),
            verified: Joi.boolean().default(false),
            emailValidateToken: Joi.string().trim(true),
            emailTokenExpire: Joi.date().default(moment().add(1, 'day')?._d),
            verificationEmailSentCount: Joi.number().default(0),
            softDeleted: Joi.boolean().default(false),
            forgotPasswordToken: Joi.string().trim(true).default(uuidv1()),      
            forgotTokenExpire: Joi.date().default(moment().add(1, 'day')?._d),
            passwordEmailSentCount: Joi.number().default(0),
            deletedAt: Joi.date(),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            checkBox: Joi.array().items(Joi.string().trim(true)),
            url: Joi.array().items(Joi.string().trim(true).messages({ 'string.pattern.base': 'url must start with http and https' })),
            labels: Joi.array().items(Joi.string().trim(true)),
            priority: Joi.string().valid('High', 'Medium', 'Low'),
            input_64: Joi.string().trim(true).max(64),
            input_256: Joi.string().trim(true).max(256),
            input_1000: Joi.string().trim(true).max(1000),
            date_dd_mm_yyyy: Joi.date().format('DD-MM-YYYY'),
            date_mm_dd_yyyy: Joi.date().format('MM-DD-YYYY'),
            date_dd_mon_yyyy: Joi.date().format('DD-Mon-YY'),
            date_yy_mom_dd: Joi.date().format('YY_Mon_DD'),
            dateTime_ddmmyyyy_hhmmss: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_mmddyyyy_hhmmss: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_ddmonyyyy_hhmmss: Joi.string().regex(/^(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_yymondd_hhmmss: Joi.string().regex(/^(\d{4})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/),
            dateTime_ddmmyyyy_hhmm: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/),
            dateTime_mmddyyyy_hhmm: Joi.string().regex(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/),
            dateTime_yymondd_hhmm: Joi.string().regex(/^(\d{4})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2})$/),
            dateTime_ddmonyyyy_hhmm: Joi.string().regex(/^(\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4}) (\d{2}):(\d{2})$/),
            numberInput1: Joi.number().integer().max(6),
            numberInput2: Joi.number().integer().max(10),
        });
        const result = schema.validate(body);
        return result;
    }
    validateEmails(body){
        const schema = Joi.object({
            email: Joi.string().email().required()
          });
          const result = schema.validate(body);
          return result;
    }
    updateUser(body) {
        const schema = Joi.object().keys({
            orgId: Joi.string().trim(true),
            firstName: Joi.string()
                .min(1)
                .trim(true),
            lastName: Joi.string()
                .min(1)
                .trim(true),
            role: Joi.string()
                .trim(true),
            permission: Joi.string()
                .trim(true),
            profilePic: Joi.string().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
   
    fetchActivityLogs(body) {
        const schema = Joi.object().keys({
            skipValue: Joi.number().integer(),
            limitValue: Joi.number().integer(),
            orderby: Joi.string(),
        });
        const result = schema.validate(body);
        return result;
    }
    userFilter(body) {
        const schema = Joi.object().keys({
            firstName: Joi.string().allow('',null),
            lastName: Joi.string().allow('',null),
            email: Joi.string().allow('',null),
            projectCount: Joi.object().keys({
                min: Joi.number().min(0).integer(),
                max: Joi.number().min(0).integer(),
            }),
            taskCount: Joi.object().keys({
                min: Joi.number().min(0).integer(),
                max: Joi.number().min(0).integer(),
            }),
            role: Joi.string().allow('',null),
            empmonitor: Joi.string().valid('0','1','2').allow('',null),
            createdAt: Joi.object().keys({
                startDate: Joi.date(),
                endDate: Joi.date(),
            }),
            updatedAt: Joi.object().keys({
                startDate: Joi.date(),
                endDate: Joi.date(),
            }),
        });
        const result = schema.validate(body);
        return result;
    }
    validateUserState(body) {
        const JoiSchema = Joi.object({
            isSuspended: Joi.boolean().required(),
        });
        return JoiSchema.validate(body);
    }

    updateProfile(body) {
        const JoiSchema = Joi.object({
            firstName: Joi.string()
                .min(1)
                .trim(true),
            lastName: Joi.string()
                .min(1)
                .trim(true),
            profilePic:Joi.string().trim(true).allow(null,''),
            countryCode: Joi.string()
                .trim(true)
                .regex(/^\+[0-9]*$/)
                .trim(true)
                .messages({ 'string.pattern.base': 'Country Code must start with + and contain only number' }),
            phoneNumber: Joi.string()
                .trim(true)
                .min(10)
                .max(10)
                .regex(/^[0-9]*$/)
                .messages({ 'string.pattern.base': 'phone no. can contain only number' }),
            address: Joi.string().allow(null,'').trim(true).min(4).max(100),
            city: Joi.string()
                .trim(true).allow(null, ''),
            state: Joi.string()
                .trim(true).allow(null, ''),
            country: Joi.string()
                .trim(true).allow(null,''),
            zipCode: Joi.string()
                .allow(null,'')
                .trim(true)
                .min(4)
                .max(6)
                .regex(/^[0-9]*$/)
                .messages({ 'string.pattern.base': 'zip code can contain only number' }),
        })
            .required();

        return JoiSchema.validate(body);
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
export default new UserValidation();
