class Responses {
    //==================================================================================================//
    //TaskHandler response functions
    taskSuccessResp(message, taskDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: taskDetails,
            },
        };
    }

    taskFailResp(message) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
            },
        };
    }
    subTaskFailResp(message, error) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: error,
            },
        };
    }

    taskDuplicateErrorResp(message) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
            },
        };
    }
    //=================================================================================================//

    //=================================================================================================//
    //UserHandler response functions
    userSuccessResp(message, userDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: userDetails,
            },
        };
    }

    userFailResp(message, userDetails) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                existingUser: userDetails,
            },
        };
    }
    //=================================================================================================//

    //=================================================================================================//
    //AdminHandler response functions
    adminSuccessResp(message, adminDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: adminDetails,
            },
        };
    }

    adminFailResp(message) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
            },
        };
    }
    //=================================================================================================//
    validationfailResp(message, error) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: error.message,
            },
        };
    }
    tokenFailResp(message, error) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: error,
            },
        };
    }

    //=================================================================================================//
    commentfailResp(message, error) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message,
            },
        };
    }
    commentSuccessResp(message, comment) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: comment,
            },
        };
    }
    accessDeniedResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'Unautherized access',
                message: message,
                error: err,
            },
        };
    }
}
export default new Responses();
