export async function checkConflictingEvents(db, calendarCollection, startTime, endTime) {
    const startEventTime = new Date(startTime);
    const endEventTime = new Date(endTime);
    const query = {
        $or: [
            { startTime: { $lt: startEventTime }, endTime: { $gt: startEventTime } }, // Event start time between existing events
            { startTime: { $lt: endEventTime }, endTime: { $gt: endEventTime } }, // Event end time between existing events
            { startTime: { $gte: startEventTime, $lt: endEventTime } }, // Event start time overlapping with existing event
            { endTime: { $gt: startEventTime, $lte: endEventTime } }, // Event end time overlapping with existing event
            { startTime: { $lte: startEventTime }, endTime: { $gte: endEventTime } }, // Event completely overlapping with existing event
            { endTime: startEventTime }, // Event adjacent to existing event start time
            { startTime: endEventTime }, // Event adjacent to existing event end time
        ],
    };
    const eventData = await db.collection(calendarCollection).findOne(query);
    return eventData ? true : false;
}

export async function checkTitleExistsInTimeRange(db, calendarCollection, startTime, endTime, eventName) {
    const startEventTime = new Date(startTime);
    const endEventTime = new Date(endTime);
    const query = {
        $and: [
            {
                $or: [
                    { startTime: { $lt: startEventTime }, endTime: { $gt: startEventTime } }, // Event start time between existing events
                    { startTime: { $lt: endEventTime }, endTime: { $gt: endEventTime } }, // Event end time between existing events
                    { startTime: { $gte: startEventTime, $lt: endEventTime } }, // Event start time overlapping with existing event
                    { endTime: { $gt: startEventTime, $lte: endEventTime } }, // Event end time overlapping with existing event
                    { startTime: { $lte: startEventTime }, endTime: { $gte: endEventTime } }, // Event completely overlapping with existing event
                    { endTime: startEventTime }, // Event adjacent to existing event start time
                    { startTime: endEventTime }, // Event adjacent to existing event end time
                ],
            },
            { eventName },
        ],
    };
    const eventData = await db.collection(calendarCollection).findOne(query);
    return eventData ? true : false;
}

export async function insertAndReturnEventData(db, calendarCollection, value) {
    const eventData = await db.collection(calendarCollection).insertOne(value);
    const response = await db.collection(calendarCollection).findOne({ _id: eventData.insertedId });
    return response;
}
