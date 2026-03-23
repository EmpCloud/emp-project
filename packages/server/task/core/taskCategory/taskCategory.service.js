import Responses from '../../response/response.js';
import TaskCategoryValidation from './taskCategory.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { taskCategoryMessage, commonMessage } from '../language/language.translator.js';
import Reuse from '../../utils/reuse.js';
import {
    checkCollection,
    checkIsDefault,
    countAllDocumentsQuery,
    deleteAllByAdminQuery,
    deleteAllByUserQuery,
    deleteOneByAdminQuery,
    deleteOneByUserQuery,
    findAllItems,
    findByIdAndUpdateQuery,
    findByIdQuery,
    insertAndReturnData,
    isItemExists,
    totalCustomCountForAdmin,
    totalDefaultCountForAdmin,
    updateByUserQuery,
} from '../../utils/common.utils.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/event.emitter.js';
import categorySchema from './taskCategory.model.js'
class TaskCategoryService {
    /* ----------------Task Category APIs -------------------*/
    //Create task category
    async createTaskCategory(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { language, planData, _id: userId, adminId, firstName, profilePic, orgId,creatorId } = result.userData?.userData;
        try {
            const category = req.body;
            const { value, error } = TaskCategoryValidation.createTaskCategory(category);
            Logger.info({'value': value});
            Logger.error({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const totalCount = await categorySchema.countDocuments({ isDefault: false, adminId: adminId });
            if(planData.categoriesCount==0){
                return res.status(429).send(Responses.taskFailResp("Can't create custom taskCategory in free plan subscription"))
            }
            if (totalCount == planData.categoriesCount) {
                return res.status(429).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = { adminId: adminId, taskCategory: new RegExp(`^${value?.taskCategory}$`, 'i') };
            const isTaskCategoryPresent = await categorySchema.findOne(queryCondition);
            Logger.info({'isTaskCategoryPresent': isTaskCategoryPresent});
            if (isTaskCategoryPresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskCategoryMessage['TASK_CATEGORY_PRESENT'][language ?? 'en']));
            }
            value.adminId = adminId;
            value.isDefault = false;
            value.createdBy = {
                userId: userId,
            };
            const resp = await categorySchema.create(value);
            Logger.info({'Response': resp});
            let taskActivity = activityOfUser(` ${firstName} created ${category.taskCategory} task category`, 'TaskCategory', firstName, 'Created', orgId, userId, profilePic);
            taskActivity['taskCategoryId'] = resp._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created task category ${category.taskCategory}`;
            await NotificationService.adminNotification(message, adminId, userId,{ collection: 'taskCategory', id: resp._id.toString() });
            if (result.type === 'user') {
            if (adminId != creatorId && userId != creatorId) {
                await NotificationService.userNotification(message, userId,creatorId,  { collection: 'taskCategory', id: resp._id.toString()});
            }
           }
            return res.status(200).send(Responses.taskSuccessResp(taskCategoryMessage['TASK_CATEGORY_CREATED'][language ?? 'en'], resp));
        } catch (err) {
            Logger.error({'error': err});
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_CREATED'][language ?? 'en']));
        }
    }

    async getTaskCategoryById(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId } = result?.userData?.userData;
        try {
            const id = req?.query?.id;
            const skip = reusable.skip;
            const limit = reusable.limit;
            let orderby = reusable.orderby || 'createdAt';
            let keyword = req?.query?.keyword;
            let sort = reusable.sort;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            let data = {};
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                Logger.info(keyword);
            }
            if (id) {
                data.categoryData = await categorySchema.find({ _id: id,adminId:adminId });
                data.category = [data?.categoryData]
                delete data?.categoryData;
            } else {
                data.category = await categorySchema.find({taskCategory: new RegExp(keyword, 'i') ,adminId:adminId}).sort(sortBy).skip(skip).limit(limit)
                data.total_count = await categorySchema.countDocuments({ adminId: adminId });
                data.custom_count = await categorySchema.countDocuments({ adminId: adminId, isDefault: false });
                data.default_count = await categorySchema.countDocuments({ adminId: adminId, isDefault: true });
            }
            Logger.info({'Task category': data});
            if (data.category) {
                let taskActivity = activityOfUser(` ${firstName} viewed task category`, 'TaskCategory', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskCategoryId'] = id ? id : 'All';
                event.emit('activity', taskActivity);
            }
            data.category
                ? res.status(200).send(Responses.taskSuccessResp(taskCategoryMessage['TASK_CATEGORY_FETCHED'][language ?? 'en'], data))
                : res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err' : err});
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_FETCHED'][language ?? 'en']));
        }
    }

    //Update task category
    async updateTaskCategory(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId,creatorId, permission } = result?.userData?.userData;
        try {
            const category = req.body;
            const { value, error } = TaskCategoryValidation.updateTaskCategory(category);
            Logger.info({'value': value});
            Logger.info({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            value.updatedAt = new Date();
            const id = req?.params?.id;
        
            const queryCondition = { adminId: adminId, taskCategory: new RegExp(`^${category?.taskCategory}$`, 'i') };
            const isTaskCategoryPresent = await categorySchema.findOne(queryCondition);
            Logger.info({'isTaskCategoryPresent' :isTaskCategoryPresent});
            if (isTaskCategoryPresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskCategoryMessage['TASK_CATEGORY_PRESENT'][language ?? 'en']));
            }
            const isDefault = await categorySchema.findOne({ _id: id,adminId:adminId, isDefault: true })
            if (isDefault) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskCategoryMessage['TASK_CATEGORY_DEFAULT'][language ?? 'en']));
            }
            const taskCategory = await categorySchema.findOne({ _id: id,adminId:adminId })
            let updatedTaskCategory;
            
            if (result.type === 'user' && permission !== 'admin') {
                updatedTaskCategory = await categorySchema.findOneAndUpdate({ _id: id,adminId:adminId, $or: [{ 'createdBy.userId': userId, isDefault: false }] }, { $set: value }, { returnDocument: 'after' })
                if (!updatedTaskCategory) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else {
                updatedTaskCategory = await categorySchema.findOneAndUpdate({ _id: id, adminId: adminId, }, { $set: value }, { returnDocument: 'after' });
            }
            Logger.info({'updatedTaskCategory': updatedTaskCategory});
            if (updatedTaskCategory) {
                let taskActivity = activityOfUser(` ${firstName} updated task category as ${category.taskCategory}`, 'TaskCategory', firstName, 'Updated', orgId, userId, profilePic);
                taskActivity['taskCategoryId'] = id;
                event.emit('activity', taskActivity);
                //updating category wherever it is assigned
                const db = await checkCollection(reusable.collectionName.task);
                await db.collection(reusable.collectionName.task)
                           .updateMany( { category: taskCategory?.taskCategory },{$set: { category:updatedTaskCategory?.taskCategory }});
                await db.collection(reusable.collectionName.subTask)
                           .updateMany( { subTaskCategory: taskCategory?.taskCategory },{$set: { subTaskCategory : updatedTaskCategory?.taskCategory }});
                // Notification to Admin
                const message = `Updated task category from ${taskCategory.taskCategory} to ${updatedTaskCategory.taskCategory}`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskCategory', id: updatedTaskCategory._id.toString() });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  {  collection: 'taskCategory', id: updatedTaskCategory._id.toString()});
                }
            }
                return res.status(200).send(Responses.taskSuccessResp(taskCategoryMessage['TASK_CATEGORY_UPDATED'][language ?? 'en'], updatedTaskCategory));
            }
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_UPDATED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err' : err});
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_UPDATED'][language ?? 'en']));
        }
    }

    //Delete task by Id
    async deleteTaskCategoryById(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        Logger.info({ 'result': result });
        try {
            const categoryId = req.query?.id;
            let category, data;
            const db = await checkCollection(reusable.collectionName.task);
            if (categoryId) {
                const isDefault = await categorySchema.findOne({ _id: categoryId, isDefault: true });
                if (isDefault) {
                    return res.status(400).send(Responses.taskDuplicateErrorResp(taskCategoryMessage['TASK_CATEGORY_DEFAULT'][language ?? 'en']));
                }
                data = await categorySchema.findOne({ _id: categoryId, adminId: adminId });
                let isAssignedTask, isAssignedSubtask;
                isAssignedTask = await db
                    .collection(reusable.collectionName.task)
                    .find({ category: data?.taskCategory })
                    .toArray();
                isAssignedSubtask = await db
                    .collection(reusable.collectionName.subTask)
                    .find({ subTaskCategory: data?.taskCategory })
                    .toArray();
                if (isAssignedTask.length > 0 || isAssignedSubtask > 0) {
                    return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_CANNOT_DELETED'][language ?? 'en']));
                }
                if (result.type === 'user' && permission != 'admin') {
                    category = await categorySchema.deleteOne({ 'createdBy.userId': userId, _id: categoryId, adminId: adminId })
                    if (category.deletedCount === 0) {
                        return res.status(400).send(Responses.taskFailResp("You can't delete Categories which are created by someone else"));
                    }
                }
                else {
                    category = await categorySchema.deleteOne({ _id: categoryId, adminId: adminId })
                }
            }
            else {
                let notExist = [];

                let data = await categorySchema.find({ adminId: adminId });
                await Promise.all( data.map(async ele => {
                    let isAssigneTask = await db
                        .collection(reusable.collectionName.task)
                        .aggregate([{ $match: { category: ele?.taskCategory } }])
                        .toArray();
                    if (isAssigneTask.length > 0) {
                        notExist.push(ele.taskCategory)
                        return notExist;
                    }
                }))
                await Promise.all( data.map(async ele => {
                    let isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .aggregate([{ $match: { subTaskCategory: ele?.taskCategory } }])
                        .toArray();
                    if (isAssignedSubtask.length > 0) {
                        notExist.push(ele.taskCategory)
                        return notExist;
                    }
                }))
                let filter;
                if (result.type === 'user' && permission != 'admin') {
                    filter = {
                        'createdBy.userId': userId,
                        adminId: adminId,
                        isDefault: false,
                        taskCategory: { $nin: notExist }
                    };
                } else {
                    filter = {
                        adminId: adminId,
                        isDefault: false,
                        taskCategory: { $nin: notExist }
                    };
                }
                category = await categorySchema.deleteMany(filter);
            }
            Logger.info({ 'category': category });
            if (category.deletedCount) {
                let taskActivity = activityOfUser(`${firstName} deleted task category`, 'TaskCategory', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['taskCategoryId'] = categoryId ? categoryId : 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = category.deletedCount == 1 && categoryId ? `Deleted the task category ${data?.taskCategory}.` : `Deleted all non-default task categories.`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskCategory', id: null });
                if (result.type === 'user') {
                    if (adminId != creatorId && userId != creatorId) {
                        await NotificationService.userNotification(message, userId, creatorId, { collection: 'taskCategory', id: null });
                    }
                }
                res.status(200).send(Responses.taskSuccessResp(taskCategoryMessage['TASK_CATEGORY_DELETED'][language ?? 'en'], category));
            } else {
                res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_CANNOT_DELETED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({ 'err': err });
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_DELETED'][language ?? 'en']));
        }
    }

    async deleteMultiTaskCategoryById(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        Logger.info({ 'result': result });
        try {
            const categoryIds = req.body?.categoryIds;
            let data;
            const db = await checkCollection(reusable.collectionName.task);
            
            if (categoryIds && Array.isArray(categoryIds)) {
                // Check if all category IDs are valid and exist in the database
                const existingCategories = await categorySchema.find({ _id: { $in: categoryIds }, adminId: adminId }).select('_id isDefault taskCategory').lean();
                const existingCategoryIds = existingCategories.map(category => category._id.toString());
                const invalidIds = categoryIds.filter(id => !existingCategoryIds.includes(id));
    
                if (invalidIds.length > 0) {
                    return res.status(400).send(Responses.taskFailResp(`Invalid category IDs provided: ${invalidIds.join(', ')}`));
                }
    
                for (const categoryId of categoryIds) {
                    const categoryData = existingCategories.find(category => category._id.toString() === categoryId);
                    if (categoryData.isDefault) {
                        return res.status(400).send(Responses.taskDuplicateErrorResp(taskCategoryMessage['TASK_CATEGORY_DEFAULT'][language ?? 'en']));
                    }
                    
                    let isAssignedTask, isAssignedSubtask;
                    isAssignedTask = await db
                        .collection(reusable.collectionName.task)
                        .find({ category: categoryData.taskCategory })
                        .toArray();
                    isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .find({ subTaskCategory: categoryData.taskCategory })
                        .toArray();
                    
                    if (isAssignedTask.length > 0 || isAssignedSubtask.length > 0) {
                        await db.collection(reusable.collectionName.task).updateMany(
                            { category: categoryData.taskCategory },
                            { $set: { category: "Default" } }
                        );
                        await db.collection(reusable.collectionName.subTask).updateMany(
                            { subTaskCategory: categoryData.taskCategory },
                            { $set: { subTaskCategory: "Default" } }
                        );
                    }
    
                    let category;
                    if (result.type === 'user' && permission != 'admin') {
                        category = await categorySchema.deleteOne({ 'createdBy.userId': userId, _id: categoryId, adminId: adminId });
                        if (category.deletedCount === 0) {
                            return res.status(400).send(Responses.taskFailResp("You can't delete Categories which are created by someone else"));
                        }
                    } else {
                        category = await categorySchema.deleteOne({ _id: categoryId, adminId: adminId, isDefault: false });
    
                        if (category.deletedCount) {
                            let taskActivity = activityOfUser(`${firstName} deleted task category`, 'TaskCategory', firstName, 'Deleted', orgId, userId, profilePic);
                            taskActivity['taskCategoryId'] = categoryId ? categoryId : 'All';
                            event.emit('activity', taskActivity);
                            const message = category.deletedCount == 1 && categoryId ? `Deleted the task category ${categoryData.taskCategory}.` : `Deleted all non-default task categories.`;
                            await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskCategory', id: null });
                        } 
                    }
                }
    
                return res.status(200).send(Responses.taskSuccessResp("Categories deleted successfully"));
            } else {
                return res.status(400).send(Responses.taskFailResp("No valid category IDs provided"));
            }
            
        } catch (err) {
            console.log(err);
            Logger.error({ 'err': err });
            return res.status(400).send(Responses.taskFailResp(taskCategoryMessage['TASK_CATEGORY_NOT_DELETED'][language ?? 'en']));
        }        
    }
}

export default new TaskCategoryService();
