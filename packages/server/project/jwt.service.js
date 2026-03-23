import jwt from 'jsonwebtoken';
import crypto from "crypto";

class JwtAuth {
    constructor() {
        this.accessTokenSecret = "eef210e9a7cc26ff1790fb771e2cbeb84e2d0db4d851ace6e2a05d47c664f90a0181429a4f3ab76025637da9a143021b72f1fead6c6c8adfa83cfeae900f26a2";
        this.tokenLife = '10h';
    }

    async verify(token) {
        return new Promise((resolve, reject) => {
            const decryptedToken = this.decrypt(token, "d%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q1h");

            if (decryptedToken.error) {
                return reject(decryptedToken.error);
            }
            token = decryptedToken.decoded;

            jwt.verify(token, this.accessTokenSecret, (err, decoded) => {
                if (err) reject(err);
                else {
                    if (decoded.signature) {
                        const decryptedSignature = this.decrypt(decoded.signature, "d%_eQHBl]{E(/TYe>/h#tKe.#_Ah^Q1h");
                        if (decryptedSignature.error) {
                            return reject(decryptedSignature.error);
                        }
                        resolve(decryptedSignature.decoded);
                    } else {
                        reject({ name: 'AuthorizationError', message: `Invalid Token` });
                    }
                }
            });
        })
    }
    decrypt(text, key) {
        try {
            let textParts = text.split(':')
            let iv = Buffer.from(textParts.shift(), 'hex')
            let encryptedText = Buffer.from(textParts.join(':'), 'hex')
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
            let decrypted = decipher.update(encryptedText)

            decrypted = Buffer.concat([decrypted, decipher.final()])

            return { error: null, decoded: decrypted.toString() }
        } catch (err) {
            return { error: err, decoded: null }
        }
    }
}

export default new JwtAuth();