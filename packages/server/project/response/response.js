class Response {
    projectSuccessResp(message, projectDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: projectDetails,
            },
        };
    }
    projectPartialSuccessResp(message, PartialDetails) {
        return {
            statusCode: 206,
            body: {
                status: 'success',
                message: message,
                data: PartialDetails,
            },
        };
    }
    projectAlreadyExistResp(message) {
        return {
            statusCode: 422,
            body: {
                status: 'success',
                message: message,
            },
        };
    }

    projectFailResp(msg, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: msg,
                error: err,
            },
        };
    }
    projectEmailNotValidate(msg, err) {
        return {
            statusCode: 401,
            body: {
                status: 'failed',
                message: msg,
                error: err,
            },
        };
    }

    userDeleteSuccessResp(message, userDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: {
                    deletedCount: userDetails,
                },
            },
        };
    }
    tokenFailResp(message, error) {
        return {
            statusCode: 402,
            body: {
                status: 'failed',
                message: message,
                error: error,
            },
        };
    }
    validationFailResp(message, error) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: error,
            },
        };
    }
    commentSuccessResp(message, commentDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: commentDetails,
            },
        };
    }
    commentFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }
    activitySuccessResp(message, activtyDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message.activtyDetails,
                data: activtyDetails,
            },
        };
    }
    activityFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }
    languageSuccessResp(message, languageDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: languageDetails,
            },
        };
    }
    languageFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }
    shortcutKeySuccessResp(message, shortcutKeyDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: shortcutKeyDetails,
            },
        };
    }
    shortcutKeyFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }
    shortcutKeyDuplicateErrorResp(message) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
            },
        };
    }
    chatSuccessResp(message, chatDetails) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: chatDetails,
            },
        };
    }
    chatFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }
    notificationSuccessResp(message, details) {
        return {
            statusCode: 200,
            body: {
                status: 'success',
                message: message,
                data: details,
            },
        };
    }
    notificationFailResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'failed',
                message: message,
                error: err,
            },
        };
    }

    accessDeniedResp(message, err) {
        return {
            statusCode: 400,
            body: {
                status: 'Unauthorized access',
                message: message,
                error: err,
            },
        };
    }
    SocialCallbackResponse(res, navigateUrl, token = null, message, statusCode = 200, status = 'success') {
        return {
            statusCode,
            status,
            body: {
                message,
                navigateUrl,
                token,
            },
        };
    }
}

export default new Response();
