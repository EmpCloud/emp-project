import getFingerprint from '@HELPER/getFingerprint';
import axios from 'axios';
import React, { useEffect } from 'react';

const check = () => {
   const loginAdmin = async function (data,uni) {
    const headers = {
        'fingerprint': uni

      };
    return await axios.post(  'https://91f4-202-83-16-163.in.ngrok.io/v1/admin/fetch?uni='+uni, data, { headers });
};
    useEffect(() => {

        loginAdmin({"email":"neetukanaujia@globussoft.in",
        "password":"Neetu@30"},getFingerprint());



    }, []);

    return <div>check</div>;
};

export default check;
