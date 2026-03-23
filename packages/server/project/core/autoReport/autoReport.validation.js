import Joi from 'joi';

class ReportValidation {
    sendreport(body) {
        const schema = Joi.object({
            reportsTitle: Joi.string().required(),
            frequency: Joi.array().items(Joi.object({
                Daily: Joi.number(),
                Weekly: Joi.number(),
                Monthly: Joi.number(),
                Time: Joi.string(),
                Date: Joi.object({
                    startDate: Joi.date(),
                    endDate: Joi.date()
                })
            })),
            Recipients: Joi.array().items(Joi.string()),
            Content: Joi.array().items(Joi.object({
                task: Joi.number(),
                project: Joi.number(),
                subTask: Joi.number(),
                progress: Joi.number(),
                group: Joi.number(),
                role: Joi.number()
            })),
            ReportsType: Joi.array().items(Joi.object({
                pdf: Joi.number(),
                csv: Joi.number()
            })),
            filter: Joi.object({
                wholeOrganization: Joi.number(),
                specificEmployees: Joi.array().items(Joi.object({
                    id: Joi.string()
                })),
                specificGroups: Joi.array().items(Joi.object({
                    groupId: Joi.string()
                })),
                specificRoles: Joi.array().items(Joi.object({
                    roleId: Joi.string()
                }))
            }),
            sendTestMail: Joi.boolean()
        });

        const result = schema.validate(body);
        return result;
    }
    updateReport(body){
        const schema = Joi.object({
            reportsTitle: Joi.string().required(),
            frequency: Joi.array().items(Joi.object({
                Daily: Joi.number(),
                Weekly: Joi.number(),
                Monthly: Joi.number(),
                Time: Joi.string(),
                Date: Joi.object({
                    startDate: Joi.date(),
                    endDate: Joi.date()
                })
            })),
            Recipients: Joi.array().items(Joi.string()),
            Content: Joi.array().items(Joi.object({
                task: Joi.number(),
                project: Joi.number(),
                subTask: Joi.number(),
                progress: Joi.number(),
                group: Joi.number(),
                role: Joi.number()
            })),
            ReportsType: Joi.array().items(Joi.object({
                pdf: Joi.number(),
                csv: Joi.number()
            })),
            filter: Joi.object({
                wholeOrganization: Joi.number(),
                specificEmployees: Joi.array().items(Joi.object({
                    id: Joi.string()
                })),
                specificGroups: Joi.array().items(Joi.object({
                    groupId: Joi.string()
                })),
                specificRoles: Joi.array().items(Joi.object({
                    roleId: Joi.string()
                }))
            }),
            sendTestMail: Joi.boolean()
        });

        const result = schema.validate(body);
        return result;
    }
}

export default new ReportValidation();