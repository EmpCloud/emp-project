import Joi from 'joi';

class PermissionValidation {
    createPermission(body) {
        const schema = Joi.object().keys({
            permissionName: Joi.string()
                .required()
                .min(4)
                .max(30)
                .trim(true),
                // .regex(/^[a-zA-Z]+$/)
                // .messages({ 'string.pattern.base': 'Permission Name must start with alphabet & have no special characters and numbers' }),
            permissionConfig: Joi.object()
                .keys({
                    project: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherProject: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    task: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherTask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    subtask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherSubtask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    user: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    roles: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    comments: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    upload: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    links: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    activity: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false).valid(false),
                            edit: Joi.boolean().required().default(false).valid(false),
                            delete: Joi.boolean().required().default(false).valid(false),
                        })
                        .required(),
                    
                })
                .required(),
        });
        const result = schema.validate(body);
        return result;
    }
    updatePermission(body) {
        const schema = Joi.object().keys({
            permissionName: Joi.string()
                .min(4)
                .max(30)
                .trim(true),
                // .regex(/^[a-zA-Z]+$/)
                // .messages({ 'string.pattern.base': 'Permission Name must start with alphabet & have no special characters and numbers' }),
            permissionConfig: Joi.object()
                .keys({
                    project: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherProject: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    task: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherTask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    subtask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    otherSubtask: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    user: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    roles: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    comments: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    upload: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    links: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false),
                            edit: Joi.boolean().required().default(false),
                            delete: Joi.boolean().required().default(false),
                        })
                        .required(),
                    activity: Joi.object()
                        .keys({
                            view: Joi.boolean().required().default(false),
                            create: Joi.boolean().required().default(false).valid(false),
                            edit: Joi.boolean().required().default(false).valid(false),
                            delete: Joi.boolean().required().default(false).valid(false),
                        })
                        .required(),
                })
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

    additionalPermission(body) {
        const schema = Joi.object()
            .keys({
                view: Joi.boolean().required().default(false),
                create: Joi.boolean().required().default(false),
                edit: Joi.boolean().required().default(false),
                delete: Joi.boolean().required().default(false),
            })
            .required();
        const result = schema.validate(body);
        return result;
    }
}
export default new PermissionValidation();
