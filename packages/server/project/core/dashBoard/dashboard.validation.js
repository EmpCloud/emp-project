import Joi from 'joi';

class DashboardValidation {
    updateDashboardConfig(body) {
        const schema = Joi.object().keys({
            project_grid_XL: Joi.number().default(1).valid(0, 1),
            project_grid_Large: Joi.number().default(0).valid(0, 1),
            project_grid_small: Joi.number().default(0).valid(0, 1),
            project_task: Joi.number().default(1).valid(0, 1),
            project_recent: Joi.number().default(0).valid(0, 1),
            project_member_grid: Joi.number().default(0).valid(0, 1),
            project_budget_grid: Joi.number().default(0).valid(0, 1),
            project_progress: Joi.number().default(1).valid(0, 1),

            project_subtask: Joi.number().default(0).valid(0, 1),
            project_by_status: Joi.number().default(1).valid(0, 1),
            project_stage_grid: Joi.number().default(1).valid(0, 1),

            project_status: {
                project_completed_grid: Joi.number().default(0).valid(0, 1),
                project_inprogress_grid: Joi.number().default(0).valid(0, 1),
                Project_ToDo_grid: Joi.number().default(0).valid(0, 1),
                Project_onHold_grid: Joi.number().default(0).valid(0, 1),
                Project_inReview_grid: Joi.number().default(0).valid(0, 1),
            },

            task_grid_XL: Joi.number().default(1).valid(0, 1),
            task_grid_Large: Joi.number().default(0).valid(0, 1),
            task_grid_small: Joi.number().default(0).valid(0, 1),
            task_recent: Joi.number().default(0).valid(0, 1),
            task_subtasks: Joi.number().default(0).valid(0, 1),
            task_member_grid: Joi.number().default(0).valid(0, 1),
            task_progress: Joi.number().default(1).valid(0, 1),

            task_priority: Joi.number().default(1).valid(0, 1),
            task_type: Joi.number().default(0).valid(0, 1),
            task_category: Joi.number().default(0).valid(0, 1),

            task_status: {
                task_completed_grid: Joi.number().default(0).valid(0, 1),
                task_inprogress_grid: Joi.number().default(0).valid(0, 1),
                task_ToDo_grid: Joi.number().default(0).valid(0, 1),
                task_onHold_grid: Joi.number().default(0).valid(0, 1),
                task_inReview_grid: Joi.number().default(0).valid(0, 1),
            },
            subTask_status: {
                subTask_completed_grid: Joi.number().default(0).valid(0, 1),
                subTask_inprogress_grid: Joi.number().default(0).valid(0, 1),
                subTask_ToDo_grid: Joi.number().default(0).valid(0, 1),
                subTask_onHold_grid: Joi.number().default(0).valid(0, 1),
                subTask_inReview_grid: Joi.number().default(0).valid(0, 1),
            },

            subtask_grid_XL: Joi.number().default(1).valid(0, 1),
            subtask_grid_Large: Joi.number().default(0).valid(0, 1),
            subtask_grid_small: Joi.number().default(0).valid(0, 1),
            subtask_recent: Joi.number().default(0).valid(0, 1),
            subtask_member_grid: Joi.number().default(0).valid(0, 1),
            subtask_progress: Joi.number().default(1).valid(0, 1),

            subtask_priority: Joi.number().default(1).valid(0, 1),
            subtask_type: Joi.number().default(0).valid(0, 1),
            subtask_category: Joi.number().default(0).valid(0, 1),
            subtask_status: Joi.number().default(1).valid(0, 1),

            status: {
                subTask_completed_grid: Joi.number().default(0).valid(0, 1),
                subTask_inprogress_grid: Joi.number().default(0).valid(0, 1),
                subTask_ToDo_grid: Joi.number().default(0).valid(0, 1),
                subTask_onHold_grid: Joi.number().default(0).valid(0, 1),
                subTask_inReview_grid: Joi.number().default(0).valid(0, 1),
            },

            roles_grid: Joi.number().default(1).valid(0, 1),
            project_roles_grid: Joi.number().default(1).valid(0, 1),
            task_roles_grid: Joi.number().default(0).valid(0, 1),
            subtask_roles_grid: Joi.number().default(0).valid(0, 1),
            member_roles_grid: Joi.number().default(0).valid(0, 1),
            custom_roles_grid: Joi.number().default(0).valid(0, 1),
            roles_progress_grid: Joi.number().default(1).valid(0, 1),

            member_grid_XL: Joi.number().default(1).valid(0, 1),
            member_grid_Large: Joi.number().default(0).valid(0, 1),
            member_grid_small: Joi.number().default(0).valid(0, 1),
            project_members_grid: Joi.number().default(1).valid(0, 1),
            task_members_grid: Joi.number().default(0).valid(0, 1),
            subtask_members_grid: Joi.number().default(0).valid(0, 1),
            roles_member_grid: Joi.number().default(0).valid(0, 1),
            role_wise_members: Joi.number().default(1).valid(0, 1),
            permission_members_grid: Joi.number().default(0).valid(0, 1),
            members_progress_grid: Joi.number().default(1).valid(0, 1),

            permission_grid: Joi.number().default(1).valid(0, 1),
            project_permission_grid: Joi.number().default(1).valid(0, 1),
            task_permission_grid: Joi.number().default(0).valid(0, 1),
            subtask_permission_grid: Joi.number().default(0).valid(0, 1),
            member_permission_grid: Joi.number().default(0).valid(0, 1),
            custom_permission_grid: Joi.number().default(0).valid(0, 1),
            permission_progress_grid: Joi.number().default(1).valid(0, 1),

            activity_grid: Joi.number().default(1).valid(0, 1),
            project_Activity_grid: Joi.number().default(0).valid(0, 1),
            task_activity_grid: Joi.number().default(0).valid(0, 1),
            subtask_activity_grid: Joi.number().default(0).valid(0, 1),
            activity_progress_grid: Joi.number().default(1).valid(0, 1),
            activity_Main_categories_grid: Joi.number().default(1).valid(0, 1),
            activity_filter: Joi.number().default(0).valid(0, 1),

            comments_grid: Joi.number().default(1).valid(0, 1),
            project_comments_grid: Joi.number().default(1).valid(0, 1),
            task_comments_grid: Joi.number().default(0).valid(0, 1),
            subtask_comments_grid: Joi.number().default(0).valid(0, 1),
            member_comments_grid: Joi.number().default(0).valid(0, 1),
            comments_progress_grid: Joi.number().default(1).valid(0, 1),

            files_grid: Joi.number().default(1).valid(0, 1),
            categories_files: Joi.number().default(0).valid(0, 1),
            project_files_grid: Joi.number().default(1).valid(0, 1),
            task_files_grid: Joi.number().default(0).valid(0, 1),
            subtask_files_grid: Joi.number().default(0).valid(0, 1),

            links_grid: Joi.number().default(1).valid(0, 1),
            project_links_grid: Joi.number().default(1).valid(0, 1),
            task_links_grid: Joi.number().default(0).valid(0, 1),
            subtask_links_grid: Joi.number().default(1).valid(0, 1),
            members_links_grid: Joi.number().default(1).valid(0, 1)
        });
        const result = schema.validate(body);
        return result;
    }
}
export default new DashboardValidation();
