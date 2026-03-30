import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import { TourProvider } from '@reactour/tour';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import HeaderRoute from '../src/components/HeaderRoute';
import { noAuthRequired } from '../src/helper/noAuthRoute';
import Layout from '../src/layout';
import Cookies from 'js-cookie';
import Router from "next/router";
import 'react-toastify/dist/ReactToastify.css';
/* eslint-disable @next/next/no-img-element */
import Auth from '../src/components/Auth';
import { steps } from '../src/helper/tourSteps';
import SharedStateProvider from '../src/helper/SharedStateProvider'
import { handleSsoToken, hasSsoToken } from '../src/helper/sso'
// import { ErrorBoundary } from 'react-error-boundary';
function Loading({ conditon }) {
    return (
        conditon && (
            <div className='loader-wrapper'>
                <div className='loader'></div>
            </div>
        )
    );
}

export default function App({ Component, pageProps }: AppProps) {
    const handle = useFullScreenHandle();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     if (Cookies.get("token") == null) Router.push("/w-m/admin/sign-in");
    // }, [loading]);
    useEffect(() => {
        router.events.on('routeChangeStart', () => setLoading(true));
        router.events.on('routeChangeComplete', () => setLoading(false));
        router.events.on('routeChangeError', () => setLoading(false));
        return () => {
            router.events.off('routeChangeStart', () => setLoading(true));
            router.events.off('routeChangeComplete', () => setLoading(false));
            router.events.off('routeChangeError', () => setLoading(false));
        };
    }, [router.events]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, []);
    const startLoading = () => {
        clearCache();
        setLoading(true);
    };
    const stopLoading = () => {
        setLoading(false);
    };
    const clearCache = () => {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    window.caches.delete(cacheName);
                });
            }).catch(e=>{
                console.log(e);
            })
        }
    };
    useEffect(() => {}, [loading, router.pathname]);
    // SSO gate: check for ?sso_token= on initial page load.
    // hasSsoToken() is synchronous so the very first render shows a spinner
    // while the async token exchange is in flight.
    const [ssoProcessing, setSsoProcessing] = useState(false);
    // Hydration-safe: detect SSO token only on the client after mount
    useEffect(() => {
        if (hasSsoToken()) {
            setSsoProcessing(true);
        }
    }, []);
    useEffect(() => {
        if (!ssoProcessing) return; // no SSO token in URL, nothing to do
        handleSsoToken().then((handled) => {
            if (!handled) {
                // SSO exchange failed or token was invalid — let the app render normally
                setSsoProcessing(false);
            }
            // If handled === true the page is already navigating to /w-m/dashboard
        });
    }, [ssoProcessing]);
    useEffect(() => {
        const initialValue = (document.body.style as any).zoom;
        // Change zoom level on mount
        // (document.body.style as any).zoom = '80%';
        return () => {
            // Restore default value
            (document.body.style as any).zoom = initialValue;
        };
    }, []);
    const [isTourOpen, setIsToureOpen] = useState(false);

    // Show loading spinner while SSO token is being exchanged
    if (ssoProcessing) {
        return <Loading conditon={true} />;
    }

    return (
        <>
            {/* <ErrorBoundary> */}
            <SharedStateProvider>
            <TourProvider maskClassName='mask' isOpen={isTourOpen} className='reactour' steps={steps(router.pathname) as any}>
                <Auth>
                    <FullScreen handle={handle}>
                        <HeaderRoute path={router.pathname} />
                        <Loading conditon={loading} />
                        {noAuthRequired.includes(router.pathname) ? (
                            <Component {...{ pageProps, startLoading, stopLoading }} />
                        ) : (
                            <Layout>
                                <Component {...{ pageProps, startLoading, stopLoading }} />
                            </Layout>
                        )}
                        <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} newestOnTop={false} draggable={false} pauseOnVisibilityChange closeOnClick pauseOnHover />
                    </FullScreen>
                </Auth>
            </TourProvider>
            </SharedStateProvider>
            {/* </ErrorBoundary> */}
            {/* <Test3  /> */}
        </>
    );
}
