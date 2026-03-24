import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Checks for ?sso_token= in the URL query string.
 * If found, exchanges it for a local JWT via POST /v1/auth/sso,
 * stores the token in cookies, and redirects to the dashboard.
 *
 * Returns true if SSO token was found and is being processed (caller should wait),
 * returns false if no SSO token was present.
 */
export async function handleSsoToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token');

    if (!ssoToken) return false;

    try {
        const response = await axios.post(
            process.env.PROJECT_API + '/auth/sso',
            { token: ssoToken }
        );

        if (response.data.statusCode === 200) {
            const data = response.data.body.data;
            const exp = jwtDecode(data.accessToken).exp;
            const expiresAt = exp ? new Date(exp * 1000) : undefined;

            Cookies.set('token', data.accessToken, { expires: expiresAt });
            Cookies.set('adminData', JSON.stringify(data.userData));
            Cookies.set('id', data.userData._id);
            Cookies.set('isAdmin', data.userData.isAdmin ?? 'true');
            Cookies.set('isEmpAdmin', data.userData.isEmpMonitorUser ?? 'true');
            Cookies.set('planName', data.userData.planName);
            if (data.userData.profilePic) {
                Cookies.set('profilePic', data.userData.profilePic);
            }

            // Remove sso_token from URL without triggering a page reload
            const url = new URL(window.location.href);
            url.searchParams.delete('sso_token');
            window.history.replaceState({}, document.title, url.pathname + url.search);

            // Redirect to dashboard
            Router.push('/w-m/dashboard');
            return true;
        }
    } catch (err) {
        console.error('SSO authentication failed:', err);
    }

    // Remove the invalid sso_token from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('sso_token');
    window.history.replaceState({}, document.title, url.pathname + url.search);

    return false;
}
