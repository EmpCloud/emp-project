import Joi from 'joi';

class ShortcutKeysValidation {
    createShortcut(body) {
        const schema = Joi.object().keys({
            keystroke: Joi.string().required(true),
            isDefault: Joi.boolean().default(true),
            isEditable: Joi.boolean().default(false),
            feature: Joi.string().required(true),
            code: Joi.number().required(true),
            shortCutType: Joi.string().valid('global', 'page', 'subPage').default('global'),
            createdBy: Joi.string(),
            createdAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }

    updateShortcut(body) {
        const schema = Joi.object().keys({
            keystroke: Joi.string(),
            updatedBy: Joi.string(),
            createdAt: Joi.date(),
            updatedAt: Joi.date().default(new Date()),
        });
        const result = schema.validate(body);
        return result;
    }
}

export default new ShortcutKeysValidation();
