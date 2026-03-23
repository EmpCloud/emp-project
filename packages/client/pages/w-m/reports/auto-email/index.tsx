import React from 'react';
import AutoEmail from '@WORKFORCE_MODULES/reports/auto-email/components/all';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <AutoEmail {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;