import React from 'react';
import Reports from '@WORKFORCE_MODULES/reports/projects/components/all';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <Reports {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;