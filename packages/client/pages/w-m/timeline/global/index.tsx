import React from 'react';
import GLobalCharts from '@WORKFORCE_MODULES/timeline/components/globalCharts';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <GLobalCharts {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;
