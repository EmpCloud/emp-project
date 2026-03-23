function activityOfUser(activity,activityName,name,categoryType,organizationId,userId,userProfilePic){
    let activityData={
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
   }
   return activityData
}


export {activityOfUser}