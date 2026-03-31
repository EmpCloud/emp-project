import joi from 'joi';
import joi_date from '@joi/date';
const Joi = joi.extend(joi_date);

class ProjectValidation {
    createProject(body) {
        const schema = Joi.array().items({
            SuperUserId: Joi.string(),
            adminProfilePic: Joi.string().trim(true),
            adminName: Joi.string().trim(true),
            projectLogo: Joi.string()
                .trim(true)
                .default('project.jpeg')
                .regex(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)
                .messages({ 'string.pattern.base': 'Profile Logo should start with alphabet. No white spaces & must follwed by dot with one of these extensions jpg, jpeg, png, gif, bmp.' }),
            projectName: Joi.string()
                .min(4)
                .max(100)
                .required()
                .trim(),
                // .regex(/^[a-zA-Z0-9\s]+$/)
                //.messages({ 'string.pattern.base': 'Project Name must start with alphabet & have no special characters' }),
            projectCode: Joi.string()
                .min(3)
                .max(20)
                .required()
                .trim(true),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 -]+$/)
                // .messages({ 'string.pattern.base': 'Project Code must start with alphabet & have no special characters' }),
                description: Joi.string().allow(null)
                .min(0),
                //.regex(/^[0-9a-zA-Z,.\n\s]+$/)
                //.messages({ 'string.pattern.base': 'description must start with alphabet & have no special characters' }),
                startDate: Joi.date()
                .default(new Date())
                .label('Start Date'),

              endDate: Joi.date().format('YYYY-MM-DD'),

              estimationDate: Joi.date()
                .label('Estimation Date'),
            plannedBudget: Joi.number(),
            actualBudget: Joi.number(),
            clientCompany : Joi.array().items({
                id:Joi.string().trim(true).allow(null, ''),
                key:Joi.string().trim(true).allow(null, '')
            }),
            userAssigned: Joi.array()
                .items({
                    id: Joi.string().trim(true).required(),
                    role: Joi.string().trim(true),
                })
                .unique('id').messages({ 'array.unique': 'duplicate members cant be assign' }),
            group: Joi.array()
                .items({
                    groupId: Joi.string().trim(true).required(),
                })
                .unique('groupId'),
            currencyType: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'KRW','NGN').default('INR'),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            status: Joi.string().valid('Todo', 'Inprogress', 'Pending', 'Review', 'Done').default('Todo'),
            progress: Joi.number(),
            softDeleted: Joi.boolean(),
            checkBox: Joi.array().items(Joi.string().trim(true)),
            url: Joi.array().items(Joi.string().trim(true).messages({ 'string.pattern.base': 'url must start with http and https' })),
            labels: Joi.array().items(Joi.string().trim(true)),
            priority: Joi.string().valid('High', 'Medium', 'Low'),
            stringInput_64: Joi.string().trim(true).max(64),
            stringInput_256: Joi.string().trim(true).max(256),
            stringInput_1000: Joi.string().trim(true).max(1000),
            date_dd_mm_yyyy: Joi.date().format('DD-MM-YYYY'),
            date_mm_dd_yyyy: Joi.date().format('MM-DD-YYYY'),
            date_dd_mon_yyyy: Joi.date().format('DD-MON-YY'),
            date_yy_mon_dd: Joi.date().format('YY_MON_DD'),
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

    updateProject(body) {
        const schema = Joi.object().keys({
            projectLogo: Joi.string()
                .trim(true)
                .default('project.jpeg')
                .regex(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)
                .messages({ 'string.pattern.base': 'Profile Logo should start with alphabet. No white spaces & must followed by dot with one of these extensions jpg, jpeg, png, gif, bmp.' }),
            projectName: Joi.string()
                .min(4)
                .max(100)
                .trim(),
               // .regex(/^[a-zA-Z0-9\s]+$/)
               // .messages({ 'string.pattern.base': 'Project Name must start with alphabet & have no special characters' }),
            projectCode: Joi.string()
                .min(3)
                .max(20)
                .trim(true),
                // .regex(/^[a-zA-Z][a-zA-Z0-9 -]+$/)
                // .messages({ 'string.pattern.base': 'Project Code must start with alphabet & have no special characters' }),
                description: Joi.string().allow(null)
                .min(0),
                //.regex(/^[0-9a-zA-Z,.\n\s]+$/)
                //.messages({ 'string.pattern.base': 'description must start with alphabet & have no special characters' }),
                startDate: Joi.date()
                .min(new Date().toISOString().split('T')[0])
                .default(new Date())
                .label('Start Date'),
            
              endDate: Joi.date().format('YYYY-MM-DD'),
            
              estimationDate: Joi.date()
                .greater(
                  Joi.ref('startDate', {
                    adjust: (startDate) =>
                      new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                  })
                )
                .label('Estimation Date')
                .messages({
                  'date.greater': '"Estimation Date" must be at least 7 days after "Start Date"'
                }),
            reason: Joi.string().allow('', null),
            completedDate:Joi.date().allow('', null),
            clientCompany : Joi.array().items({
                id:Joi.string().trim(true).allow(null, ''),
                key:Joi.string().trim(true).allow(null, '')
            }),
            plannedBudget: Joi.number(),
            actualBudget: Joi.number(),
            //actualHours: Joi.string().pattern(/^([0-9]+):([0-5][0-9]|59)$/),
            userAssigned: Joi.array()
                .items({
                    id: Joi.string().trim(true),
                    role: Joi.string().trim(true),
                })
                .unique('id').messages({ 'array.unique': 'duplicate members cant be assign' }),
            // group: Joi.array()
            //     .items({
            //         groupId: Joi.string().trim(true).required(),
            //     })
            //     .unique('groupId'),
            currencyType: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'KRW','NGN'),
            updatedAt: Joi.date(),
            startDate: Joi.date(),
            status: Joi.string().valid('Todo', 'Inprogress', 'Pending', 'Review', 'Done'),
            progress: Joi.number(),
            softDeleted: Joi.boolean(),
            deletedAt: Joi.date(),
            deletedBy: Joi.string().trim(),
        });
        const result = schema.validate(body);
        return result;
    }

    updateCommentValidate(body) {
        const schema = Joi.object().keys({
            comment: Joi.string().min(1).max(500).required(),
            userNameInput:Joi.array().items(
                Joi.string().trim(true)
            ),
            updatedAt: Joi.date().default(new Date),
            is_Edited: Joi.string().default(true),
        });
        const result = schema.validate(body);
        return result;
    }
    addComment(body) {
        const schema = Joi.object().keys({
            comment: Joi.string().min(1).max(500).required(),
            userName: Joi.array().items(
                Joi.string().trim(true)
            ),
            createdAt: Joi.date(),
        });
        const result = schema.validate(body);
        return result;
    }
    filterValidation(body) {
        const schema = Joi.object().keys({
            projectName: Joi.string(),
            projectCode: Joi.string(),
            clientCompany:Joi.string(),
            currencyType: Joi.string().valid('INR', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'KRW','NGN'),
            status: Joi.string().valid('Todo', 'Inprogress', 'Pending', 'Review', 'Done').default('Todo'),
            user: Joi.array().items({
                id: Joi.string().trim(true).required(),
            }),
            sponsor: Joi.array().items({
                id: Joi.string().trim(true).required(),
            }),
            manager: Joi.array().items({
                id: Joi.string().trim(true).required(),
            }),
            owner: Joi.array().items({
                id: Joi.string().trim(true).required(),
            }),
            plannedBudget: Joi.object().keys({
                min: Joi.number().min(0).integer(),
                max: Joi.number().min(0).integer(),
            }),
            actualBudget: Joi.object().keys({
                min: Joi.number().min(0).integer(),
                max: Joi.number().min(0).integer(),
            }),
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
    fetchProjectActivity(body) {
        const schema = Joi.object().keys({
            skipValue: Joi.number().integer(),
            limitValue: Joi.number().integer(),
            orderby: Joi.string(),
        });
        const result = schema.validate(body);
        return result;
    }
    activityFilterValidation(body) {
        const schema = Joi.object()
            .keys({
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
            })
            .required();
        const result = schema.validate(body);
        return result;
    }
    allActivityFilterValidation(body) {
        const schema = Joi.object().keys({
            firstName: Joi.string(),
            userId: Joi.string(),
            category: Joi.string(),
            date: Joi.object().keys({
                startDate: Joi.date(),
                endDate: Joi.date(),
            }),
        });
        const result = schema.validate(body);
        return result;
    }
    createExtraFields(body, type, min, max, format) {
        switch (type) {
            case 'string':
                const stringValue = Joi.object().pattern(/^/, Joi.string().min(min).max(max));
                const result = stringValue.validate(body, type, min, max);
                return result;
                break;
            case 'number':
                const numberValue = Joi.object().pattern(/^/, Joi.number().integer().min(min).max(max));
                const results = numberValue.validate(body, type, min, max);
                return results;
                break;
            case 'date':
                const dateValue = Joi.object().pattern(/^/, Joi.date().iso().format(format));
                const resultValue = dateValue.validate(body, type);
                return resultValue;
                break;
            case 'boolean':
                const booleanValue = Joi.object().pattern(/^/, Joi.boolean());
                const resultValues = dateTypes.validate(body, type);
                return resultValue;
                break;
        }
    }
    deleteMultiple(body) {
        const schema = Joi.object().keys({
            ProjectId: Joi.array()
                .items({
                    id: Joi.string().trim(true),
                })
                .unique('id'),
        });
        const result = schema.validate(body);
        return result;
    }
}

export default new ProjectValidation();
