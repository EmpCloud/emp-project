import ProfileService from './profile.service.js';

class AdminController {
    async profile(req, res, next) {
        /* #swagger.tags = ['Profile']
                           #swagger.description = 'Profile Details'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        return await ProfileService.fetchProfile(req, res, next);
    }
}
export default new AdminController();
