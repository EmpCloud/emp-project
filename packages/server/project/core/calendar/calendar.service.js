import Response from '../../response/response.js';
import logger from '../../resources/logs/logger.log.js';
import { ObjectId } from 'mongodb';
import { checkCollection } from '../../utils/project.utils.js';
import config from 'config';
import calendarValidation from './calendar.validation.js';
import { checkConflictingEvents, checkTitleExistsInTimeRange, insertAndReturnEventData } from '../../utils/calendar.utils.js';

class CalendarService {
    async addEvent(req, res) {
        const result = req.verified;
        const { orgId, _id: creatorId } = result?.userData?.userData;
        try {
            const event = req.body;
            const { value, error } = calendarValidation.createEvent(event);
            logger.error(`validation error ${error}`);
            if (error) return res.status(400).send(Response.validationFailResp('Validation failed', error.message));
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));
            value['creatorId'] = creatorId;
            value['startTime'] = new Date(value.startTime);
            value['endTime'] = new Date(value.endTime);
            const titleExists = await checkTitleExistsInTimeRange(db, calendarCollection, value.startTime, value.endTime, value.eventName);
            if (titleExists) return res.status(400).send(Response.projectFailResp('Event name already exists for the time range.'));
            const eventConflicts = await checkConflictingEvents(db, calendarCollection, value.startTime, value.endTime);
            if (eventConflicts) return res.status(400).send(Response.projectFailResp('Event time is conflicting with existing events.'));
            const eventData = await insertAndReturnEventData(db, calendarCollection, value);
            logger.info(`eventData ${eventData}`);
            return res.status(200).send(Response.projectSuccessResp('Event created successfully', eventData));
        } catch (error) {
            logger.error(`error in catch ${error}`);
            return res.status(400).send(Response.projectFailResp('Error while adding event'));
        }
    }

    async getEvents(req, res) {
        const result = req.verified;
        const { orgId, _id: userId } = result?.userData?.userData;
        try {
            const skipValue = +req?.query?.skip || config.get('skip');
            const limitValue = +req.query.limit || config.get('limit');
            let sort = req?.query?.sort || 'asc';
            let orderby = req?.query?.orderBy || 'startDate';
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const { eventId } = req.query;
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));
            let eventData;
            if (eventId) {
                eventData = await db.collection(calendarCollection).findOne({ _id: ObjectId(eventId) });
                logger.info(`eventData ${eventData}`);
                return eventData
                    ? res.status(200).send(Response.projectSuccessResp('Event fetched successfully', eventData))
                    : res.status(400).send(Response.projectFailResp('Event not found. Please check eventId'));
            }
            eventData = await db
                .collection(calendarCollection)
                .find({ $or: [{ creatorId: userId.toString() }, { 'attendees.id': userId.toString() }] })
                .sort(sortBy)
                .skip(skipValue)
                .limit(limitValue)
                .toArray();
            logger.info(`eventData ${eventData}`);
            const response = { eventCount: eventData.length, eventData, skip: skipValue, limit: limitValue };
            return res.status(200).send(Response.projectSuccessResp('Events fetched successfully', response));
        } catch (error) {
            logger.error(`error in catch ${error}`);
            res.status(400).send(Response.projectFailResp('Error while fetching event'));
        }
    }

    async updateEvent(req, res) {
        const result = req.verified;
        const { orgId, _id: userId } = result?.userData?.userData;
        try {
            const event = req.body;
            const eventId = req.params?.id;
            const { value, error } = calendarValidation.updateEvent(event);
            if (error) return res.status(400).send(Response.validationFailResp('Validation failed', error.message));
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));
            if (value.startTime) value['startTime'] = new Date(value.startTime);
            if (value.endTime) value['endTime'] = new Date(value.endTime);
            const eventInfo = await db.collection(calendarCollection).findOne({ _id: ObjectId(eventId) });
            if (!eventInfo) return res.status(400).send(Response.projectFailResp('Event not found. Invalid eventId'));
            if (!value.startTime && value.endTime && value.endTime < eventInfo.startTime)
                return res.status(400).send(Response.projectFailResp('End time can not be smaller than start time of the event'));
            const startTime = value.startTime || eventInfo.startTime;
            const endTime = value.endTime || eventInfo.endTime;
            const titleExists = await checkTitleExistsInTimeRange(db, calendarCollection, startTime, endTime, value.eventName);
            if (titleExists) return res.status(400).send(Response.projectFailResp('Event name already exists for the time range.'));
            const response = await db.collection(calendarCollection).findOneAndUpdate({ _id: ObjectId(eventId), creatorId: userId }, { $set: value }, { returnDocument: 'after' });
            logger.info(`response ${response}`);
            return res.status(200).send(Response.projectSuccessResp('Event updated successfully', response.value));
        } catch (error) {
            logger.error(`error in catch ${error}`);
            res.status(400).send(Response.projectFailResp('Error while updating event'));
        }
    }

    async deleteEvents(req, res) {
        const result = req.verified;
        const { orgId, _id: userId } = result?.userData?.userData;
        try {
            const { eventId } = req.query;
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));
            if (eventId) {
                const response = await db.collection(calendarCollection).deleteOne({ _id: ObjectId(eventId), creatorId: userId });
                logger.info(`response ${response}`);
                return response.deletedCount
                    ? res.status(200).send(Response.projectSuccessResp('Event deleted successfully', response))
                    : res.status(400).send(Response.projectFailResp('Invalid event id'));
            }
            const response = await db.collection(calendarCollection).deleteMany({ creatorId: userId });
            logger.info(`response ${response}`);
            return response.deletedCount
                ? res.status(200).send(Response.projectSuccessResp('Events deleted successfully', response))
                : res.status(400).send(Response.projectFailResp('Events already deleted or does not exist'));
        } catch (error) {
            logger.error(`error in catch ${error}`);
            res.status(400).send(Response.projectFailResp('Error while deleting event'));
        }
    }

    async searchEvents(req, res) {
        const result = req.verified;
        let { _id: userId, orgId } = result?.userData?.userData;
        try {
            const skipValue = +req?.query?.skip || config.get('skip');
            const limitValue = +req.query.limit || config.get('limit');
            let sort = req?.query?.sort || 'asc';
            let orderby = req?.query?.orderBy || '_id';
            const sortBy = {};

            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            let query = {};
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                logger.info(`keyword ${keyword}`);
                query.$or = [
                    { eventName: new RegExp(keyword, 'i') },
                    { description: new RegExp(keyword, 'i') },
                    { attendees: new RegExp(keyword, 'i') },
                    { eventStatus: new RegExp(keyword, 'i') },
                    { reminder: new RegExp(keyword, 'i') },
                    { startTime: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { endTime: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { updatedAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { createdAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                ];
            }
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));
            const events = await db
                .collection(calendarCollection)
                .aggregate([{ $match: { $and: [query, { $or: [{ creatorId: userId }, { 'attendees.id': userId }] }] } }])
                .sort(sortBy)
                .skip(skipValue)
                .limit(limitValue)
                .toArray();
            logger.info(`events ${events}`);
            events.length > 0 ? res.status(200).send(Response.projectSuccessResp('Events searched successFully', events)) : res.status(200).send(Response.projectFailResp(`No events found.`));
        } catch (err) {
            logger.error(err);
            return res.send(Response.projectFailResp('Error while searching events'));
        }
    }

    async filterEvents(req, res) {
        const result = req.verified;
        const { orgId } = result.userData?.userData;
        try {
            const data = req?.body;
            const { error } = calendarValidation.filterEvents(data);
            if (error) return res.status(400).send(Response.validationFailResp('Validation failed', error.message));
            let query = [];
            let myFilters = {};
            if (data?.eventName) {
                logger.info(data.eventName);
                query.push({ eventName: data.eventName });
            }
            if (data?.description) {
                logger.info(data.description);
                query.push({ description: data.description });
            }
            if (data?.creatorId) {
                logger.info(data.creatorId);
                query.push({ creatorId: data.creatorId });
            }
            if (data?.eventStatus) {
                logger.info(data.eventStatus);
                query.push({ eventStatus: data.eventStatus });
            }
            if (data?.reminder) {
                logger.info(data.reminder);
                query.push({ reminder: data.reminder });
            }
            if (data?.attendees) {
                logger.info(data.attendees);
                query.push({ attendees: data.attendees });
            }
            if (data?.startTime) {
                logger.info(data.startTime);
                query.push({
                    startTime: {
                        $gte: new Date(data.startTime.startDate),
                        $lt: new Date(new Date(data.startTime.endDate).setHours(23, 59, 59, 999)),
                    },
                });
            }
            if (data?.endTime) {
                logger.info(data.endTime);
                query.push({
                    endTime: {
                        $gte: new Date(data.endTime.startDate),
                        $lt: new Date(new Date(data.endTime.endDate).setHours(23, 59, 59, 999)),
                    },
                });
            }
            if (query.length) myFilters['$and'] = query;
            const calendarCollection = `org_${orgId.toLowerCase()}_calendars`;
            const db = await checkCollection(calendarCollection);
            if (!db) return res.status(400).send(Response.projectFailResp('Calendar feature is not enabled'));

            const resp = await db
                .collection(calendarCollection)
                .aggregate([
                    {
                        $match: myFilters,
                    },
                ])
                .toArray();
            logger.info(`resp ${resp}`);
            res.status(200).send(Response.projectSuccessResp('Events fetched successfully', resp));
        } catch (err) {
            logger.error(`error ${err}`);
            return res.status(400).send(Response.activityFailResp('Error while filtering data'));
        }
    }
}

export default new CalendarService();
