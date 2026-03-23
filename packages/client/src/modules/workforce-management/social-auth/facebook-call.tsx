import { handleGoogleCallBack ,handleFacebookCallBack,handleTwitterCallBack } from '@HELPER/socialhealper';
import React from 'react'
import { useRouter} from 'next/router';
import { useEffect, useState } from 'react';
function index() {
  const router = useRouter();
  const { code } = router.query;
  useEffect(() => {
    if (code && code !== '') {
      handleFacebookCallBack(code, router); 
    }
  }, [code, router]);
 return (
    <div>
      {/* {  handleGoogleCallBack({fullUrl})} */}
      Testing the facebook Auth Page
    </div>
  )
}

export default index