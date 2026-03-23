/**
 * Language localization
 *
 * Languages with short code
 *  __________________________________
 * |    LANGUAGE       |     CODE     |
 * |___________________|______________|
 * |    English        |     en       |
 * |    Spanish        |     es       |
 * |    Indonesian     |     idn      |
 * |    French         |     fr       |
 * |    Arabic         |     ar       |
 * |___________________|______________|
 */

/**
 * common message list
 */
export let commonMessage = {
    VALIDATION_FAILED: {
        en: 'Validation failed',
        fr: 'Validation échouée.',
    },
    COLLECTION_NOT_PRESENT: {
        en: 'collection not present in the DB',
        fr: 'collection absente de la BD',
    },
    PROJECT_NOT_EXIST: {
        en: 'Project Does not exists',
        fr: "Le projet n'existe pas",
    },
    PROJECT_ID_NOT_PRESENT: {
        en: 'Project id not present',
        fr: 'ID de projet absent',
    },
    SEARCH_SUCCESS: {
        en: 'Search result',
        fr: 'Résultat de la recherche',
    },
    'SEARCH FAILED': {
        en: 'Failed to search',
        fr: 'Échec de la recherche',
    },
    USER_NOT_FOUND: {
        en: 'User Not Found',
    },
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled',
    },
    GROUP_NOT_FOUND: {
        en: 'Group not found with given group id.',
    },
};

/**
 * comment messages list
 */
export let commentMessage = {
    COMMENT_ADDED: {
        en: 'Comment added successfully',
        fr: 'Commentaire ajouté avec succès',
    },
    COMMENT_ADDED_FAILED: {
        en: 'Failed to add the comment',
        fr: "Impossible d'ajouter le commentaire",
    },
    'COMMENT_ADDED_FAILED_INVALID_SUBTASK-ID': {
        en: 'Failed to add the comment, please check id',
        fr: "Échec de l'ajout du commentaire, ID de sous-tâche non valide",
    },
    'COMMENT_ADDED_FAILED_INVALID_TASK-ID': {
        en: 'Failed to add the comment, please check ID',
        fr: "Échec de l'ajout du commentaire, ID de tâche non valide",
    },
    COMMENT_UPDATED: {
        en: 'Comment updated successfully',
        fr: 'Commentaire mis à jour avec succès',
    },
    COMMENT_UPDATE_FAILED: {
        en: 'Failed to update the comment',
        fr: 'Échec de la mise à jour du commentaire',
    },
    COMMENT_UPDATE_FAILED_INVALID_ID: {
        en: 'Failed to update the comment, invalid comment id',
        fr: 'Échec de la mise à jour du commentaire, ID de commentaire non valide',
    },
    COMMENT_FETCHED: {
        en: 'Comment fetched successfully',
        fr: 'Commentaire récupéré avec succès',
    },
    COMMENT_NOT_FETCHED: {
        en: 'No comment found',
        fr: 'Aucun commentaire trouvé',
    },
    'COMMENT_NOT_FETCHED_INVALID_SUBTASK-ID': {
        en: 'Failed to fetch the comment, invalid subtask id',
        fr: 'Échec de la récupération du commentaire, ID de sous-tâche non valide',
    },
    'COMMENT_NOT_FETCHED_INVALID_TASK-ID': {
        en: 'Failed to fetch the comment,invalid task id',
        fr: 'Échec de la récupération du commentaire, ID de tâche non valide',
    },
    COMMENT_DELETED: {
        en: 'Comment deleted successfully',
        fr: 'Commentaire supprimé avec succès',
    },
    'COMMENT_NOT_DELETED_INVALID_SUBTASK-ID': {
        en: 'Failed to delete the comment, invalid comment id or subtask id',
        fr: 'Échec de la suppression du commentaire, ID de commentaire ou ID de sous-tâche non valide',
    },
    'COMMENT_NOT_DELETED_INVALID_TASK-ID': {
        en: 'Failed to delete the comment, invalid comment id or task id',
        fr: 'Échec de la suppression du commentaire, ID de commentaire ou ID de tâche non valide',
    },
};
/**
 * Sub-task module responses start
 */
export let subTaskMessage = {
    SUB_TASK_ALREADY_PRESENT: {
        en: 'Sub-Task already created for the Task',
        fr: 'Commentaire supprimé avec succès',
    },
    SUB_TASK_CREATED: {
        en: 'Sub-Task created successfully',
        fr: 'Commentaire supprimé avec succès',
    },
    SUB_TASK_NOT_CREATED: {
        en: 'Failed to create the sub-task',
        fr: 'Commentaire supprimé avec succès',
    },
    SUB_TASKS_FETCHED: {
        en: 'Sub-Tasks fetched successfully',
        fr: 'Sous-tâches récupérées avec succès',
    },
    SUB_TASKS_NOT_FETCHED: {
        en: 'Failed to fetch sub-tasks',
        fr: 'Échec de la récupération des sous-tâches',
    },
    SUB_TASK_SEARCH_FAIL: {
        en: 'Fail to search sub-tasks',
    },
    'SUB_TASK_NOT_FETCHED_INVALID-ID': {
        en: 'Failed to fetch. Invalid sub-task Id',
        fr: 'Échec de la récupération. ID de sous-tâche non valide',
    },
    SUB_TASK_UPDATED: {
        en: 'Sub-Task updated successfully',
        fr: 'Sous-tâche mise à jour avec succès',
    },
    'SUB_TASK_NOT_UPDATED_INVALID-SUBTASK-ID': {
        en: 'Failed to update. Invalid sub-task Id',
        fr: 'Échec de mise à jour. ID de sous-tâche non valide',
    },
    'SUB_TASK_DELETED_BY-ID': {
        en: 'Sub-Task deleted by id : ',
        fr: 'Sous-tâche supprimée par identifiant :',
    },
    'SUB_TASK_NOT_DELETED_INVALID-SUBTASK-ID': {
        en: 'Failed to delete the Invalid sub-task Id',
        fr: "Échec de la suppression de l'ID de sous-tâche non valide",
    },
    SUB_TASKS_DELETED: {
        en: 'Sub-Tasks deleted successfully',
        fr: 'Sous-tâches supprimées avec succès',
    },
    SUB_TASKS_NOT_DELETED: {
        en: 'Failed to delete Invalid Task Id',
        fr: "Échec de la suppression de l'ID de tâche non valide",
    },
    'INVALID_SUBTASK-ID': {
        en: 'Invalid subtask id',
        fr: 'ID de sous-tâche invalide',
    },
    NO_SUBTASK_ACTIVITY: {
        en: 'No subtask activity found ',
        fr: 'aucune activité de sous-tâche trouvée',
    },
    SUBTASK_ACTIVITY_FETCHED: {
        en: 'SubTask Activity fetched successfully',
        fr: 'Activité de sous-tâche récupérée avec succès',
    },
    'SUBTASK_ACTIVITY_NOT_FETCHED_INVALID-SUBTASK-ID': {
        en: 'Failed to fetch Activity, Invalid subtask Id',
        fr: "Échec de la récupération de l'activité, ID de sous-tâche non valide",
    },
    SUBTASK_ACTIVITY_DELETED: {
        en: 'SubTask Activity deleted successfully',
        fr: 'Activité de sous-tâche supprimée avec succès',
    },
    'SUBTASK_ACTIVITY_NOT_DELETED_INVALID-SUBTASK-ID': {
        en: 'Failed to delete activity. Invalid subtask Id or activity Id',
        fr: "Échec de la suppression de l'activité. ID de sous-tâche ou d'activité non valide",
    },
    SUBTASK_PLAN_LIMIT: {
        en: 'SubTask adding limit is reached in your plan, please upgrade your plan.',
    },
    'SUBTASK-STATUS_NOT_PRESENT': {
        en: 'Invalid SubTask Status,Please enter valid SubTask Status.',
    },
    'SUBTASK-TYPE_NOT_PRESENT': {
        en: 'Invalid SubTask type,Please enter valid SubTask type.',
    },
    ENABLE_TO_CREATE_SUBTASK: {
        en: 'Can not create subtask under this task. As status of this task is done',
    },
};
/**
 * Sub-Task_Status module responses start
 */
export let subTaskStatusMessage = {
    'SUBTASK-STATUS_PRESENT': {
        en: 'SubTask Status already present.',
        fr: 'État de la sous-tâche déjà présent.',
    },
    'SUBTASK-STATUS_CREATED': {
        en: 'Subtask status created successfully',
        fr: 'Statut de la sous-tâche créé avec succès',
    },
    'SUBTASK-STATUS_NOT_CREATED': {
        en: 'Failed to create sub-task status.',
        fr: "Échec de la création de l'état de la sous-tâche.",
    },
    'SUBTASK-STATUS_FETCHED': {
        en: 'SubTask Status fetched successfully',
        fr: 'État de la sous-tâche récupéré avec succès',
    },
    'SUBTASK-STATUS_NOT_FETCHED': {
        en: 'Failed to fetch the subtask status.',
        fr: "Échec de la récupération de l'état de la sous-tâche.",
    },
    'SUBTASK-STATUS_NOT_FETCHED_INVALID-ID': {
        en: 'Failed to fetch the subtask status. Invalid subtask status Id',
        fr: "Échec de la récupération de l'état de la sous-tâche. ID d'état de sous-tâche non valide",
    },
    'SUBTASK-STATUS_UPDATED': {
        en: 'SubTask Status updated successfully',
        fr: 'État de la sous-tâche mis à jour avec succès',
    },
    'SUBTASK-STATUS_NOT_UPDATED': {
        en: 'Failed to update subtask status. Invalid subtask status Id',
        fr: "Échec de la mise à jour de l'état de la sous-tâche. ID d'état de sous-tâche non valide",
    },
    'SUBTASK-STATUS_DELETED': {
        en: 'Deleted  SubTask Status successfully',
        fr: 'Statut de la sous-tâche supprimé avec succès',
    },
    'SUBTASK-STATUS_NOT_DELETED_INVALID-ID': {
        en: 'Failed to delete subtask status. Invalid subtask status Id',
        fr: "Échec de la suppression de l'état de la sous-tâche. ID d'état de sous-tâche non valide",
    },
    'SUBTASK-STATUS_NOT_DELETED': {
        en: 'Failed to delete subtask status. Invalid subtask status Id',
        fr: "Échec de la suppression de l'état de la sous-tâche.",
    },
    'SUBTASK-STATUS_FAILED': {
        en: 'Subtask status not added or deleted already.',
        fr: "L'état de la sous-tâche n'a pas encore été ajouté ou supprimé.",
    },
    SUBTASK_STATUS_PLAN_LIMIT: {
        en: 'SubTask Status adding limit is reached in your plan, please upgrade your plan.',
    },
    SUBTASK_STATUS_DEFAULT: {
        en: 'Cannot update/delete default status.',
    },
};
/**
 * Sub-Task_Type module responses start
 */
export let subTaskTypeMessage = {
    'SUBTASK-TYPE_PRESENT': {
        en: 'SubTask Type already present.',
        fr: 'Type de sous-tâche déjà présent.',
    },
    'SUBTASK-TYPE_CREATED': {
        en: 'Subtask Type created successfully.',
        fr: 'Type de sous-tâche créé avec succès.',
    },
    'SUBTASK-TYPE_NOT_CREATED': {
        en: 'Failed to create sub-task Type.',
        fr: 'Échec de la création du type de sous-tâche.',
    },
    'SUBTASK-TYPE_FETCHED': {
        en: 'SubTask Type fetched successfully',
        fr: 'Type de sous-tâche récupéré avec succès',
    },
    'SUBTASK-TYPE_NOT_FETCHED': {
        en: 'Failed to fetch the subtask Type.',
        fr: 'Échec de la récupération du type de sous-tâche.',
    },
    'SUBTASK-TYPE_NOT_FETCHED_INVALID-ID': {
        en: 'Failed to fetch the subtask Type. Invalid subtask Type Id',
        fr: 'Échec de la récupération du type de sous-tâche. ID de type de sous-tâche non valide',
    },
    'SUBTASK-TYPE_UPDATED': {
        en: 'SubTask Type updated successfully',
        fr: 'Type de sous-tâche mis à jour avec succès',
    },
    'SUBTASK-TYPE_NOT_UPDATED': {
        en: 'Failed to update subtask Type. Invalid subtask Type Id',
        fr: 'Échec de la mise à jour du type de sous-tâche. ID de type de sous-tâche non valide',
    },
    'SUBTASK-TYPE_DELETED': {
        en: 'Deleted  SubTask Type successfully',
        fr: 'Type de sous-tâche supprimé avec succès',
    },
    'SUBTASK-TYPE_NOT_DELETED_INVALID-ID': {
        en: 'Failed to delete subtask Type. Invalid subtask Type Id',
        fr: 'Échec de la suppression du type de sous-tâche. ID de type de sous-tâche non valide',
    },
    'SUBTASK-TYPE_NOT_DELETED': {
        en: 'Failed to delete subtask Type.',
        fr: 'Échec de la suppression du type de sous-tâche.',
    },
    'SUBTASK-TYPE_FAILED': {
        en: 'Subtask Type not added or deleted already.',
        fr: "Le type de sous-tâche n'a pas encore été ajouté ou supprimé.",
    },
    SUBTASK_TYPE_PLAN_LIMIT: {
        en: 'SubTask Type adding limit is reached in your plan, please upgrade your plan.',
    },
    SUBTASK_TYPE_DEFAULT: {
        en: 'Cannot update/delete default types.',
        fr: 'Impossible de mettre à jour/supprimer les types par défaut.',
    },
};
/**
 * Task module responses starts
 */
export let taskMessage = {
    TASK_ALREADY_PRESENT: {
        en: 'Task already created for the project',
        fr: 'Tâche déjà créée pour le projet',
    },
    TASK_CREATED: {
        en: 'Task created successfully',
        fr: 'Tâche créée avec succès',
    },
    TASK_NOT_CREATED: {
        en: 'Failed to create the task',
        fr: 'Échec de la création de la tâche',
    },
    TASK_FETCHED: {
        en: 'Tasks fetched successfully',
        fr: 'Tâches récupérées avec succès',
    },
    TASK_FETCHING_FAILED: {
        en: 'Failed to fetch tasks',
        fr: 'échec de la récupération des tâches',
    },
    TASK_NOT_PRESENT: {
        en: 'Tasks not present',
        fr: 'tâches non présentes',
    },
    TASK_NOT_IN_PROJECT: {
        en: 'Under this project tasks are not present',
        fr: 'dans le cadre de ce projet, les tâches ne sont pas présentes',
    },
    FETCH_TASK_FAILED_ID: {
        en: 'Failed to fetch tasks,Id is invalid',
        fr: "Échec de la récupération des tâches, l'ID n'est pas valide",
    },
    TASK_UPDATED: {
        en: 'Task updated',
        fr: 'Tâche mise à jour',
    },
    TASK_UPDATE_FAILED: {
        en: 'Failed to update task.',
        fr: 'Échec de la mise à jour de la tâche.',
    },
    UPDATE_FAILED_INVALID_TASK_ID: {
        en: 'Failed to update task. Invalid task Id',
        fr: 'Échec de la mise à jour de la tâche. ID de tâche non valide',
    },
    TASK_DELETED: {
        en: 'Tasks deleted successfully',
        fr: 'tâches supprimées avec succès',
    },
    ALL_TASK_DELETED: {
        en: 'All tasks are deleted successfully',
        fr: 'toutes les tâches sont supprimées avec succès',
    },
    DELETE_FAILED_INVALID_TASK_ID: {
        en: 'Failed to delete task. Invalid task Id',
        fr: 'Échec de la suppression de la tâche. ID de tâche non valide',
    },
    TASK_DELETE_FAILED: {
        en: 'Failed to delete task',
        fr: 'Échec de la suppression de la tâche.',
    },
    TASKS_NOT_PRESENT: {
        en: 'Tasks are not present',
        fr: 'Les tâches ne sont pas présentes',
    },
    TASKS_NOT_FOUND: {
        en: 'Task not found',
        fr: 'Tâche introuvable',
    },
    TASK_ACTIVITY_SUCCESS: {
        en: 'Task Activity fetched successfully',
        fr: 'Activité de tâche récupérée avec succès',
    },
    ACTIVITY_NOT_FOUND: {
        en: 'Activity not found',
        fr: 'Activité introuvable',
    },
    TASK_ACTIVITY_DELETED: {
        en: 'Task Activity deleted successfully',
        fr: 'Activité de tâche supprimée avec succès',
    },
    TASK_ACTIVITY_NOT_PRESENT: {
        en: 'No task activity found',
        fr: 'aucune activité de tâche trouvée',
    },
    DELETE_ACTIVITY_FAILED_INVALID_ID: {
        en: 'Failed to delete the Invalid task Id or activity Id',
        fr: "Échec de la suppression de l'ID de tâche ou de l'activité non valide",
    },
    TASK_PLAN_LIMIT: {
        en: 'Task adding limit is reached in your plan, please upgrade your plan.',
    },
    GROUP_NOT_FOUND: {
        en: 'Group not found with given group id.',
    },
    USER_PRESENT_ALREADY: {
        en: 'User already exists Please Add another User.',
    },
    MEMBER_REMOVE_SUCCESS: {
        en: 'Member removed successfully.',
    },
    TASK_STAGE_NOT_FOUND: {
        en: 'Invalid Task stage, Please enter valid task stage',
    },
    TASK_STATUS_NOT_FOUND: {
        en: 'Invalid Task status, Please enter valid task status',
    },
    TASK_TYPE_NOT_FOUND: {
        en: 'Invalid Task type, Please enter valid task type',
    },
    TASK_NOT_DONE: {
        en: 'Can not delete incomplete tasks',
    },
    ENABLE_TO_CREATE_TASK: {
        en: 'Can not create task under this project. As status of project is done',
    },

};
/**
 * Task_Category module responses start
 */
export let taskCategoryMessage = {
    TASK_CATEGORY_PRESENT: {
        en: 'Task category already present',
        fr: 'Catégorie de tâche déjà présente',
    },
    TASK_CATEGORY_CREATED: {
        en: 'Task category created successfully',
        fr: 'Catégorie de tâche créée avec succès',
    },
    TASK_CATEGORY_NOT_CREATED: {
        en: 'Error while creating task category',
        fr: 'Erreur lors de la création de la catégorie de tâche',
    },
    TASK_CATEGORY_FETCHED: {
        en: 'Task category fetched successfully',
        fr: 'Catégorie de tâche récupérée avec succès',
    },
    TASK_CATEGORY_NOT_FETCHED: {
        en: 'Failed to fetch the task category. Invalid task category Id',
        fr: 'Échec de la récupération de la catégorie de tâche. ID de catégorie de tâche non valide',
    },
    TASK_CATEGORY_UPDATED: {
        en: 'Task category updated successfully',
        fr: 'Catégorie de tâche mise à jour avec succès',
    },
    TASK_CATEGORY_NOT_UPDATED: {
        en: 'Failed to update the task category. Invalid task category Id',
        fr: 'Échec de la mise à jour de la catégorie de tâche. ID de catégorie de tâche non valide',
    },
    TASK_CATEGORY_DELETED: {
        en: 'Deleted  Task category successfully',
        fr: 'Catégorie de tâche supprimée avec succès',
    },
    TASK_CATEGORY_NOT_DELETED: {
        en: 'Failed to delete the task category. Invalid task category Id',
        fr: 'Échec de la suppression de la catégorie de tâche. ID de catégorie de tâche non valide',
    },
    TASK_CATEGORY_UNAVAILABLE: {
        en: 'Task category not added or already deleted.',
        fr: 'Catégorie de tâche non ajoutée ou déjà supprimée.',
    },
    TASK_CATEGORY_EXCEEDED: {
        en: 'Failed. Cannot add custom task category, more than ',
        fr: "Manqué. Impossible d'ajouter une catégorie de tâche personnalisée, plus de",
    },
    TASK_CATEGORY_DEFAULT: {
        en: 'Cannot update/delete default category.',
        fr: 'Impossible de mettre à jour/supprimer la catégorie par défaut.',
    },
    TASK_CATEGORY_PLAN_LIMIT: {
        en: 'Task Category adding limit is reached in your plan, please upgrade your plan.',
    },
    TASK_CATEGORY_DELETE_FAILED: {
        en: 'Cannot delete task category if assigned to any task or subtask.',
    },
    TASK_CATEGORY_CANNOT_DELETED: {
        en: 'Failed to delete the task category.It is assigned to task or subtask',
    },
};
/**
 * Task_Stage module responses start
 */
export let taskStageMessage = {
    TASK_STAGE_PRESENT: {
        en: 'Task stage already present',
        fr: 'Étape de tâche déjà présente',
    },
    TASK_STAGE_CREATED: {
        en: 'Task stage created successfully',
        fr: "L'étape de la tâche a été créée avec succès",
    },
    TASK_STAGE_NOT_CREATED: {
        en: 'Error while creating task stage',
        fr: "Erreur lors de la création de l'étape de la tâche",
    },
    TASK_STAGE_FETCHED: {
        en: 'Task stage fetched successfully',
        fr: "L'étape de la tâche a été récupérée avec succès",
    },
    TASK_STAGE_NOT_FETCHED: {
        en: 'Failed to fetch the task stage. Invalid task stage Id',
        fr: "Échec de la récupération de l'étape de la tâche. ID d'étape de tâche non valide",
    },
    TASK_STAGE_UPDATED: {
        en: 'Task stage updated successfully',
        fr: "L'étape de la tâche a été mise à jour avec succès",
    },
    TASK_STAGE_NOT_UPDATED: {
        en: 'Failed to update the task stage. Invalid task stage Id',
        fr: "Échec de la mise à jour de l'étape de la tâche. ID d'étape de tâche non valide",
    },
    TASK_STAGE_DELETED: {
        en: 'Deleted  Task stage successfully',
        fr: 'Étape de tâche supprimée avec succès',
    },
    TASK_STAGE_NOT_DELETED: {
        en: 'Failed to delete the task stage. Invalid task stage Id',
        fr: "Échec de la suppression de l'étape de la tâche. ID d'étape de tâche non valide",
    },
    TASK_STAGE_UNAVAILABLE: {
        en: 'Task stage not added or already deleted.',
        fr: 'Étape de tâche non ajoutée ou déjà supprimée.',
    },
    TASK_STAGE_EXCEEDED: {
        en: 'Failed. Cannot add custom task stage, more than ',
        fr: "Manqué. Impossible d'ajouter une étape de tâche personnalisée, plus de",
    },
    TASK_STAGE_DEFAULT: {
        en: 'Cannot update/delete default stage.',
        fr: "Impossible de mettre à jour/supprimer l'étape par défaut.",
    },
    TASK_STAGE_PLAN_LIMIT: {
        en: 'Task Stage adding limit is reached in your plan, please upgrade your plan.',
    },
    TASK_STAGE_DELETE_FAILED: {
        en: 'Cannot delete task stage if assigned to any task or subtask.',
    },
    TASK_STAGE_CANNOT_DELETED: {
        en: 'Failed to delete the task stage.It is assigned to task or subtask',
    },
};
/**
 * Task_Status module responses start
 */
export let taskStatusMessage = {
    TASK_STATUS_PRESENT: {
        en: 'Task status already present',
        fr: 'Statut de la tâche déjà présent',
    },
    TASK_STATUS_CREATED: {
        en: 'Task status created successfully',
        fr: 'Statut de la tâche créé avec succès',
    },
    TASK_STATUS_NOT_CREATED: {
        en: 'Error while creating task status',
        fr: "Erreur lors de la création de l'état de la tâche",
    },
    TASK_STATUS_FETCHED: {
        en: 'Task status fetched successfully',
        fr: 'État de la tâche récupéré avec succès',
    },
    TASK_STATUS_NOT_FETCHED: {
        en: 'Failed to fetch the task status. Invalid task status Id',
        fr: "Échec de la récupération de l'état de la tâche. ID d'état de tâche non valide",
    },
    TASK_STATUS_NOT_FOUND: {
        en: 'Task status not found',
        fr: 'État de la tâche introuvable',
    },
    TASK_STATUS_UPDATED: {
        en: 'Task status updated successfully',
        fr: 'État de la tâche mis à jour avec succès',
    },
    TASK_STATUS_NOT_UPDATED: {
        en: 'Failed to update the task status. Invalid task status Id',
        fr: "Échec de la mise à jour de l'état de la tâche. ID d'état de tâche non valide",
    },
    TASK_STATUS_DELETED: {
        en: 'Deleted  Task status successfully',
        fr: 'Statut de la tâche supprimée avec succès',
    },
    TASK_STATUS_NOT_DELETED: {
        en: 'Failed to delete the task status. Invalid task status Id',
        fr: "Échec de la suppression de l'état de la tâche. ID d'état de tâche non valide",
    },
    TASK_STATUS_UNAVAILABLE: {
        en: 'Task status not added or already deleted.',
        fr: 'Statut de la tâche non ajouté ou déjà supprimé.',
    },
    TASK_STATUS_NOT_PRESENT: {
        en: 'Failed to delete the task status.  task status not present',
        fr: "Échec de la suppression de l'état de la tâche. état de la tâche non présent",
    },
    TASK_STATUS_EXCEEDED: {
        en: 'Failed. Cannot add custom task status, more than ',
        fr: "Manqué. Impossible d'ajouter un statut de tâche personnalisé, plus de",
    },
    TASK_STATUS_DEFAULT: {
        en: 'Cannot update/delete default status.',
        fr: 'Impossible de mettre à jour/supprimer le statut par défaut.',
    },
    TASK_STATUS_PLAN_LIMIT: {
        en: 'Task Status adding limit is reached in your plan, please upgrade your plan.',
    },
    TASK_STATUS_DELETE_ERROR: {
        en: 'Error whilte deleting task status.',
    },
    TASK_STATUS_DELETE_FAILED: {
        en: 'Cannot delete task status if assigned to any task or subtask.',
    }
};
/**
 * Task_Type module responses start
 */
export let taskTypeMessage = {
    TASK_TYPE_PRESENT: {
        en: 'Task type already present',
        fr: 'Type de tâche déjà présent',
    },
    TASK_TYPE_CREATED: {
        en: 'Task type created successfully',
        fr: 'Type de tâche créé avec succès',
    },
    TASKTYPE_NOT_CREATED: {
        en: 'Error while creating task type',
        fr: 'Erreur lors de la création du type de tâche',
    },
    TASK_TYPE_FETCHED: {
        en: 'Task type fetched successfully',
        fr: 'Type de tâche récupéré avec succès',
    },
    TASK_TYPE_NOT_FETCHED: {
        en: 'Failed to fetch the task type. Invalid task type Id',
        fr: 'Échec de la récupération du type de tâche. ID de type de tâche non valide',
    },
    TASK_TYPE_NOT_FOUND: {
        en: 'Task type not found',
        fr: 'Type de tâche introuvable',
    },
    TASK_TYPE_UPDATED: {
        en: 'Task type updated successfully',
        fr: 'Type de tâche mis à jour avec succès',
    },
    TASK_TYPE_NOT_UPDATED: {
        en: 'Failed to update the task type. Invalid task type Id',
        fr: 'Échec de la mise à jour du type de tâche. ID de type de tâche non valide',
    },
    TASK_TYPE_DELETED: {
        en: 'Deleted  Task type successfully',
        fr: 'Type de tâche supprimé avec succès',
    },
    TASK_TYPE_NOT_DELETED: {
        en: 'Failed to delete the task type. Invalid task type Id',
        fr: "Échec de la suppression de l'état de la tâche. ID de type de tâche non valide",
    },
    TASK_TYPE_UNAVAILABLE: {
        en: 'Task type not added or already deleted',
        fr: 'Type de tâche non ajouté ou déjà supprimé',
    },
    TASK_TYPE_NOT_PRESENT: {
        en: 'Failed to delete the task type.  task type not present',
        fr: 'Échec de la suppression du type de tâche. type de tâche non présent',
    },
    TASK_TYPE_EXCEEDED: {
        en: 'Failed. Cannot add custom task types, more than ',
        fr: "Manqué. Impossible d'ajouter des types de tâches personnalisés, plus de",
    },
    TASK_TYPE_DEFAULT: {
        en: 'Cannot update/delete default types.',
        fr: 'Impossible de mettre à jour/supprimer les types par défaut.',
    },
    TASK_TYPE_PLAN_LIMIT: {
        en: 'Task Type adding limit is reached in your plan, please upgrade your plan.',
    },
    TASK_TYPE_DELETE_FAILED: {
        en: 'Cannot delete task type if assigned to any task or subtask.',
    }
};

export let PermissionMiddlewareMessage = {
    ACCESS_DENIED: {
        en: 'You are not allowed to access this route.',
    },
    FAILED_ACCESS: {
        en: 'Something went wrong. Please visit permission page',
    },
};
