import Joi from 'joi';

class PlanValidation {
    createPlan(body) {
        const schema = Joi.array().items({
            planName: Joi.string(),
            planPrice: Joi.number().required(),
            isPlanActive: Joi.boolean().required(),
            projectFeatureCount: Joi.number(),
            taskFeatureCount: Joi.number(),
            userFeatureCount: Joi.number(),
            subTaskFeatureCount: Joi.number(),
            customizeRoles: Joi.number(),
            customizePermission: Joi.number(),
            customizeTaskType: Joi.number(),
            customizeTaskStatus: Joi.number(),
            customizeSubTaskType: Joi.number(),
            customizeSubTaskStatus: Joi.number(),
            currencyType: Joi.string(),
            currencyLogo: Joi.string(),
            expireDate: Joi.date(),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        });
        const result = schema.validate(body);
        return result;
    }
    assignPlanValidate(body) {
        const schema = Joi.object().keys({
            planName: Joi.string(),
            planStartedDate: Joi.date(),
            expireDate: Joi.date(),
        });
        const result = schema.validate(body);
        return result;
    }

    updatePlan(body) {
        const schema = Joi.object().keys({
            planName: Joi.string(),
            planPrice: Joi.number().required(),
            isPlanActive: Joi.boolean().required(),
            projectFeatureCount: Joi.number(),
            taskFeatureCount: Joi.number(),
            userFeatureCount: Joi.number(),
            subTaskFeatureCount: Joi.number(),
            customizeRoles: Joi.number(),
            customizePermission: Joi.number(),
            customizeTaskType: Joi.number(),
            customizeTaskStatus: Joi.number(),
            customizeSubTaskType: Joi.number(),
            customizeSubTaskStatus: Joi.number(),
            expireDate: Joi.date(),
            updatedAt: Joi.date(),
        });
        const result = schema.validate(body);
        return result;
    }
    fetchPlanHistory(body) {
        const schema = Joi.object().keys({
            skipValue: Joi.number().integer(),
            limitValue: Joi.number().integer(),
            orderby: Joi.string(),
        });
        const result = schema.validate(body);
        return result;
    }
    filterValidation(body) {
        const schema = Joi.object().keys({
            firstName: Joi.string(),
            userId: Joi.string(),
            category: Joi.string(),
            createdAt: Joi.object().keys({
                startDate: Joi.date(),
                endDate: Joi.date(),
            }),
            updatedAt: Joi.object().keys({
                startDate: Joi.date(),
                endDate: Joi.date(),
            }),
        }).required();
        const result = schema.validate(body);
        return result;
    }
}
export default new PlanValidation();
