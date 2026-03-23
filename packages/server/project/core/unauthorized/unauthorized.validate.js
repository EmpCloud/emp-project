import Joi from 'joi';

class UserValidation {
    verifyUser(body) {
        const schema = Joi.object().keys({
            activationLink: Joi.string().required().trim(true),
            userMail: Joi.string().required().trim(true),
            orgId: Joi.string().required().trim(true),
            invitation: Joi.string().valid(0, 1, 2).required().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
    verifyUserCreds(body) {
        const schema = Joi.object().keys({
            userMail: Joi.string().required().trim(true),
            password: Joi.string().required().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
    forgotPasswordValidation(body) {
        const schema = Joi.object().keys({
            email: Joi.string().required().trim(true),
            orgId: Joi.string().required().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
    setPassword(body) {
        const schema = Joi.object().keys({
            mail: Joi.string().email().required().trim(true),
            password: Joi.string().required().trim(true),
            orgId: Joi.string().required().trim(true),
        });
        const result = schema.validate(body);
        return result;
    }
    resetPassword(body) {
        const schema = Joi.object().keys({
            email: Joi.string().required().trim(true),
            verifyToken: Joi.string().required().trim(true),
            newPassword: Joi.string().required().trim(true),
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
export default new UserValidation();
