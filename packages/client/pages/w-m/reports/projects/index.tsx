import React from 'react';
import dynamic from 'next/dynamic';

const Reports = dynamic(
    () => import('@WORKFORCE_MODULES/reports/projects/components/all'),
    { ssr: false, loading: () => <div className="flex justify-center items-center h-64"><p>Loading reports...</p></div> }
);

const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <Reports {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;