import Response from '../../response/response.js';
import adminSchema from '../admin/admin.model.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import config from 'config';
import { languages, languagesMapper } from './language.constants.js';
import { AdminConfigNew } from './language.translator.js';
import SockClient from '../../project.server.js';

class LanguageService {
    async updateLanguage(req, res, next) {
        const result = req.verified;
        const adminId = result?.userData?.userData?._id;
        const langResponse = result?.userData?.userData?.language;
        try {
            const data = req.query.language;
            const value = languagesMapper['Language_Response'][data];
            const language = languages.filter(e => value.includes(e));
            const updateData = language[0];
            if (!language.length) {
                return res.status(400).send(Response.languageFailResp('Please select valid language.'));
            }
            const updateLang = await adminSchema.findOneAndUpdate({ _id: ObjectId(adminId) }, { $set: { language: updateData } }, { returnDocument: 'after' });
            let userData = await adminSchema.findOne({ email: result?.userData?.userData?.email });
            let accessToken = jwt.sign({ userData }, config.get('token_secret'), { expiresIn: '24h' });
            let langResponse = updateLang.language;
            // Notification to Admin
            const message = `${result?.userData?.userData?.userName} updated the language to ${langResponse}-${data}`;
            await SockClient.notification(message, adminId);
            res.send(Response.languageSuccessResp(AdminConfigNew['LANGUAGE_UPDATE'][langResponse ?? 'en'], { updateLang, accessToken }));
        } catch (err) {
            return res.send(Response.languageFailResp(AdminConfigNew['LANGUAGE_UPDATE_FAIL'][langResponse ?? 'en'], err.message));
        }
    }
}

export default new LanguageService();
