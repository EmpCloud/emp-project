import Joi from 'joi';
class ActivityValidation {
    activityFilterValidation(body) {
        const schema = Joi.object().keys({
            firstName: Joi.string().allow(null),
            activityUserId: Joi.string().allow(null),
            userId: Joi.string().allow(null),
            projectId: Joi.string().allow(null),
            taskId: Joi.string().allow(null),
            subTaskId: Joi.string().allow(null),
            configId: Joi.string().allow(null),
            roleId: Joi.string().allow(null),
            adminId: Joi.string().allow(null),
            groupId: Joi.string().allow(null),
            permissionId: Joi.string().allow(null),
            planId: Joi.string().allow(null),
            taskTypeId: Joi.string().allow(null),
            taskStatusId: Joi.string().allow(null),
            taskStageId: Joi.string().allow(null),
            taskCategoryId: Joi.string().allow(null),
            subTaskTypeId: Joi.string().allow(null),
            subTaskStatusId: Joi.string().allow(null),
            activityType: Joi.string().allow(null),
            category: Joi.string().allow(null),
            date: Joi.object().keys({
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
    activityFetch(body) {
        const schema = Joi.object().keys({
            ActivityType: Joi.string().when('ActivityTypeId', {
                is: Joi.exist(),
                then: Joi.required(),
            }).messages({ 'any.required': 'ActivityType is required when ActivityTypeId is provided' }),
            ActivityTypeId: Joi.string(),
            category: Joi.string(),
            orderBy: Joi.string(),
            sort: Joi.string(),
            skip: Joi.number().integer(),
            limit: Joi.number().integer()
        });

        const result = schema.validate(body);
        return result;

    }
}
export default new ActivityValidation();
