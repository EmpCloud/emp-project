import Router from 'express';
const router = Router();
import CalendarControllers from './calendar.controllers.js';

router.post('/add-event', CalendarControllers.addEvent);
router.get('/get-events', CalendarControllers.getEvents);
router.put('/update-event/:id', CalendarControllers.updateEvent);
router.delete('/delete-events', CalendarControllers.deleteEvents);
router.get('/search-events', CalendarControllers.searchEvents);
router.post('/filter', CalendarControllers.filterEvents);

export default router;
