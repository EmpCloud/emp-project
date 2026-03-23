import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
const Auth = ({ children }) => {
    const router = useRouter();
    useEffect(() => {
        // if (typeof Cookies.get("token") === "undefined") {
        //   router.push("/");
        // }
        // if (Cookies.get('adminData')) {
        //   let adminData = JSON.parse(Cookies.get('adminData'));
        //   if (!adminData.planName) {
        //     return router.push("/w-m/pricing")
        //   }
        //   if (!adminData.isConfigSet) {
        //     return router.push("/w-m/cofiguration")
        //   }
        //   if (!adminData.dashboardConfig_id) {
        //     return router.push("/w-m/select-dashboard")
        //   }
        // }
        // if (!noAuthRequired.includes(router.pathname)) {
        //   if (Cookies.get('adminData')) {
        //     let adminData = JSON.parse(Cookies.get('adminData'));
        //     if (!adminData.planName) {
        //       return router.push("/w-m/pricing")
        //     }
        //     if (!adminData.isConfigSet) {
        //       return router.push("/w-m/cofiguration")
        //     }
        //     if (!adminData.dashboardConfig_id) {
        //       return router.push("/w-m/select-dashboard")
        //     }
        //   }
        // }
    }, [router.pathname]);
    if (router.isReady) {
        return <> {children}</>;
    }
    return <> {children}</>;
};
Auth;
export default Auth;
