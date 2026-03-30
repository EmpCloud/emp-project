import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

/**
 * Returns true if the current URL has ?sso_token= (synchronous check).
 * Use this to gate rendering before the async SSO exchange begins.
 */
export function hasSsoToken(): boolean {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get('sso_token');
}

/**
 * Checks for ?sso_token= in the URL query string.
 * If found, exchanges it for a local JWT via POST /v1/auth/sso,
 * stores the token in cookies, and redirects to the dashboard.
 *
 * Returns true if SSO token was found and processed successfully,
 * returns false if no SSO token was present or exchange failed.
 */
export async function handleSsoToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token');

    if (!ssoToken) return false;

    try {
        // Use the same env var pattern as the rest of the app.
        // process.env.PROJECT_API is inlined at build time by Next.js webpack.
        const apiUrl = process.env.PROJECT_API;

        if (!apiUrl) {
            console.error('SSO: PROJECT_API environment variable is not set');
            cleanSsoTokenFromUrl();
            return false;
        }

        console.log('SSO: Exchanging token at', apiUrl + '/auth/sso');

        const response = await axios.post(
            apiUrl + '/auth/sso',
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

            // Remember where to return to in EMP Cloud
            localStorage.setItem('empcloud_return_url', window.location.origin.replace(/project[^.]*/i, 'cloud') + '/dashboard');

            cleanSsoTokenFromUrl();

            // Use window.location for a hard navigation so the middleware
            // sees the freshly-set token cookie on the very first request.
            window.location.href = '/w-m/dashboard';
            return true;
        } else {
            console.error('SSO: Unexpected status', response.data.statusCode, response.data.body?.message);
        }
    } catch (err: any) {
        console.error('SSO authentication failed:', err?.response?.data || err?.message || err);
    }

    cleanSsoTokenFromUrl();
    return false;
}

/** Remove sso_token from the URL bar without triggering a page reload */
function cleanSsoTokenFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('sso_token');
    window.history.replaceState({}, document.title, url.pathname + url.search);
}
