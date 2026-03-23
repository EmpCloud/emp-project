import Joi from 'joi';
import { languages } from './language.constants.js';
class LanguageValidate {
    updateValidate(body) {
        const schema = Joi.object().keys({
            language: Joi.string().valid(languages),
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new LanguageValidate();
