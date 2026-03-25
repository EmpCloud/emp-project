import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import Reuse from '../../utils/reuse.js';
import { ObjectId } from 'mongodb';
import { checkCollection } from '../../utils/project.utils.js';
import sprintModel from './sprint.model.js';

class SprintService {

    /**
     * Create a new sprint
     */
    async createSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, _id: userId, language } = reuse.result.userData?.userData;
        try {
            const { projectId, name, goal, startDate, endDate } = req.body;

            if (!projectId || !name || !startDate || !endDate) {
                return res.status(400).send(Response.projectFailResp('projectId, name, startDate and endDate are required'));
            }

            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).send(Response.projectFailResp('startDate must be before endDate'));
            }

            // Verify project exists
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.status(400).send(Response.projectFailResp('Project feature not enabled'));

            const project = await db.collection(reuse.collectionName.project).findOne({ _id: new ObjectId(projectId) });
            if (!project) return res.status(404).send(Response.projectFailResp('Project not found'));

            // Check for duplicate sprint name within project
            const existing = await sprintModel.findOne({ orgId, projectId, name });
            if (existing) return res.status(400).send(Response.projectFailResp('Sprint with this name already exists in the project'));

            const sprint = await sprintModel.create({
                orgId,
                projectId,
                name,
                goal: goal || '',
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: 'planning',
                velocity: 0,
                plannedPoints: 0,
                tasks: [],
                createdBy: userId,
            });

            return res.status(200).send(Response.projectSuccessResp('Sprint created successfully', sprint));
        } catch (err) {
            Logger.error(`createSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to create sprint', err.message));
        }
    }

    /**
     * List all sprints for a project
     */
    async listSprints(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { projectId } = req.query;
            if (!projectId) return res.status(400).send(Response.projectFailResp('projectId query param is required'));

            const sprints = await sprintModel
                .find({ orgId, projectId })
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).send(Response.projectSuccessResp('Sprints fetched successfully', sprints));
        } catch (err) {
            Logger.error(`listSprints error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to fetch sprints', err.message));
        }
    }

    /**
     * Get sprint detail with tasks populated
     */
    async getSprintDetail(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;

            const sprint = await sprintModel.findOne({ _id: id, orgId }).lean();
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            // Fetch task details from the org-specific task collection
            const db = await checkCollection(reuse.collectionName.task);
            let taskDetails = [];
            if (db && sprint.tasks.length > 0) {
                const taskIds = sprint.tasks.map(t => new ObjectId(t));
                taskDetails = await db.collection(reuse.collectionName.task)
                    .find({ _id: { $in: taskIds } })
                    .toArray();
            }

            sprint.taskDetails = taskDetails;
            return res.status(200).send(Response.projectSuccessResp('Sprint detail fetched successfully', sprint));
        } catch (err) {
            Logger.error(`getSprintDetail error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to fetch sprint detail', err.message));
        }
    }

    /**
     * Update sprint details (name, goal, dates)
     */
    async updateSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;
            const updates = req.body;

            const sprint = await sprintModel.findOne({ _id: id, orgId });
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            // Only allow updates on planning sprints (or limited updates on active)
            const allowedFields = ['name', 'goal', 'startDate', 'endDate', 'plannedPoints'];
            const updateObj = { updatedAt: new Date() };
            for (const field of allowedFields) {
                if (updates[field] !== undefined) {
                    updateObj[field] = updates[field];
                }
            }

            if (updateObj.startDate && updateObj.endDate && new Date(updateObj.startDate) >= new Date(updateObj.endDate)) {
                return res.status(400).send(Response.projectFailResp('startDate must be before endDate'));
            }

            const updated = await sprintModel.findOneAndUpdate(
                { _id: id, orgId },
                { $set: updateObj },
                { new: true }
            );

            return res.status(200).send(Response.projectSuccessResp('Sprint updated successfully', updated));
        } catch (err) {
            Logger.error(`updateSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to update sprint', err.message));
        }
    }

    /**
     * Start a sprint — only 1 active sprint per project allowed
     */
    async startSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;

            const sprint = await sprintModel.findOne({ _id: id, orgId });
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            if (sprint.status !== 'planning') {
                return res.status(400).send(Response.projectFailResp('Only sprints in planning status can be started'));
            }

            // Check no other active sprint exists for this project
            const activeSprint = await sprintModel.findOne({
                orgId,
                projectId: sprint.projectId,
                status: 'active',
            });
            if (activeSprint) {
                return res.status(400).send(Response.projectFailResp(
                    `Another sprint "${activeSprint.name}" is already active. Complete it first.`
                ));
            }

            // Calculate planned points from tasks
            let plannedPoints = 0;
            if (sprint.tasks.length > 0) {
                const db = await checkCollection(reuse.collectionName.task);
                if (db) {
                    const taskIds = sprint.tasks.map(t => new ObjectId(t));
                    const tasks = await db.collection(reuse.collectionName.task)
                        .find({ _id: { $in: taskIds } })
                        .toArray();
                    plannedPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
                }
            }

            const updated = await sprintModel.findOneAndUpdate(
                { _id: id, orgId },
                { $set: { status: 'active', plannedPoints, updatedAt: new Date() } },
                { new: true }
            );

            return res.status(200).send(Response.projectSuccessResp('Sprint started successfully', updated));
        } catch (err) {
            Logger.error(`startSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to start sprint', err.message));
        }
    }

    /**
     * Complete a sprint — calculate velocity, move incomplete tasks to backlog
     */
    async completeSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;
            const { moveToSprintId } = req.body || {}; // optionally move incomplete tasks to another sprint

            const sprint = await sprintModel.findOne({ _id: id, orgId });
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            if (sprint.status !== 'active') {
                return res.status(400).send(Response.projectFailResp('Only active sprints can be completed'));
            }

            // Calculate velocity from completed tasks
            let velocity = 0;
            let incompleteTasks = [];
            if (sprint.tasks.length > 0) {
                const db = await checkCollection(reuse.collectionName.task);
                if (db) {
                    const taskIds = sprint.tasks.map(t => new ObjectId(t));
                    const tasks = await db.collection(reuse.collectionName.task)
                        .find({ _id: { $in: taskIds } })
                        .toArray();

                    for (const task of tasks) {
                        if (task.taskStatus === 'Done') {
                            velocity += (task.storyPoints || 0);
                        } else {
                            incompleteTasks.push(task._id);
                        }
                    }
                }
            }

            // Update sprint as completed
            await sprintModel.findOneAndUpdate(
                { _id: id, orgId },
                { $set: { status: 'completed', velocity, updatedAt: new Date() } }
            );

            // Move incomplete tasks to another sprint if specified
            if (moveToSprintId && incompleteTasks.length > 0) {
                const targetSprint = await sprintModel.findOne({ _id: moveToSprintId, orgId });
                if (targetSprint && (targetSprint.status === 'planning' || targetSprint.status === 'active')) {
                    await sprintModel.findOneAndUpdate(
                        { _id: moveToSprintId, orgId },
                        { $addToSet: { tasks: { $each: incompleteTasks } }, $set: { updatedAt: new Date() } }
                    );
                }
            }

            const result = await sprintModel.findOne({ _id: id, orgId }).lean();
            return res.status(200).send(Response.projectSuccessResp('Sprint completed successfully', {
                sprint: result,
                velocity,
                incompleteTasks: incompleteTasks.length,
                movedToSprint: moveToSprintId || null,
            }));
        } catch (err) {
            Logger.error(`completeSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to complete sprint', err.message));
        }
    }

    /**
     * Add a task to a sprint
     */
    async addTaskToSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;
            const { taskId } = req.body;

            if (!taskId) return res.status(400).send(Response.projectFailResp('taskId is required'));

            const sprint = await sprintModel.findOne({ _id: id, orgId });
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            if (sprint.status === 'completed' || sprint.status === 'cancelled') {
                return res.status(400).send(Response.projectFailResp('Cannot add tasks to a completed or cancelled sprint'));
            }

            // Verify task exists
            const db = await checkCollection(reuse.collectionName.task);
            if (!db) return res.status(400).send(Response.projectFailResp('Task feature not enabled'));

            const task = await db.collection(reuse.collectionName.task).findOne({ _id: new ObjectId(taskId) });
            if (!task) return res.status(404).send(Response.projectFailResp('Task not found'));

            // Check task not already in another active/planning sprint
            const existingSprintWithTask = await sprintModel.findOne({
                orgId,
                projectId: sprint.projectId,
                status: { $in: ['planning', 'active'] },
                tasks: new ObjectId(taskId),
                _id: { $ne: sprint._id },
            });
            if (existingSprintWithTask) {
                return res.status(400).send(Response.projectFailResp(
                    `Task is already in sprint "${existingSprintWithTask.name}"`
                ));
            }

            // Add task
            const updated = await sprintModel.findOneAndUpdate(
                { _id: id, orgId },
                {
                    $addToSet: { tasks: new ObjectId(taskId) },
                    $set: { updatedAt: new Date() },
                },
                { new: true }
            );

            // Recalculate planned points
            await this._recalculatePlannedPoints(reuse, updated);

            const result = await sprintModel.findOne({ _id: id, orgId }).lean();
            return res.status(200).send(Response.projectSuccessResp('Task added to sprint', result));
        } catch (err) {
            Logger.error(`addTaskToSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to add task to sprint', err.message));
        }
    }

    /**
     * Remove a task from a sprint
     */
    async removeTaskFromSprint(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id, taskId } = req.params;

            const sprint = await sprintModel.findOne({ _id: id, orgId });
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            if (sprint.status === 'completed' || sprint.status === 'cancelled') {
                return res.status(400).send(Response.projectFailResp('Cannot remove tasks from a completed or cancelled sprint'));
            }

            const updated = await sprintModel.findOneAndUpdate(
                { _id: id, orgId },
                {
                    $pull: { tasks: new ObjectId(taskId) },
                    $set: { updatedAt: new Date() },
                },
                { new: true }
            );

            // Recalculate planned points
            await this._recalculatePlannedPoints(reuse, updated);

            const result = await sprintModel.findOne({ _id: id, orgId }).lean();
            return res.status(200).send(Response.projectSuccessResp('Task removed from sprint', result));
        } catch (err) {
            Logger.error(`removeTaskFromSprint error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to remove task from sprint', err.message));
        }
    }

    /**
     * Get backlog — tasks NOT in any active/planning sprint
     */
    async getBacklog(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { projectId } = req.query;
            if (!projectId) return res.status(400).send(Response.projectFailResp('projectId query param is required'));

            // Get all task IDs that are in active/planning sprints
            const activeSprints = await sprintModel.find({
                orgId,
                projectId,
                status: { $in: ['planning', 'active'] },
            }).lean();

            const sprintTaskIds = new Set();
            for (const s of activeSprints) {
                for (const t of s.tasks) {
                    sprintTaskIds.add(t.toString());
                }
            }

            // Get all tasks for this project
            const db = await checkCollection(reuse.collectionName.task);
            if (!db) return res.status(400).send(Response.projectFailResp('Task feature not enabled'));

            const allTasks = await db.collection(reuse.collectionName.task)
                .find({ projectId })
                .toArray();

            // Filter out tasks that are in sprints
            const backlogTasks = allTasks.filter(t => !sprintTaskIds.has(t._id.toString()));

            return res.status(200).send(Response.projectSuccessResp('Backlog fetched successfully', {
                totalTasks: backlogTasks.length,
                tasks: backlogTasks,
            }));
        } catch (err) {
            Logger.error(`getBacklog error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to fetch backlog', err.message));
        }
    }

    /**
     * Get velocity chart data — historical points per completed sprint
     */
    async getVelocityChart(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { projectId } = req.query;
            if (!projectId) return res.status(400).send(Response.projectFailResp('projectId query param is required'));

            const completedSprints = await sprintModel
                .find({ orgId, projectId, status: 'completed' })
                .sort({ endDate: 1 })
                .select('name velocity plannedPoints startDate endDate')
                .lean();

            const velocityData = completedSprints.map(s => ({
                sprintName: s.name,
                velocity: s.velocity,
                plannedPoints: s.plannedPoints,
                startDate: s.startDate,
                endDate: s.endDate,
            }));

            const avgVelocity = completedSprints.length > 0
                ? Math.round(completedSprints.reduce((sum, s) => sum + s.velocity, 0) / completedSprints.length)
                : 0;

            return res.status(200).send(Response.projectSuccessResp('Velocity chart data fetched', {
                sprints: velocityData,
                averageVelocity: avgVelocity,
                totalSprints: completedSprints.length,
            }));
        } catch (err) {
            Logger.error(`getVelocityChart error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to fetch velocity data', err.message));
        }
    }

    /**
     * Get burndown data for a sprint — daily remaining story points
     */
    async getBurndownData(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language } = reuse.result.userData?.userData;
        try {
            const { id } = req.params;

            const sprint = await sprintModel.findOne({ _id: id, orgId }).lean();
            if (!sprint) return res.status(404).send(Response.projectFailResp('Sprint not found'));

            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);
            const today = new Date();
            const effectiveEnd = sprint.status === 'completed' ? endDate : (today < endDate ? today : endDate);

            // Get all tasks in this sprint
            let tasks = [];
            if (sprint.tasks.length > 0) {
                const db = await checkCollection(reuse.collectionName.task);
                if (db) {
                    const taskIds = sprint.tasks.map(t => new ObjectId(t));
                    tasks = await db.collection(reuse.collectionName.task)
                        .find({ _id: { $in: taskIds } })
                        .toArray();
                }
            }

            const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);

            // Build ideal burndown line
            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const pointsPerDay = totalDays > 0 ? totalPoints / totalDays : 0;

            const idealLine = [];
            const actualLine = [];

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dayIndex = Math.ceil((d - startDate) / (1000 * 60 * 60 * 24));
                const idealRemaining = Math.max(0, totalPoints - (pointsPerDay * dayIndex));
                idealLine.push({
                    date: new Date(d).toISOString().split('T')[0],
                    points: Math.round(idealRemaining * 10) / 10,
                });

                // Actual: count points of tasks completed on or before this day
                if (d <= effectiveEnd) {
                    const completedPoints = tasks
                        .filter(t => t.taskStatus === 'Done' && t.updatedAt && new Date(t.updatedAt) <= d)
                        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
                    actualLine.push({
                        date: new Date(d).toISOString().split('T')[0],
                        points: totalPoints - completedPoints,
                    });
                }
            }

            return res.status(200).send(Response.projectSuccessResp('Burndown data fetched', {
                sprintName: sprint.name,
                totalPoints,
                idealLine,
                actualLine,
            }));
        } catch (err) {
            Logger.error(`getBurndownData error: ${err.message}`);
            return res.status(400).send(Response.projectFailResp('Failed to fetch burndown data', err.message));
        }
    }

    /**
     * Internal: Recalculate planned points for a sprint based on its tasks
     */
    async _recalculatePlannedPoints(reuse, sprint) {
        try {
            if (!sprint || !sprint.tasks || sprint.tasks.length === 0) {
                await sprintModel.findOneAndUpdate(
                    { _id: sprint._id },
                    { $set: { plannedPoints: 0 } }
                );
                return;
            }
            const db = await checkCollection(reuse.collectionName.task);
            if (!db) return;
            const taskIds = sprint.tasks.map(t => new ObjectId(t));
            const tasks = await db.collection(reuse.collectionName.task)
                .find({ _id: { $in: taskIds } })
                .toArray();
            const plannedPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
            await sprintModel.findOneAndUpdate(
                { _id: sprint._id },
                { $set: { plannedPoints } }
            );
        } catch (err) {
            Logger.error(`_recalculatePlannedPoints error: ${err.message}`);
        }
    }
}

export default new SprintService();
