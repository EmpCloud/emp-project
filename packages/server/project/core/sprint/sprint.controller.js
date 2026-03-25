import SprintService from './sprint.service.js';

class SprintController {
    async createSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Create a new sprint for a project' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.createSprint(req, res, next);
    }

    async listSprints(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'List all sprints for a project' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.listSprints(req, res, next);
    }

    async getSprintDetail(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Get sprint detail with populated tasks' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.getSprintDetail(req, res, next);
    }

    async updateSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Update sprint details' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.updateSprint(req, res, next);
    }

    async startSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Start a sprint (change status to active)' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.startSprint(req, res, next);
    }

    async completeSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Complete a sprint, calculate velocity' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.completeSprint(req, res, next);
    }

    async addTaskToSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Add a task to a sprint' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.addTaskToSprint(req, res, next);
    }

    async removeTaskFromSprint(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Remove a task from a sprint' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.removeTaskFromSprint(req, res, next);
    }

    async getBacklog(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Get backlog tasks not in any active/planning sprint' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.getBacklog(req, res, next);
    }

    async getVelocityChart(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Get velocity chart data (points per sprint)' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.getVelocityChart(req, res, next);
    }

    async getBurndownData(req, res, next) {
        /* 	#swagger.tags = ['Sprint']
            #swagger.description = 'Get burndown chart data for a sprint' */
        /* #swagger.security = [{ "AccessToken": [] }] */
        return await SprintService.getBurndownData(req, res, next);
    }
}

export default new SprintController();
