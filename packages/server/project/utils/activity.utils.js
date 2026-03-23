import activitySchema from '../core/activity/activity.model.js';
function activityOfUser(activity, activityName, name, categoryType, organizationId, userId, userProfilePic) {
    let activityData = {
        activityType: activityName,
        activity: activity,
        category: categoryType,
        orgId: organizationId,
        userDetails: {
            id: userId,
            name: name,
            profilePic: userProfilePic,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return activityData;
}

function activityOfAdmin(activity, activityName, categoryType, organizationId) {
    let activityData = {
        activityType: activityName,
        activity: activity,
        category: categoryType,
        orgId: organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return activityData;
}

function dataDeleteActivity(collection, value) {
    let deleteActivity;
    if (collection.length) {
        collection.forEach(async function (element) {
            if (new Date() != new Date(element.createdAt.getTime() + value)) {
                deleteActivity = await activitySchema.deleteOne({ createdAt: element.createdAt });
            }
        });
    } else {
        Logger.info('Activity not present');
    }
    return deleteActivity;
}

function storePlanHistory( organizationId,details,adminId,expireDate) {
    let planDetails = {
        orgId: organizationId,
        planName: details?.planName,
        planData: details,
        durationValue: details?.durationValue,
        durationType: details?.durationType,
        startDate: new Date(),
        expireDate:expireDate,
        status:'active',
        purchasedBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return planDetails;
}

export { activityOfUser, activityOfAdmin, dataDeleteActivity,storePlanHistory };