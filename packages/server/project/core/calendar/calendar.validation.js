import joi from 'joi';
import joi_date from '@joi/date';
const Joi = joi.extend(joi_date);

class CalendarValidation {
    createEvent(body) {
        const schema = Joi.object().keys({
            eventName: Joi.string()
                .min(4)
                .max(50)
                .required()
                .trim()
                .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                .messages({ 'string.pattern.base': 'Event Name must start with alphabet & have no special characters' }),
            description: Joi.string().min(10).max(100),
            startTime: Joi.date().greater('now').required(),
            endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
            attendees: Joi.array()
                .items({
                    id: Joi.string().trim(true),
                })
                .unique('id'),
            eventStatus: Joi.string().valid('queue', 'done', 'cancelled', 'postponed', 'rescheduled').default('queue'),
            invitedUsers: Joi.number().default(0),
            attendedUsers: Joi.number().default(0),
            isRescheduled: Joi.boolean().default(false),
            isCanceled: Joi.boolean().default(false),
            isPostponed: Joi.boolean().default(false),
            reminder: Joi.boolean().default(false),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updateEvent(body) {
        const schema = Joi.object().keys({
            eventName: Joi.string()
                .min(4)
                .max(50)
                .trim()
                .regex(/^[a-zA-Z][a-zA-Z0-9 ]+$/)
                .messages({ 'string.pattern.base': 'Event Name must start with alphabet & have no special characters' }),
            description: Joi.string().min(10).max(100),
            startTime: Joi.date().greater('now'),
            endTime: Joi.date()
                .iso()
                .when('startTime', {
                    is: Joi.exist(),
                    then: Joi.date().iso().min(Joi.ref('startTime')),
                    otherwise: Joi.date().greater('now'),
                }),
            attendees: Joi.array()
                .items({
                    id: Joi.string().trim(true),
                })
                .unique('id'),
            eventStatus: Joi.string().valid('queue', 'done', 'cancelled', 'postponed', 'rescheduled'),
            invitedUsers: Joi.number(),
            attendedUsers: Joi.number(),
            isRescheduled: Joi.boolean(),
            isCanceled: Joi.boolean(),
            isPostponed: Joi.boolean(),
            reminder: Joi.boolean(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    filterEvents(body) {
        const schema = Joi.object().keys({
            creatorId: Joi.string(),
            eventName: Joi.string().min(4).max(50).trim(),
            description: Joi.string().min(10).max(100),
            startTime: Joi.object().keys({
                startDate: Joi.string(),
                endDate: Joi.string(),
            }),
            endTime: Joi.object().keys({
                startDate: Joi.string(),
                endDate: Joi.string(),
            }),
            attendees: Joi.array()
                .items({
                    id: Joi.string().trim(true),
                })
                .unique('id'),
            eventStatus: Joi.string().valid('queue', 'done', 'cancelled', 'postponed', 'rescheduled'),
            invitedUsers: Joi.number(),
            attendedUsers: Joi.number(),
            isRescheduled: Joi.boolean(),
            isCanceled: Joi.boolean(),
            isPostponed: Joi.boolean(),
            reminder: Joi.boolean(),
        });
        const result = schema.validate(body);
        return result;
    }
}

export default new CalendarValidation();
