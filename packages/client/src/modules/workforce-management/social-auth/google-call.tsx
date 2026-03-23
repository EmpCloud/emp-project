import { handleGoogleCallBack ,handleFacebookCallBack,handleTwitterCallBack } from '@HELPER/socialhealper';
import React from 'react'
import { useRouter} from 'next/router';
import { useEffect } from 'react';
function index() {
  const router = useRouter();
  const { code } = router.query;
  useEffect(() => {
    if (code && code !== '') { ``
      handleGoogleCallBack(code, router); 
    }
  }, [code, router]);

 return (
    <div>
      Testing the Google Auth Page
    </div>
  )
}

export default index