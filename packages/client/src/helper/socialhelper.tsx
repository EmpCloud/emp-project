// import React from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import { ifError } from 'assert';

// import axios from 'axios';
// import { facebookLogin, googleLogin, twitterLogin } from '../modules/workforce-management/social-login/api/get/index';

// const getAndRedirect = async (platform = '') => {
//     try {
//         const response = await axios.get(`${process.env.PROJECT_API}/social/social-login?network=${platform}`);
//         const result = response.data;

//         // For Twitter, store Token & Secret
//         if (platform === 'Twitter') {
//             const tokens = result?.body?.token ?? {};

//             Cookies.set('requestToken', tokens?.requestToken ?? '');
//             Cookies.set('requestSecret', tokens?.requestSecret ?? '');
//         }

//         window.location.href = result?.body?.navigateUrl;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// const getAndRedirectTwitter = () => getAndRedirect('Twitter');
// const getAndRedirectGoogle = () => getAndRedirect('Google');
// const getAndRedirectFacebook = () => getAndRedirect('Facebook');

// async function handleGoogleCallBack(code, router) {
//     let response = await googleLogin(code);

//     const data = response?.data;

//     if (data.statusCode !== 200) {
//         router.push('/');
//         toast.info('some thing went wrong');
//     } else {
//         toast.info('You have successfully logged in');
//         localStorage.setItem('user', JSON.stringify(data?.body?.data?.accessToken ?? null));
//         Cookies.set('token', data.body.data.accessToken);
//         Cookies.set('adminData', JSON.stringify(data.body.data.userData));
//         Cookies.set('id', data?.body?.data?.userData._id);
//         Cookies.set('isAdmin', data.body.data.userData.isAdmin);
//         Cookies.set('isEmpAdmin', data.body.data.userData.isEmpMonitorUser);

//         if (!data.body.data.userData.planName) {
//             return router.push('/w-m/pricing');
//         } else if (!data.body.data.userData.isConfigSet) {
//             toast.info('Something went wrong, please try again');
//             return router.push('/w-m/cofiguration');
//         } else if (!data.body.data.userData.dashboardConfig_id) {
//             toast.info('Something went wrong, please try again');
//             return router.push('/w-m/select-dashboard');
//         } else {
//             router.push('/w-m/dashboard');
//         }
//     }
// }

// function handleTwitterCallBack(oauth_verifier, router) {
//     let token = Cookies.get('requestToken');
//     let secret = Cookies.get('requestSecret');

//     twitterLogin(token, secret, oauth_verifier)
//         .then(response => {
//             const data = response.data;
//             if (data?.statusCode === 200) {
//                 localStorage.setItem('user', JSON.stringify(data?.body?.data?.accessToken ?? null));
//                 toast.info('You have successfully logged in');
//                 Cookies.set('token', data.body.data.accessToken);
//                 Cookies.set('adminData', JSON.stringify(data.body.data.userData));
//                 Cookies.set('id', data?.body?.data?.userData._id);
//                 Cookies.set('isAdmin', data.body.data.userData.isAdmin);
//                 Cookies.set('isEmpAdmin', data.body.data.userData.isEmpMonitorUser);

//                 if (!data.body.data.userData.planName) {
//                     return router.push('/w-m/pricing');
//                 } else if (!data.body.data.userData.isConfigSet) {
//                     return router.push('/w-m/configuration');
//                 } else if (!data.body.data.userData.dashboardConfig_id) {
//                     return router.push('/w-m/select-dashboard');
//                 } else {
//                     router.push('/w-m/dashboard');
//                 }
//             } else {
//                 toast.info('Something went wrong, please try again');
//                 window.location.href = '/';
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
//     return true;
// }

// function handleFacebookCallBack(code, router) {
//     facebookLogin(code)
//         .then(response => {
//             let data = response.data;
//             localStorage.setItem('RESPONSE', JSON.stringify(data));

//             if (data.statusCode === 200) {
//                 localStorage.setItem('user', JSON.stringify(data?.body?.data?.accessToken ?? null));
//                 toast.info('You have successfully logged in');
//                 Cookies.set('token', data.body.data.accessToken);
//                 Cookies.set('adminData', JSON.stringify(data.body.data.userData));
//                 Cookies.set('id', data?.body?.data?.userData._id);
//                 Cookies.set('isAdmin', data.body.data.userData.isAdmin);
//                 Cookies.set('isEmpAdmin', data.body.data.userData.isEmpMonitorUser);

//                 if (!data.body.data.userData.planName) {
//                     return router.push('/w-m/pricing');
//                 } else if (!data.body.data.userData.isConfigSet) {
//                     return router.push('/w-m/cofiguration');
//                 } else if (!data.body.data.userData.dashboardConfig_id) {
//                     return router.push('/w-m/select-dashboard');
//                 } else {
//                     router.push('/w-m/dashboard');
//                 }
//             } else if (data.statusCode === 400) {
//                 toast.info('Something went wrong, please try again');
//                 window.location.href = '/';
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
//     return true;
// }

// export { handleTwitterCallBack, handleFacebookCallBack, getAndRedirectGoogle, handleGoogleCallBack, getAndRedirectTwitter, getAndRedirectFacebook };
import React from 'react'

const socialhelper = () => {
  return (
    <div>socialhelper</div>
  )
}

export default socialhelper