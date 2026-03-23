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

//MultiLanguage responses for Project

export let commonMessage = {
    SUCCESS:{
        en:'Success'
    },
    COMMON_ERROR: {
        en: 'Error Found: ',
    },
    VALIDATION_FAILED: {
        en: 'Validation Failed!.',
    },
    USER_ID_NOT_EXIST: {
        en: 'User Id not found. Please check provided user Id.'
    },
    USERNAME_FOUND:{
        en:'User not found. Please provide valid username'
    },
    ADMIN_NOT_FOUND:{
        en:'Admin does not exist!'
    },
    SOMETHING_WENT_WRONG:{
        en:'Something went wrong!'
    }
};
export let projectMessageNew = {
    ACCESS_DENIED: {
        en: 'Access Denied',
        es: 'acceso denegado',
        idn: 'akses ditolak',
        ar: 'تم الرفض',
        fr: 'accès refusé',
    },
    VALIDATION_FAILED: {
        en: 'Validation failed.',
        es: 'Validación fallida.',
        idn: 'Validasi gagal',
        ar: 'فشل التحقق من الصحة.s',
        fr: 'Validation échouée.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
        es: 'la colección no está presente en la base de datos',
        ind: 'koleksi tidak ada dalam database',
        ar: 'المجموعة غير موجودة في قاعدة البيانات',
        fr: "la collection n est pas présente dans l'a base de données",
    },
    PROJECT_CREATE_FAILED: {
        en: 'Failed to create project.',
        es: 'no se pudo crear el proyecto',
        ind: 'gagal membuat proyek',
        ar: ' فشل في إنشاء المشروع',
        fr: 'échec de la création du projet',
    },
    PROJECT_CREATE_SUCCESS: {
        en: 'Project created successfully.',
        es: 'proyecto creado con exito',
        ind: 'proyek berhasil dibuat',
        ar: 'تم إنشاء المشروع بنجاح',
        fr: 'projet créé avec succès',
    },
    USER_NOT_FOUND: {
        en: 'User not found.',
        es: 'usuario no encontrado',
        ind: 'pengguna tidak ditemukan',
        ar: 'لم يتم العثور على المستخدم',
        fr: 'utilisateur non trouvé',
    },
    PROJECT_NAME_EXIST: {
        en: 'Project Name Already Exist, please check project name',
        es: 'El nombre del proyecto ya existe',
        ind: 'Nama Proyek Sudah Ada',
        ar: 'اسم المشروع موجود بالفعل',
        fr: 'Le nom du projet existe déjà',
    },
    PROJECT_CODE_EXIST: {
        en: 'Project Code Already Exist, please check project code.',
    },
    PROJECT_EXIST: {
        en: 'Project already exist.',
    },
    PROJECT_NOT_EXIST: {
        en: 'Project does not exist.',
    },
    PROJECT_FAIL_EXIST: {
        en: 'Failed to check project.',
    },
    PROJECT_FETCH_SUCCESS: {
        en: 'Project fetched successfully.',
        es: 'proyecto obtenido con éxito',
        ind: 'proyek berhasil diambil',
        ar: 'تم جلب المشروع بنجاح',
        fr: 'projet récupéré avec succès',
    },
    PROJECT_ID_NOT_FOUND: {
        en: 'Project ID not found.',
        es: 'ID del proyecto no encontrado',
        ind: 'id proyek tidak ditemukan',
        ar: 'معرف المشروع غير موجود',
        fr: 'ID de projet introuvable',
    },
    PROJECT_FETCH_FAIL: {
        en: 'Failed to fetch project, please check project ID.',
        es: 'no se pudo obtener el proyecto, verifique la identificación del proyecto',
        ind: 'gagal mengambil proyek, harap periksa ID proyek',
        ar: 'فشل في إحضار المشروع ، يرجى التحقق من معرف المشروع',
        fr: 'Échec de la récupération du projet, veuillez vérifier lID du projet',
    },
    PROJECT_UPDATE_SUCCESS: {
        en: 'Project updated successfully.',
        es: 'Proyecto actualizado con éxito',
        ind: 'Proyek berhasil diperbarui',
        ar: 'تم تحديث المشروع بنجاح',
        fr: 'Projet mis à jour avec succès',
    },
    PROJECT_UPDATE_FAIL: {
        en: 'Failed to updated project, please check project ID.',
        es: 'no se pudo actualizar el proyecto, verifique la identificación del proyecto',
        ind: 'gagal memperbarui proyek, harap periksa id proyek',
        ar: 'فشل تحديث المشروع ، يرجى التحقق من معرف المشروع',
        fr: 'échec de la mise à jour du projet, veuillez vérifier lID du projet',
    },
    PROJECT_DELETE_SUCCESS: {
        en: 'Project deleted successfully.',
        es: 'proyecto eliminado con exito',
        ind: 'proyek berhasil dihapus',
        ar: 'تم حذف المشروع بنجاح',
        fr: 'projet supprimé avec succès',
    },
    PROJECT_DELETE_FAIL: {
        en: 'Failed to delete project, please check project ID.',
        es: 'no se pudo eliminar el proyecto, verifique la identificación del proyecto',
        ind: 'gagal menghapus proyek, harap periksa id proyek',
        ar: 'فشل في حذف المشروع ، يرجى التحقق من معرف المشروع',
        fr: 'Échec de la suppression du projet, veuillez vérifier lID du projet',
    },
    PROJECT_DELETE_FAILED: {
        en: 'Projects are not present in database.',
        es: 'los proyectos no están presentes en la base de datos',
        ind: 'proyek tidak ada dalam database',
        ar: 'المشاريع غير موجودة في قاعدة البيانات',
        fr: 'les projets ne sont pas présents dans la base de données',
    },
    PROJECT_SEARCH: {
        en: 'Search result.',
        es: 'Resultado de búsqueda.',
        ind: 'Hasil pencarian.',
        ar: 'نتيجة البحث.',
        fr: 'Résultat de la recherche.',
    },
    PROJECT_SEARCH_FAIL: {
        en: 'Failed to search.',
        es: 'no se pudo buscar',
        ind: 'Gagal menelusuri',
        ar: 'فشل البحث',
        fr: 'Échec de la recherche',
    },
    PROJECT_NOT_FOUND: {
        en: 'Projects not found.',
    },
    FEATURE_NOT_ENABLED: {
        en: 'Project feature is not enabled',
    },
    PROJECT_PLAN_LIMIT: {
        en: 'Projects adding limit is reached in your plan, please upgrade your plan.',
    },
    PROJECT_CODE_EXISTS: {
        en: 'This project code already exists with other project.',
    },
    FIELD_NOT_SELECTED: {
        en: 'Plese select atleast one field',
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
    USER_DELETE_ACCESS: {
        en: "You don't have the access to delete all the comments",
    },
    PROJECT_ANALYTICS_FETCHED: {
        en: 'Projects analytics fetched successfully.',
    },
    PROJECT_STATUS_NOT_DONE:{
        en:"Failed to delete project, as status of project is not done"

    }
};

//Multilanguage responses for Project Comments
export let CommentMessageNew = {
    VALIDATION_FAILED: {
        en: 'Validation failed.',
        es: 'Validación fallida.',
        idn: 'Validasi gagal',
        ar: 'فشل التحقق من الصحة.s',
        fr: 'Validation échouée.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
        es: 'la colección no está presente en la base de datos',
        ind: 'koleksi tidak ada dalam database',
        ar: 'المجموعة غير موجودة في قاعدة البيانات',
        fr: 'la collection n est pas présente dans la base de données',
    },
    COMMENT_ADD_FAILED: {
        en: 'Failed to add comment.',
        es: 'no se pudo agregar el comentario',
        ind: 'gagal menambahkan komentar',
        ar: 'فشل في إضافة تعليق',
        fr: 'impossible d ajouter un commentaire',
    },
    COMMENT_ADD_SUCCESS: {
        en: 'Comment added successfully.',
        es: 'proyecto creado con exito',
        ind: 'proyek berhasil dibuat',
        ar: 'تم إنشاء المشروع بنجاح',
        fr: 'projet créé avec succès',
    },
    COMMENT_FETCH_SUCCESS: {
        en: 'Comment fetched successfully.',
        es: 'comentario agregado exitosamente',
        ind: 'komentar berhasil ditambahkan',
        ar: 'تمت إضافة التعليق بنجاح ',
        fr: 'commentaire ajouté avec succès',
    },
    COMMENT_ID_FOUND: {
        en: 'Comments not found. please check ID',
        es: 'Comentario id no encontrado',
        ind: 'id komentar tidak ditemukan',
        ar: 'معرف التعليق غير موجود',
        fr: 'identifiant de commentaire introuvable',
    },
    COMMENT_FETCH_FAIL: {
        en: 'Failed to fetch comment, please check ID.',
        es: 'No se pudo obtener el comentario, verifique la identificación del comentario',
        ind: 'Gagal mengambil komentar, periksa id komentar',
        ar: 'فشل في جلب التعليق ، يرجى التحقق من معرف التعليق',
        fr: 'Échec de la récupération du commentaire, veuillez vérifier lID du commentaire',
    },
    COMMENT_UPDATE_SUCCESS: {
        en: 'Comment updated successfully.',
        es: 'comentario actualizado con exito',
        ind: 'komentar berhasil diperbarui',
        ar: 'تم تحديث التعليق بنجاح',
        fr: 'commentaire mis à jour avec succès',
    },
    COMMENT_UPDATE_FAIL: {
        en: 'Failed to updated comment, please check comment ID.',
        es: 'no se pudo actualizar el comentario, verifique la identificación del comentario',
        ind: 'gagal memperbarui komentar, harap periksa id komentar',
        ar: 'فشل في تحديث التعليق ، يرجى التحقق من معرف التعليق',
        fr: 'échec de la mise à jour du commentaire, veuillez vérifier lidentifiant du commentaire',
    },
    COMMENT_DELETE_SUCCESS: {
        en: 'Comment deleted successfully.',
        es: 'comentario eliminado con exito',
        ind: 'komentar berhasil dihapus',
        ar: 'تم حذف التعليق بنجاح',
        fr: 'commentaire supprimé avec succès',
    },
    COMMENT_DELETE_FAIL: {
        en: 'Failed to delete comment.',
        es: 'no se pudo eliminar el comentario',
        ind: 'gagal menghapus komentar',
        ar: 'فشل في حذف التعليق',
        fr: 'impossible de supprimer le commentaire',
    },
    COMMENT_PRO_FAIL: {
        en: 'Project is present, but comment of this project is not present.',
        es: 'el proyecto está presente, pero el comentario de este proyecto no está presente',
        ind: 'proyek hadir, tetapi komentar tentang proyek ini tidak ada',
        ar: 'المشروع موجود ، لكن التعليق على هذا المشروع غير موجود',
        fr: 'le projet est présent, mais le commentaire de ce projet nest pas présent',
    },
    ATLEST_ID_REQUIRED: {
        en: 'Failed to fetch comment, please provide project or comment ID.',
    },
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled',
    },
};

//multilanguage respose for Activitylogs
export let ActivityMessageNew = {
    VALIDATION_FAILED: {
        en: 'validation failed.',
        es: 'Validación fallida.',
        idn: 'Validasi gagal',
        ar: 'فشل التحقق من الصحة.s',
        fr: 'Validation échouée.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
        es: 'la colección no está presente en la base de datos',
        ind: 'koleksi tidak ada dalam database',
        ar: 'المجموعة غير موجودة في قاعدة البيانات',
        fr: 'la collection n est pas présente dans la base de données',
    },
    ACTIVITY_FETCH_SUCCESS: {
        en: 'Activity fetched successfully.',
        es: 'actividad recuperada con éxito',
        ind: 'aktivitas berhasil diambil',
        ar: 'تم جلب النشاط بنجاح ',
        fr: 'activité récupérée avec succès',
    },
    ACTIVITY_ID_FOUND: {
        en: 'Activity id not found.',
        es: 'ID de actividad no encontrado',
        ind: 'id aktivitas tidak ditemukan',
        ar: 'معرّف النشاط غير موجود',
        fr: 'ID d activité introuvable',
    },
    ACTIVITY_FETCH_FAIL: {
        en: 'Failed to fetch activity, please check given ID.',
        es: 'no se pudo recuperar la actividad, verifique la identificación dada',
        ind: 'gagal mengambil aktivitas, harap periksa id yang diberikan',
        ar: 'فشل في جلب النشاط ، يرجى التحقق من المعرف المحدد',
        fr: 'échec de la récupération de lactivité, veuillez vérifier lidentifiant donné',
    },
    ACTIVITY_DELETE_SUCCESS: {
        en: 'Activity data deleted successfully.',
        es: 'datos de actividad eliminados con éxito',
        ind: 'data aktivitas berhasil dihapus',
        ar: 'تم حذف بيانات النشاط بنجاح',
        fr: 'données d activité supprimées avec succès',
    },
    ACTIVITY_DELETE_FAIL: {
        en: 'Failed to delete activity.',
        es: 'no se pudo eliminar la actividad',
        ind: 'gagal menghapus aktivitas',
        ar: 'فشل في حذف النشاط',
        fr: 'impossible de supprimer lactivité',
    },
    ACTIVITY_PRO_FAIL: {
        en: 'Project is present ,but activity of this project is not present.',
        es: 'el proyecto está presente, pero la actividad de este proyecto no está presente',
        ind: 'proyek hadir, tetapi aktivitas proyek ini tidak hadir',
        ar: 'المشروع موجود ولكن نشاط هذا المشروع غير موجود',
        fr: 'le projet est présent, mais lactivité de ce projet nest pas présente',
    },
    ACTIVITY_FILTER_SUCCESS: {
        en: 'Data filtered successfully. ',
    },
    ACTIVITY_FILTER_FAIL: {
        en: 'Activity not found.',
    },
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled',
    },
};

//Multilanguage responses for Roles
export let RolesMessageNew = {
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
    },
    ROLES_ADD_SUCCESS: {
        en: 'Roles created successfully.',
    },
    ROLES_EXIST: {
        en: 'Role already exist with organiozation.',
    },
    ROLES_CAPACITY: {
        en: 'Adding roles capacity is already reached.',
    },
    ROLES_FOUND: {
        en: 'Invalid Role ID.',
    },
    ROLES_ADD_FAIL: {
        en: 'Error creating roles.',
    },
    ROLES_FETCH_SUCCESS: {
        en: 'Roles fetched successfully.',
    },
    ROLES_FETCH_FAIL: {
        en: 'Unable to fetch roles from this organization.',
    },
    ROLES_FETCH_FAILED: {
        en: 'Unable to fetch roles please check with ID.',
    },
    ROLES_UPDATE_FAIL: {
        en: 'This role is already present, unable to update rolename.',
    },
    ROLES_DEFAULT_FAIL: {
        en: "Can't update default role.",
    },
    ROLES_DEFAULT_FAILED: {
        en: "Can't update default role and roleName is already present.",
    },
    ROLES_UPDATE_SUCCESS: {
        en: 'Successfully updated.',
    },
    DELETE_DEFAULT_FAIL: {
        en: "Can't delete default roles.",
    },
    DELETE_FAIL_USER: {
        en: "Can't delete role, this role is assigned to some users/temporary deleted users.",
    },
    DELETE_ALL_FAIL: {
        en: 'There is no roles present except default roles.',
    },
    DELETE_ALL_USERFAIL: {
        en: "Can't delete default and assigned roles.",
    },
    DELETE_SUCCESS: {
        en: 'Roles deleted successfully.',
    },
    PLEASE_PROVIDE_ROLE_NAME: {
        en: 'Please enter role name.',
    },
    PLEASE_PROVIDE_PERMISSION_NAME: {
        en: 'Please enter permission name.',
    },
    FAILED_FETCH_ROLE: {
        en: 'Unable to fetch roles please check role name.',
    },
    ROLE_SEARCH: {
        en: 'Search result.',
    },
    ROLE_SEARCH_FAIL: {
        en: 'Failed to search.',
    },
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled',
    },
    ROLE_PLAN_LIMIT: {
        en: 'Roles adding limit is reached in your plan, please upgrade your plan.',
    },
    FAILED_FETCH_PERMISSION: {
        en: 'Unable to match permission please check permission name.',
    },
    FIELD_NOT_SELECTED: {
        en: 'Select atleast one filter',
    },
};

//Multilanguage responses for User
export let UserMessageNew = {
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
    },
    USER_ADD_SUCCESS: {
        en: 'User created successfully.',
    },
    USER_EXIST: {
        en: 'User email already exist with organization.',
    },
    USER_ADD_FAIL: {
        en: 'Error while adding  user.',
    },
    ORG_FOUND: {
        en: 'Invalid Organization ID.',
    },
    USER_FETCH_FAIL: {
        en: 'Users not present in the organization check Organization Id.',
    },
    USER_FETCH_SUCCESS: {
        en: 'User details fetched successfully.',
    },
    ROLES_FETCH_FAIL: {
        en: 'Invalid Role Id.',
    },
    ROLES_FETCH_NAME_FAIL: {
        en: 'Invalid Role Name.',
    },
    USER_UPDATE_SUCCESS: {
        en: 'User details updated successfully.',
    },
    USER_UPDATE_FAIL: {
        en: 'Fail to update user.check user ID.',
    },
    USER_UPDATE_FAILED: {
        en: 'Fail to update, Invalid User ID.',
    },
    DELETE_SUCCESS: {
        en: 'User deleted successfully.',
    },
    USER_NOT_FOUND: {
        en: 'User not found.',
    },
    DELETE_ALL_USER_FAIL: {
        en: "Presented all roles are assigned with user can't delete roles.",
    },
    USER_DELETE_FAIL: {
        en: "Can't delete this user assigned to project or task.",
    },
    USER_DELETE_FAILED: {
        en: 'Invalid User ID.',
    },
    USER_NOTFOUND: {
        en: 'No user found.',
    },
    SEARCH_SUCCESS: {
        en: 'Search result.',
    },
    SEARCH_FAIL: {
        en: 'Failed to search',
    },
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled',
    },
    USER_PLAN_LIMIT: {
        en: 'User adding limit is reached in your plan, please upgrade your plan.',
    },
    FAILED_FETCH_PERMISSION: {
        en: 'Unable to match permission please check permission name.',
    },
    INCORRECT_FIELD: {
        en: 'Faild to match field name.Please check field name',
    },
    NOT_AUTHORIZED: {
        en: 'You are not an empmonitor user.',
    },
    USER_CREATE_FAIL: {
        en: 'Cannot register a user with admin email.',
    },
    FIELD_NOT_SELECTED: {
        en: 'Plese select atleast one field',
    },
    USER_SEARCH: {
        en: 'Search result:',
    },
    ROLE_NOT_FOUND: {
        en: 'Unable to match role please check role name',
    },
    CREATE_FAIL: {
        en: 'Only role,permissions,profilePic can be updated for empuser',
    },
};

//Multilanguage responses for Admin
export let AdminMessageNew = {
    ADMIN_ADD_SUCCESS: {
        en: 'Admin stored successfully.',
    },
    ADMIN_EXIST: {
        en: 'Admin email already exist.',
    },
    Org_EXIST: {
        en: 'Admin Organization already exist.',
    },
    ADMIN_ADD_FAIL: {
        en: 'Error creating Config.',
    },
    ADMIN_FETCH_SUCCESS: {
        en: 'Data fetched successfully.',
    },
    ADMIN_PASSWORD_SUCCESS: {
        en: 'Admin Password Updated Successfully.',
    },
    ADMIN_PASSWORD_FAIL: {
        en: 'Error Updating Password.',
    },
    ADMIN_CURRENT_PASSWORD_FAIL: {
        en: 'Invalid Current Password.',
    },
    EXIST_USER_DATA: {
        en: 'User already exist.',
    },
    ADMIN_FETCH_FAIL: {
        en: 'Error in fetch admin details.',
    },
    ADMIN_FETCH_FAILED: {
        en: 'Invalid the Password!! .',
    },
    USER_EXIST: {
        en: 'User not exist.',
    },
    ADMIN_VERIFY: {
        en:'Admin verification mail sent successfully'
    },
    ADMIN_VERIFY_FAIL: {
        en: 'Error genarating verify token'
    },
    VERIFY_LIMIT: {
        en: 'Verification mail sent limit reached,Please try next day.'
    }
};

//Multilanguage responses for Admin config
export let AdminConfigNew = {
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    ADMIN_CREATE_SUCCESS: {
        en: 'Admin Config created successfully.',
    },
    ADMIN_FETCH_SUCCESS: {
        en: 'Admin Config fetched successfully.',
    },
    ADMIN_ERROR: {
        en: 'Error while fetch admin details',
    },
    ADMIN_FETCH_FAIL: {
        en: 'Fail to fetch admin Config details.',
    },
    ADMIN_FETCH_SUCCESS: {
        en: 'Admin config fetch successfully.',
    },
    ADMIN_ERROR: {
        en: 'Error in fetch admin details',
    },
    ADMIN_FETCH_FAIL: {
        en: 'Fail to fetch admin config details.',
    },
    ADMIN_CREATE_FAIL: {
        en: 'Error creating Config.',
    },
    ADMIN_CONFIG_EXIST: {
        en: 'Config is already updated with Organization.',
    },
    ADMIN_CONFIG_NOT_EXIST: {
        en: 'Config is not created with Organization.',
    },
    LANGUAGE_UPDATE: {
        en: 'Language updated successfully.',
    },
    LANGUAGE_UPDATE_FAIL: {
        en: 'Unable to update language.',
    },
};

export let planMessageNew = {
    PLAN_FETCH_SUCCESS: {
        en: 'Plan fetched successFully.',
    },
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    PLAN_FETCH_FAIL: {
        en: 'Fail to fetch plan.',
    },
    PLAN_FETCH_ERROR: {
        en: 'Error while fetching plans.',
    },
    PLAN_ADD_SUCCESS: {
        en: 'Plan added successfully.',
    },
    PLAN_ADD_FAIL: {
        en: 'Plan fail to add.',
    },
    PLAN_ADD_ERROR: {
        en: 'Error while adding plan.',
    },
    PLAN_HISTORY_FETCH: {
        en: 'Plan history fetched successfully.',
    },
    PLAN_HISTORY_FETCH_FAIL: {
        en: 'Plan history is not present.',
    },
    PLAN_HISTORY_ERROR: {
        en: 'Error while fetching plan history, please check ID.',
    },
    PLAN_ACTIVITY_DELETE_SUCCESS: {
        en: 'Plan activity deleted successfully.',
    },
    PLAN_ACTIVITY_DELETE_FAIL: {
        en: 'Failed to delete Plan activity, please check ID',
    },
    PLAN_ACTIVITY_DELETE_ERROR: {
        en: 'Error while deleting Plan activity.',
    },
};

export let DashboardConfigNew = {
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    DASHBOARD_CREATE_SUCCESS: {
        en: 'Dashboard config created successfully.',
    },
    DASHBOARD_UPDATE_SUCCESS: {
        en: 'Dashboard Config updated successfully.',
    },
    DASHBOARD_CONFIG_NOT_EXIST: {
        en: 'Dashboard Config is not present.',
    },
    DASHBOARD_CONFIG_ALREADY_EXIST: {
        en: 'Dashboard Config is already seleted.',
    },
    DASHBOARD_CONFIG__FETCH: {
        en: 'Dashboard Config Fetched successfully.',
    },
    DASHBOARD_NOT_VALID: {
        en: 'Please select valid Dashboard Configuration.',
    },
    DASHBOARD_CREATE_FAIL: {
        en: 'Error creating Config.',
    },
    DASHBOARD_UPDATE_FAIL: {
        en: 'Dashboard Config Failed to update.',
    },
    DASHBOARD_FETCH_FAIL: {
        en: 'Dashboard Config Failed to Fetch.',
    },
    FAILED_TO_MATCH_DASHBOARD_DATA: {
        en: 'Dashboard Config data is does not match with selected dashboard config',
    },

};

export let PermissionMessageNew = {
    FEATURE_NOT_ENABLED: {
        en: 'feature is not enabled.',
    },
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    DELETE_FAIL_USER: {
        en: "Can't delete permission, this permission is assigned to some users.",
    },
};

export let GroupMessageNew = {
    VALIDATION_FAIL: {
        en: 'Validation failed.',
    },
    'COLLECTION_SEARCH-FAILED': {
        en: 'Collection is not present in the database.',
    },
    USER_NOT_EXIST: {
        en: 'User does not exists Please check User-Id',
    },
    GROUP_CREATE_SUCCESS: {
        en: 'Group created successfully.',
    },
    GROUP_ALREADY_EXIST: {
        en: 'Group name already exist.',
    },
    GROUP_CREATE_FAIL: {
        en: 'Error while creating group. Please check userId or GroupId',
    },
    GROUP_FETCH_SUCCESS: {
        en: 'Successfully fetched.',
    },
    GROUP_FETCH_FAIL: {
        en: 'Failed to fetch the Group details.',
    },
    GROUP_ID_NOT_EXIST: {
        en: 'Check Inputs either Invalid Group Id.',
    },
    USER_PRESENT_ALREADY: {
        en: 'User already exists Please Add another User',
    },
    GROUP_UPDATE_SUCCESS: {
        en: 'Group data updated successfully.',
    },
    GROUP_UPDATE_FAIL: {
        en: 'Failed to update Group details. Please check userId or GroupId',
    },
    GROUP_DELETE_SUCCESS: {
        en: 'Group deleted successfully.',
    },
    GROUP_DELETE_FAIL: {
        en: 'Failed to delete Group details.Please check GroupId',
    },
    GROUP_DELETE_FAILED: {
        en: "Can't delete this group assigned to project,task or Subtask.",
    },
    GROUP_PLAN_LIMIT: {
        en: 'Group adding limit has been reached, please upgrade your plan.',
    },
    GROUP_NOT_PRESENT: {
        en: 'Group not present.',
    },
};

export let unauthorizedUserMessage = {
    VALIDATION_FAILED: {
        en: 'Validation failed',
    },
    COLLECTION_NOT_PRESENT: {
        en: 'collection not present in the DB',
    },
    INVALID_ORG_ID: {
        en: 'Orgainzation not Exist,Provide valid Org Id',
    },
    EMAIL_NOT_PRESENT: {
        en: 'Email not yet registered',
    },
    EMAIL_ACTIVATED: {
        en: 'Email already activated!.!!',
    },
    EMAIL_INVITATION_CLOSED: {
        en: 'After declining the invitation once, it cannot be accepted.'
    },
    INVALID_TOKEN: {
        en: 'Invalid token, please check given token.',
    },
    TOKEN_EXPIRED: {
        en: 'Your Token has expired, please re-generated the email verify token.',
    },
    ACTIVATION_FAIL: {
        en: 'Error in active user!!',
    },
    ACTIVATION_SUCCESS: {
        en: 'Token matched!!',
    },
    PASSWORD_SET: {
        en: 'Member activated successfully',
    },
    ACTIVATION_FAIL_ERROR: {
        en: 'UnExpected Error while activating the User.',
    },
    USER_NOT_PRESENT: {
        en: 'User not exist.',
    },
    USER_SUSPENDED: {
        en: "User's account is suspended and not allowed to login.",
    },
    USER_REJECTED: {
        en: 'User rejected mail invitation, so not allowed to login.',
    },
    INVALID_PASSWORD: {
        en: 'Invalid the Password!',
    },
    EMAIL_NOT_VERIFIED: {
        en: 'Email not Verified.',
    },
    USER_LOGIN_SUCCESS: {
        en: 'Log in Successfully.',
    },
    USER_FETCH_FAIL_ERR: {
        en: 'UnExpected Error while fetching the User details.',
    },
    EMAIL_NOT_FOUND: {
        en: 'Email not exist',
    },
    MAIL_LIMIT_REACHED: {
        en: 'Password Updating mail sent limit reached, Please try next day.',
    },
    PWD_MAIL_SUCCESS: {
        en: 'User password reset mail send successfully.',
    },
    ERROR_Forget_PWD: {
        en: 'Something went Wrong.',
    },
    PWD_RESET_SUCCESS: {
        en: 'Your password has been reset successfully.',
    },
    ERROR_IN_PWD_RESET: {
        en: 'UnExpected Error while resetting password.',
    },
    MAIL_GENERATE_LIMIT_REACHED: {
        en: 'Verification mail sent limit reached,Please try next day.',
    },
    VERIFICATION_MAIL_SUCCESS: {
        en: 'User verification mail sent successfully.',
    },
    GENERATE_TOKEN_ERROR: {
        en: 'Error while generating token.',
    },
    USER_CURRENT_PASSWORD_FAIL: {
        en: 'Old password is invalid',
    },
    USER_PASSWORD_SUCCESS: {
        en: 'User Password Updated Successfully.',
    },
};

export let PermissionMiddlewareMessage = {
    ACCESS_DENIED: {
        en: 'You are not allowed to access this route.',
    },
    FAILED_ACCESS: {
        en: 'Permission not added. Please contact your admin.',
    },
};

export let ProfileMessage ={
    FEATURE_NOT_ENABLED: {
        en: 'Features is not enabled',
    },
    PROFILE_FETCH_SUCCESS: {
        en: 'Profile Fetched Successfully',
    },
    PROFILE_FETCH_FAILED: {
        en: 'Failed to fetch Profile details',
    },
};

export let UploadMessage = {
    FILE_REQUIRED: {
        en: 'Should add minimum one file to upload '
    },
    FILE_LIMIT_REACHED: {
        en: 'Only 10 files can upload'
    },
    FAILED_TO_UPLOAD_FILES: {
        en: 'Error While Uploading files'
    },
    FILE_FETCH_SUCCESS: {
        en: 'file details fetched successfully.'
    },
    FILE_NOT_FOUND: {
        en: 'file not present / Please check gven Id'
    },
    FAILED_TO_FETCH_FILES: {
        en: 'Unable to read list of files!'
    },
    FILE_DELETE_SUCCESS: {
        en: 'deleted all files successfully'
    },
    FAILED_TO_DELETE_FILES: {
        en: 'Unable to delete list of files!'
    },
    ID_REQUIRED: {
        en: 'id required. Please provide id !'
    },
}