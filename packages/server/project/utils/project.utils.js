import { connection } from '../resources/database/mongo.connect.js';
import config from 'config';
import defaultScreen from '../core/defaultScreenConfig/defaultScreenConfig.model.js';
import logger from '../resources/logs/logger.log.js';
import { ObjectId } from 'mongodb';
import adminSchema from '../core/admin/admin.model.js'
import permissionModel from '../core/permissions/permission.model.js';

async function checkCollection(ORG) {
    const dbName = config.get('mongo.db_name');
    const db = await connection.client.db(dbName);
    const collInfo = await db.listCollections({ name: ORG }).toArray();
    if (collInfo.length === 0) {
        return null;
    }
    return db;
}

async function fetchAllCollection() {
    const dbName = config.get('mongo.db_name');
    const db = await connection.client.db(dbName);
    const collInfo = await db.listCollections().toArray();
    if (collInfo.length === 0) {
        return null;
    }
    return collInfo;
}

async function setDefaultScreen(userId) {
    let payload = {
        adminId: userId,

    };
    let insertData = await defaultScreen.create(payload);
    logger.info(`Default Screen created for the User${userId}`);
    return true;
}
async function setDefaultScreenUser(userId) {
    let payload = {
        userId: userId,

    };
    let insertData = await defaultScreen.create(payload);
    logger.info(`Default Screen created for the User${userId}`);
    return true;
}
function totalHours(allTime) {
    return allTime.reduce((sum, num) => sum + num);
}

function fetchRemainingHours(data) {
    return data.map(ele => {
        return ele.remainingHours;
    });
}

function fetchActualHours(data) {
    return data.map(key => {
        return key.actualHours;
    });
}

function fetchTaskIds(data) {
    return data.map(key => {
        return key._id.toString();
    });
}

export async function getPermissions(orgId,permissionName) {

    let permissions = await permissionModel.findOne({orgId,permissionName});
    return permissions;
}

async function removeObjectNull(object) {
    Object.entries(object).forEach(([k, v]) => {
        if (v && typeof v === 'object') removeObjectNull(v);
        if ((v && typeof v === 'object' && !Object.keys(v).length) || v === null || v === undefined || v.length === 0) {
            if (Array.isArray(object)) object.splice(k, 1);
            else if (!(v instanceof Date)) delete object[k];
        }
    });
    return object;
}

function totalFields(data, value) {
    data.forEach(entry => {
        const key = Object.keys(entry);
        key.map(element => {
            let objectValue = entry[element];
            if (objectValue == 1) {
                value.push(element);
            }
        });
    });
    return value;
}

function configSelectFields(data, value, fields) {
    data.forEach(entry => {
        fields.map(run => {
            let key = Object.keys(run.toJSON());
            key.map(element => {
                let objectValue = run[element];
                if (objectValue == 0) {
                    value.push(element);
                }
            });
        });
    });
    return value;
}

function filterFields(data, value) {
    return data.filter(word => value.includes(word));
}

function viewFields(fields, value, obj) {
    fields.map(run => {
        let key = Object.keys(run.toJSON());
        key.map(element => {
            let objectValue = run[element];
            if (objectValue == 1) {
                obj[element] = objectValue;
                value = obj;
            }
        });
    });

    return value;
}

function checkingFieldValues(configProjectFields, enabledFields, requiredFields, unRequiredFields) {
    configProjectFields.forEach(entry => {
        const key = Object.keys(entry.toJSON());
        key.map(element => {
            let objectValue = entry[element];
            if (objectValue == 1) {
                enabledFields.push(element);
            } else if (objectValue == 2) {
                requiredFields.push(element);
            } else if (objectValue == 0) {
                unRequiredFields.push(element);
            }
        });
    });
    return enabledFields, requiredFields, unRequiredFields;
}

function filterFieldsValues(data, value) {
    let dataValue;
    data.map(ele => {
        dataValue = ele.filter(word => value.includes(word));
    });
    return dataValue;
}

function defaultFieldsInfo(defaultProject, defaultProjectValues, dynamicFields) {
    defaultProject.forEach(run => {
        let key = Object.keys(run);
        key.map(element => {
            let objectValue = run[element];
            if (objectValue == 1 || objectValue == 2) {
                defaultProjectValues.push(element);
            } else if (objectValue == 0) {
                dynamicFields.push(element);
            }
        });
    });
    return defaultProjectValues;
}

function fieldsValidation(fieldsList, validConstants, obj) {
    let object = {
        ...Object.fromEntries(fieldsList.map(key => [key, validConstants])),
    };
    return obj.push(object);
}

function addNewDynamicFields(value, obj) {
    value.map(ele1 => {
        Object.keys(obj).map(ele2 => {
            ele1[ele2] = obj[ele2];
        });
    });
    return value;
}

async function updateOneByUser(id, userId, collectionName, value) {
    const data = await collectionName.findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
    return data;
}


async function updateOneByAdmin(id, collectionName, value) {
    const data = await collectionName.findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
    return data;
}

async function deleteOneByUser(id, userId, collectionName) {
    const isDelete = await collectionName.deleteOne({ _id: ObjectId(id), 'createdBy.userId': userId });
    return isDelete;
}

async function deleteOneByAdmin(id, collectionName) {
    let isDelete = await collectionName.deleteOne({ _id: ObjectId(id) });
    return isDelete;
}

async function deleteManyByUser(key, userId, collectionName) {
    key['createdBy.userId'] = userId;
    let deleteAll = await collectionName.deleteMany(key);
    return deleteAll;
}

async function deleteManyByAdmin(key, collectionName) {
    const deleteAll = await collectionName.deleteMany(key);
    return deleteAll;
}

async function checkData(id, db, collectionName) {
    const data = await db.collection(collectionName).findOne({ _id: ObjectId(id) });
    return data;
}

function subtractAndFormat(firstTime, secondTime) {
    // Convert times to minutes
    const [firstHours, firstMinutes] = firstTime.split(":").map(Number);
    const [secondHours, secondMinutes] = secondTime.split(":").map(Number);
    const firstTotalMinutes = firstHours * 60 + firstMinutes;
    const secondTotalMinutes = secondHours * 60 + secondMinutes;
    
    // Subtract minutes
    const diffMinutes = firstTotalMinutes - secondTotalMinutes;
  
    // Convert the difference to "hh:mm" format
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const result = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
    return result;
  }
const creatorDetails = async (creator, collectionName = '' , db = '' ) => {
    let creatorId = creator.Id || creator.id;

    let result = await adminSchema.findOne({ _id: creatorId }).select('firstName lastName profilePic');
    if (!result) {
        result = await db
            .collection(collectionName).findOne({ _id: ObjectId(creatorId) }, { firstName: 1, lastName: 1, profilePic: 1,isSuspended :1 });
    }
    const firstName = result?.firstName || result?.firstName;
    const lastName = result?.lastName || result?.lastName;
    const profilePic = result?.profilePic || result?.profilePic;
    const isSuspended = result?.isSuspended || result?.isSuspended
    delete creator.Name;
    delete creator.ProfilePic;

    return {
        ...creator,
        firstName,
        lastName,
        profilePic,
        isSuspended
      };
}
  
export {
    addNewDynamicFields,
    checkCollection,
    fetchAllCollection,
    setDefaultScreen,
    totalHours,
    fetchRemainingHours,
    fetchActualHours,
    fetchTaskIds,
    totalFields,
    configSelectFields,
    filterFields,
    viewFields,
    checkingFieldValues,
    filterFieldsValues,
    defaultFieldsInfo,
    removeObjectNull,
    fieldsValidation,
    updateOneByUser,
    updateOneByAdmin,
    deleteOneByUser,
    deleteOneByAdmin,
    deleteManyByUser,
    deleteManyByAdmin,
    checkData,
    subtractAndFormat,
    creatorDetails,
    setDefaultScreenUser
};
