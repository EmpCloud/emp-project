import mongoose from 'mongoose';
import ShortcutKeysValidation from './shortcutKeys.validate.js';
import { deleteManyByAdmin, deleteManyByUser, deleteOneByUser, deleteOneByAdmin } from '../../utils/project.utils.js';
import Response from '../../response/response.js';
import logger from '../../resources/logs/logger.log.js';
import { ObjectId } from 'mongodb';
import config from 'config';
import shortcutKeyModel from './shortcutKeys.model.js';

class ShortcutKeysService {
    /* ----------------Shortcut Keys APIs -------------------*/

    //Create
    async createShortcutKey(req, res) {
        const result = req.verified;
        logger.info({"result": result});
        if (result.state === true) {
            try {
                const keyData = req.body;
                const { value, error } = ShortcutKeysValidation.createShortcut(keyData);
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));

                //When collection is present in db , add document
                const isShortcutKeyPresent = await shortcutKeyModel.findOne({ keystroke: keyData?.keystroke });
                if (isShortcutKeyPresent) {
                    return res.status(400).send(Response.shortcutKeyDuplicateErrorResp('Shortcut Key already present.'));
                }

                //Show UserInfo, only when Key is not default
                if (!keyData.createdBy) {
                    keyData.createdBy = [];
                }
                const { isDefault } = keyData;
                if (isDefault === true) {
                    const resp = await shortcutKeyModel.create(keyData);
                    logger.info({"Response": resp});
                    return res.status(200).send(Response.shortcutKeySuccessResp('Default Shortcut Key created successfully.', resp));
                } else {
                    const { _id, userName, profilePic } = result?.userData?.userData;
                    const user = {
                        userId: _id,
                        userName: userName,
                        profilePic: profilePic,
                    };
                    keyData.createdBy.push(user);

                    const resp = await shortcutKeyModel.create(keyData);
                    logger.info({"Response": resp});
                    return res.status(200).send(Response.shortcutKeySuccessResp('Custom Shortcut Key created successfully.', keyData));
                }
            } catch (err) {
                logger.error({"error": err});
                return res.status(400).send(Response.shortcutKeyFailResp('Error while creating shortcut key.'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    //Read
    async readShortcutKeys(req, res) {
        const result = req.verified;
        logger.info({"result": result});
        if (result.state === true) {
            try {
                const shortcutKeyId = req.query.id;
                const skipValue = parseInt(req.query.skip) || config.get('skip');
                const limitValue = parseInt(req.query.limit) || config.get('limit');
                const keyType = req?.query?.sort;
                const isDefault = req?.query?.filter;

                //Get Key by Id
                let shortcutKey = null;
                if (shortcutKeyId) {
                    shortcutKey = await shortcutKeyModel.findOne({ _id: ObjectId(shortcutKeyId) });
                    logger.info({"Shortcut Keys":shortcutKey});
                    return shortcutKey ? res.status(200).send(Response.shortcutKeySuccessResp('Shortcut Key fetched ', shortcutKey)) : res.status(200).send(Response.shortcutKeyFailResp('Invalid Id'));
                }
                //Get Keys by shortCutType
                else if (keyType) {
                    shortcutKey = await shortcutKeyModel
                        .aggregate([{ $match: { shortCutType: keyType } }])
                        .skip(skipValue)
                        .limit(limitValue);
                        logger.info({"Shortcut Keys":shortcutKey});
                    return shortcutKey
                        ? res.status(200).send(Response.shortcutKeySuccessResp(`Shortcut Keys by shortCutType: ${keyType} fetched `, shortcutKey))
                        : res.status(200).send(Response.shortcutKeyFailResp('Invalid Id'));
                }
                //Get Keys which is default or not
                else if (isDefault) {
                    shortcutKey = await shortcutKeyModel
                        .aggregate([{ $match: { isDefault: Boolean(isDefault) } }])
                        .skip(skipValue)
                        .limit(limitValue)
                        logger.info({"Shortcut Keys":shortcutKey});
                    return shortcutKey
                        ? res.status(200).send(Response.shortcutKeySuccessResp(`Shortcut Keys by default: ${isDefault} fetched `, shortcutKey))
                        : res.status(200).send(Response.shortcutKeyFailResp('Invalid Id'));
                }
                //Get All Keys
                else {
                    shortcutKey = await shortcutKeyModel.find().skip(skipValue).limit(limitValue);
                    logger.info({"Shortcut Keys":shortcutKey});
                    return res.status(200).send(Response.shortcutKeySuccessResp('Shortcut Keys fetching successful', shortcutKey));
                }
            } catch (err) {
                logger.error({"error": err});
                return res.status(400).send(Response.shortcutKeyFailResp('Failed to fetch shortcut keys. Invalid Id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    //Update
    async updateShortcutKey(req, res) {
        const result = req.verified;
        logger.info({"result": result});
        if (result.state === true) {
            try {
                const shortcutKeyId = req.query.id;
                const keyData = req.body;
                const { value, error } = ShortcutKeysValidation.updateShortcut(keyData);
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));

                const sKey = await shortcutKeyModel.findById({ _id: ObjectId(shortcutKeyId) });
                if (!keyData.updatedBy) {
                    keyData.updatedBy = [];
                }
                if (sKey.isEditable === false) {
                    const { _id, userName, profilePic } = result?.userData?.userData;
                    const user = {
                        userId: _id,
                        userName: userName,
                        profilePic: profilePic,
                    };
                    keyData.updatedBy.push(user);
                    keyData.isDefault = false;

                    const shortcutKey = await shortcutKeyModel.findOneAndUpdate({ _id: ObjectId(shortcutKeyId) }, { $set: keyData }, { returnDocument: 'after' });
                    logger.info({"Shortcut Key": shortcutKey});
                    return res.status(200).send(Response.shortcutKeySuccessResp(`Updated Shortcut key with id: ${shortcutKey?._id}`, shortcutKey));
                } else {
                    return res.status(400).send(Response.shortcutKeyFailResp('Failed to update. Key is not Editable'));
                }
            } catch (err) {
                logger.error({"err":err});
                return res.status(400).send(Response.shortcutKeyFailResp('Failed to update Shortcut key. Invalid shortcutkey Id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    //Delete
    async deleteShortcutKey(req, res) {
        const result = req.verified;
        logger.info({"result": result});
        if (result.state === true) {
            try {
                const { _id, orgId } = result?.userData?.userData;
                const shortcutKeyId = req.query.id;
                //Delete single key
                let shortcutKey;
                if (shortcutKeyId) {
                    if (result.type === 'user') {
                        shortcutKey = await deleteOneByUser(shortcutKeyId, _id, shortcutKeyModel);
                        if (shortcutKey.deletedCount === 0) return res.send(Response.shortcutKeyFailResp(`You are not allowed to delete this record`));
                    } else {
                        shortcutKey = await deleteOneByAdmin(shortcutKeyId, shortcutKeyModel);
                    }

                    logger.info({"Shortcut Key": shortcutKey});
                    return res.status(200).send(Response.shortcutKeySuccessResp(`Deleted the shortcut key`, shortcutKey));
                }
                // Delete all keys
                else {
                    if (result.type === 'user') {
                        shortcutKey = await deleteManyByUser({}, _id, shortcutKeyModel);
                        if (shortcutKey.deletedCount === 0) return res.send(Response.shortcutKeyFailResp('No shortcut-key present to delete'));
                    } else {
                        shortcutKey = await deleteManyByAdmin({}, shortcutKeyModel);
                    }
                    logger.info({"Shortcut Key":shortcutKey});
                    return res.status(200).send(Response.shortcutKeySuccessResp(`Deleted All Shortcut Keys`, shortcutKey));
                }
            } catch (err) {
                logger.error({"err": err});
                return res.status(400).send(Response.shortcutKeyFailResp('Failed to delete Shortcut key. Invalid shortcutkey Id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }
}

export default new ShortcutKeysService();
