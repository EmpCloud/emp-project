import Response from '../../response/response.js';
import config from 'config';
import Password from '../../utils/passwordEncoderDecoder.js';
import logger from '../../resources/logs/logger.log.js';

class PassWordService {
    async getPassword(req, res) {

        if (req?.query?.secretKey === config.get('secretKey')) {
            try {
                let encrypted = req.query.encryptedPassWord;
                let decryptPassword = await Password.decryptText(encrypted, config.get('encryptionKey'));
                return res.status(200).send({ password: decryptPassword });
            } catch (error) {
                logger.error(`error in catch ${error}`);
                res.status(400).send(Response.projectFailResp('Error while fetching password'));
            }
        } else {
            res.status(400).send(Response.projectFailResp('Not Authorized'));
        }
    }
}

export default new PassWordService();
