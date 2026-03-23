import { connection } from '../resources/database/mongo.connect.js';
import config from 'config';
import { ObjectId } from 'mongodb';
import permissionModel from '../core/schema/permission.model.js';

export async function checkCollection(collectionName) {
    const dbName = config.get('mongo.db_name');
    const db = connection.client.db(dbName);
    const collInfo = await db.listCollections({ name: collectionName }).toArray();
    if (collInfo.length === 0) {
        return null;
    }
    return db;
}

/** Insert queries */
export async function insertAndReturnData(db, collectionName, data) {
    const insertedData = await db.collection(collectionName).insertOne(data);
    const insertedObject = await db.collection(collectionName).findOne({ _id: insertedData.insertedId });
    return insertedObject;
}

/** Read queries */
// Function for checking items exists in the db
export async function isItemExists(db, collectionName, queryCondition) {
    const itemDetails = await db.collection(collectionName).findOne(queryCondition);
    return itemDetails ? true : false;
}

// Function for finding all items from database based on condition
export async function findAllItems(db, taskTypeCollectionName, queryCondition, sortBy, skipValue, limitValue) {
    const pipeline = [{ $match: queryCondition }, { $sort: sortBy }, { $skip: skipValue }, { $limit: limitValue }];
    const allTaskTypes = db
        .collection(taskTypeCollectionName)
        .aggregate(pipeline, {
            collation: { locale: 'en', caseFirst: 'upper' },
        })
        .toArray();
    return allTaskTypes;
}

export async function totalCustomCountForAdmin(db, collectionName, adminId) {
    const totalCount = await db.collection(collectionName).countDocuments({ isDefault: false, adminId: adminId });
    return totalCount;
}

export async function totalDefaultCountForAdmin(db, collectionName, adminId) {
    const totalCount = await db.collection(collectionName).countDocuments({ isDefault: true, adminId: adminId });
    return totalCount;
}

export async function countAllDocumentsQuery(db, collectionName) {
    const totalCount = await await db.collection(collectionName).countDocuments({});
    return totalCount;
}

export async function searchDocumentsQuery(db, collectionName, searchQuery, sortBy, skipValue, limitValue) {
    const searchedData = await db
        .collection(collectionName)
        .aggregate(
            [
                {
                    $match: searchQuery,
                },
            ],
            { collation: { locale: 'en', caseFirst: 'upper' } }
        )
        .sort(sortBy)
        .skip(skipValue)
        .limit(limitValue)
        .toArray();
    return searchedData;
}

export async function findByIdQuery(db, collectionName, id) {
    const data = await db
        .collection(collectionName)
        .find({ _id: ObjectId(id) })
        .toArray();
    return data;
}

export async function findAllDocuments(db, collectionName, adminId, sortBy, skipValue, limitValue) {
    const allTaskTypes = db
        .collection(collectionName)
        .aggregate([{ $match: { $or: [{ adminId: adminId }, { isDefault: true }] } }, { $sort: sortBy }, { $skip: skipValue }, { $limit: limitValue }], {
            collation: { locale: 'en', caseFirst: 'upper' },
        })
        .toArray();
    return allTaskTypes;
}

export async function checkIsDefault(db, collectionName, id) {
    let isDefault = await db
        .collection(collectionName)
        .aggregate([{ $match: { _id: ObjectId(id), isDefault: true } }])
        .toArray();
    return isDefault.length ? true : false;
}

/** Update queries */
export async function findByIdAndUpdateQuery(db, collectionName, id, value) {
    const updatedData = await db.collection(collectionName).findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
    return updatedData;
}

export async function updateByUserQuery(db, collectionName, id, userId, value) {
    let updatedData = await db
        .collection(collectionName)
        .findOneAndUpdate({ _id: ObjectId(id), $or: [{ 'createdBy.userId': userId, isDefault: false }] }, { $set: value }, { returnDocument: 'after' });
    return updatedData;
}

/** Delete queries */
export async function deleteOneByUserQuery(db, collectionName, id, userId) {
    let deletedData = await db.collection(collectionName).deleteOne({ 'createdBy.userId': userId, _id: ObjectId(id) });
    return deletedData;
}

export async function deleteAllByUserQuery(db, collectionName, userId) {
    let deletedData = await db.collection(collectionName).deleteMany({ 'createdBy.userId': userId, isDefault: false });
    return deletedData;
}

export async function deleteOneByAdminQuery(db, collectionName, id) {
    let deletedData = await db.collection(collectionName).deleteOne({ _id: ObjectId(id) });
    return deletedData;
}

export async function deleteAllByAdminQuery(db, collectionName, adminId) {
    let deletedData = await db.collection(collectionName).deleteMany({ adminId: adminId, isDefault: false });
    return deletedData;
}

/** Other utility functions */
export async function removeObjectNull(object) {
    Object.entries(object).forEach(([k, v]) => {
        if (v && typeof v === 'object') removeObjectNull(v);
        if ((v && typeof v === 'object' && !Object.keys(v).length) || v === null || v === undefined || v.length === 0) {
            if (Array.isArray(object)) object.splice(k, 1);
            else if (!(v instanceof Date)) delete object[k];
        }
    });
    return object;
}
export function addNewDynamicFields(value, obj) {
    Object.keys(obj).map(ele2 => {
        value[ele2] = obj[ele2];
    });
    return value;
}

export async function getFieldExist(value, fieldName, collectionName, db) {
    let condition = {};
    condition[fieldName] = value;
    let query = await db.collection(collectionName).find(condition).toArray();
    return query;
}

export function viewFields(data, fields, value, obj) {
    data.forEach(entry => {
        fields.map(run => {
            let key = Object.keys(run);
            key.map(element => {
                let objectValue = run[element];
                if (objectValue == 1) {
                    obj[element] = objectValue;
                    value = obj;
                }
            });
        });
    });
    return value;
}
export function checkingFieldValues(configProjectFields, enabledFields, requiredFields, unRequiredFields) {
    configProjectFields.forEach(entry => {
        const key = Object.keys(entry);
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
export function filterFieldsValues(data, value) {
    let dataValue = data.filter(word => value.includes(word));
    return dataValue;
}

export function subtractAndFormat(firstTime, secondTime) {
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

export const creatorDetails = async (creator, collectionName, db) => {

    let creatorId = creator.id || creator.Id;
    let result = await db.collection('adminschemas').findOne(
        { _id: ObjectId(creatorId) },
        { firstName: 1, lastName: 1, profilePic: 1, isSuspended: 1 }
    );
    if (!result) {
        result = await db
            .collection(collectionName).findOne({ _id: ObjectId(creatorId) }, { firstName: 1, lastName: 1, profilePic: 1, isSuspended: 1 });
    }
    const firstName = result?.firstName || result[0]?.firstName;
    const lastName = result?.lastName || result[0]?.lastName;
    const profilePic = result?.profilePic || result[0]?.profilePic;
    const isSuspended = result?.isSuspended;  

    return {
        ...creator,
        firstName,
        lastName,
        profilePic,
        isSuspended
    };
}


export async function calculateProgress(subTaskCollectionName, db, taskId)
{
    let progress, countProgress;

    let totalSubTasks = await db.collection(subTaskCollectionName).find({ taskId: taskId}).toArray()
    let compltedSubtask = await db.collection(subTaskCollectionName).find({ $and: [{ taskId: taskId}, { subTaskStatus: new RegExp('^' + 'Done', 'i') }] }).toArray();

    countProgress = Math.round((compltedSubtask.length / totalSubTasks.length) * 100);

    progress = isNaN(countProgress) ? 0 : countProgress;
    return progress;
}

export async function calculateTaskProgress(db, taskCollectionName, projectId) {
    let progress, countProgress;

    let totalTasks = await db.collection(taskCollectionName).find({ projectId: projectId }).toArray()
    let compltedTask = await db.collection(taskCollectionName).find({ $and: [{ projectId: projectId }, { taskStatus: new RegExp('^' + 'Done', 'i') }] }).toArray();

    countProgress = Math.round((compltedTask.length / totalTasks.length) * 100);

    progress = isNaN(countProgress) ? 0 : countProgress;
    return progress;
}


export async function getPermissions(orgId,permissionName) {

    let permissions = await permissionModel.findOne({orgId,permissionName});
    return permissions;
}
