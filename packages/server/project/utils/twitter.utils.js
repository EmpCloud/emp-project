import TwitterApi from 'node-twitter-api';

function Twitter(twitter_api) {
    // Assiging twitter_api (twitter config) to this.twitter_api
    this.twitter_api = twitter_api;
    // Making a twitter object with config to hit twitter api

    this.twitterLogin = new TwitterApi({
        consumerKey: twitter_api.api_key,
        consumerSecret: twitter_api.secret_key,
        callback: twitter_api.redirect_url,
    });
}

Twitter.prototype.requestTokenLogin = function () {
    return new Promise((resolve, reject) => {
        this.twitterLogin.getRequestToken((error, requestToken, requestSecret) => {
            if (error) {
                reject(error);
            } else {
                const response = {
                    requestToken,
                    requestSecret,
                };
                resolve(response);
            }
        });
    });
};
Twitter.prototype.addTwitterProfilebyLogin = function (requestToken, requestSecret, verifier) {
    let twitterAccessToken = null;

    return new Promise((resolve, reject) => {
        // Checking whether the input verifier is having value or not
        if (!verifier) {
            reject("Can't get verification code from twitter!");
        } else {
            return this.accessToken(requestToken, requestSecret, verifier)
                .then(response => {
                    twitterAccessToken = response;

                    return this.verifyCredentials(response.accessToken, response.accessSecret);
                })
                .then(userDetails => {
                    const data = {
                        userDetails,
                        token: twitterAccessToken,
                    };

                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
};

Twitter.prototype.accessToken = function (token, secret, verifier) {
    return new Promise((resolve, reject) => {
        this.twitterLogin.getAccessToken(token, secret, verifier, (error, accessToken, accessSecret) => {
            // Checking whether it sent error in callback or not
            if (error) reject(error);
            else {
                const response = {
                    accessToken,
                    accessSecret,
                };
                // Sending response

                resolve(response);
            }
        });
    });
};
Twitter.prototype.verifyCredentials = function (accessToken, accessSecret) {
    return new Promise((resolve, reject) => {
        this.twitterLogin.verifyCredentials(accessToken, accessSecret, (error, user) => {
            // Checking whether it sent error in callback or not
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};

export default Twitter;