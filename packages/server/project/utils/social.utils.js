import request from 'request';
import config from 'config';
import TwitterHelper from './twitter.utils.js';
const fbVersion = 'v17.0';
import requestPromise from 'request-promise';
import PasswordGenerator from 'generate-password';
import response from '../response/response.js';

class Helper {
    constructor() {
        this.twtConnect = new TwitterHelper(config.get('twitter_api'));
    }
    async getGoogleAccessToken(code, redirectUrl, res) {
        return new Promise((resolve, reject) => {
            const requestBody = `code=${code}&redirect_uri=${redirectUrl}&client_id=${config.get('google_api.client_id')}&client_secret=${config.get(
                'google_api.client_secrets'
            )}&scope=&grant_type=authorization_code`;
            const requestResp =
            {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url: 'https://www.googleapis.com/oauth2/v4/token',
                body: requestBody,
            }
            return requestPromise(requestResp).then(response => {
                const parsedResponse = JSON.parse(response);

                const tokens = {
                    access_token: parsedResponse.access_token,
                    refresh_token: parsedResponse.refresh_token,
                };
                resolve(tokens);
            }).catch(error => {
                const errorMessage = JSON.parse(error.error);
                res.send(response.projectFailResp("Failed to sign up through Google", errorMessage));
            })
        });
    }
    async getGoogleProfileInformation(tokens) {
        return new Promise((resolve, reject) => {
            // Hitting google with accessToken to get data of google profile details
            request.get(
                {
                    headers: { Authorization: `Bearer ${tokens.access_token}` },
                    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        const parsedBody = JSON.parse(body);
                        const userGoogleId = parsedBody?.id;
                        const userGoogleEmail = parsedBody?.email;
                        const firstName = parsedBody?.given_name;
                        const lastName = parsedBody?.family_name;
                        const profilePicUrl = parsedBody?.picture;
                        const birthday = parsedBody?.birthday ? parsedBody?.birthday : '';
                        const profileLink = parsedBody?.link;
                        const password = PasswordGenerator.generate({ length: 10, numbers: true });
                        const userDetails = {
                            orgId: userGoogleId,
                            email: userGoogleEmail,
                            firstName,
                            lastName,
                            profilePicUrl,
                            birthday,
                            password,
                            profileLink,
                            access_token: tokens.access_token,
                            refresh_token: tokens.refresh_token,
                            orgName: 'GLB',
                            address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                            city: 'Banglore',
                            state: 'karnataka',
                            country: 'India',
                            zipCode: '587291',
                            countryCode: '+91',
                            phoneNumber: '9143567888'
                        };
                        // Sending response
                        resolve(userDetails);
                    }
                }
            );
        });
    }
    async parsedataGoogle(data, tokens) {
        let UserDetails = {
            orgId: data?.orgId,
            firstName: data?.firstName,
            lastName: data?.lastName,
            userName: data?.firstName,
            profilePic: data?.profilePicUrl,
            password: data.password,
            email: data?.email,
            verified: true,
            socialLogin: true,
            socialNetwork: 1,
            orgName: 'GLB',
            address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
            city: 'Banglore',
            state: 'karnataka',
            country: 'India',
            zipCode: '587291',
            countryCode: '+91',
            phoneNumber: '9143567888'
            //choose the network Id
        };
        return UserDetails;
    }
    async getTwitterData(requestToken, requestSecret, verifier, res) {
        return this.twtConnect.addTwitterProfilebyLogin(requestToken, requestSecret, verifier).then(profile => {
            let UserDetails = {
                firstName: profile?.userDetails?.name,
                lastName: profile?.userDetails?.lastName ?? '',
                userName: profile?.userDetails?.screen_name,
                profilePic: profile?.userDetails?.profile_image_url_https,
                password: PasswordGenerator.generate({ length: 10, numbers: true }),
                email: profile?.userDetails?.email ?? `${profile?.userDetails?.name}@Twitter.com`, // If mail not found
                verified: true,
                socialLogin: true,
                socialNetwork: 3,
                orgId: profile?.userDetails?.id_str,
                orgName: 'GLB',
                address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                city: 'Banglore',
                state: 'karnataka',
                country: 'India',
                zipCode: '587291',
                countryCode: '+91',
                phoneNumber: '9143567888'
                //choose the network Id
            };
            return UserDetails;
        }).catch(error => {
            res.send(response.projectFailResp("Failed to sign up through Twitter", error));
        });
    }
    async getFbToken(code, res) {
        return new Promise((resolve, reject) => {
            const postOptions = {
                method: 'GET',
                uri: `https://graph.facebook.com/${fbVersion}/oauth/access_token`,
                qs: {
                    client_id: config.get('facebook_api.app_id'),
                    redirect_uri: config.get('facebook_api.redirect_url'),
                    client_secret: config.get('facebook_api.secret_key'),
                    code,
                },
            };
            return requestPromise(postOptions)
                .then(response => {

                    const parsedResponse = JSON.parse(response);
                    resolve(parsedResponse.access_token);
                })
                .catch(error => {
                    const errorMessage = JSON.parse(error.error);
                    res.send(response.projectFailResp("Failed to sign up through Facebook", errorMessage));
                });
        });
    }
    async getFbUserProfileInfo(accessToken) {
        const url = `https://graph.facebook.com/${fbVersion}/me?fields=id,name,email,first_name,last_name,picture,location,hometown&access_token=${accessToken}`;
        return new Promise((resolve, reject) =>
            request.get(url, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    let parsedBody = JSON.parse(body);
                    let country = parsedBody.location.name;
                    let countryName = country.split(" ");
                    let UserDetails = {
                        firstName: parsedBody?.first_name,
                        lastName: parsedBody?.last_name,
                        userName: parsedBody?.name,
                        profilePic: parsedBody?.picture.data.url ?? '', //profile pic not getting from API
                        password: PasswordGenerator.generate({ length: 10, numbers: true }),
                        email: decodeURI(parsedBody?.email),
                        verified: true,
                        socialLogin: true,
                        socialNetwork: 2,
                        orgId: parsedBody.id,
                        orgName: 'GLB',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: countryName[0] ?? 'Banglore',
                        state: country ?? 'karnataka',
                        country: countryName[1] ?? 'India',
                        zipCode: '560001',
                        countryCode: '+91',
                        phoneNumber: '9143567888'
                    };
                    resolve(UserDetails);
                }
            })
        );
    }
}
export default new Helper();
