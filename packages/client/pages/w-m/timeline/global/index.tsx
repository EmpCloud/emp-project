import React from 'react';
import dynamic from 'next/dynamic';

// #1211 — Use dynamic import with ssr:false to avoid amcharts4 ESM errors during server-side build
const GLobalCharts = dynamic(
    () => import('@WORKFORCE_MODULES/timeline/components/globalCharts'),
    { ssr: false, loading: () => <div className="flex justify-center items-center h-64"><p>Loading timeline...</p></div> }
);

const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <GLobalCharts {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;
