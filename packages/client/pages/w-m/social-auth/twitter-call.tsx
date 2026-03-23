// import { handleTwitterCallBack } from '@HELPER/socialhelper';
// import React from 'react'
// import { useRouter} from 'next/router';
// import { useEffect, useState } from 'react';
// function index() {
//   const router = useRouter();
//   const { oauth_verifier } = router.query;
//   useEffect(() => {
//     if (oauth_verifier && oauth_verifier !== '') {
//       handleTwitterCallBack(oauth_verifier, router);
//     }
//   }, [oauth_verifier, router]);

//  return (
//     <div>
//       {/* {  handleGoogleCallBack({fullUrl})} */}
//       Testing the twitter Auth Page
//     </div>
//   )
// }

// export default index
import React from 'react';

const twitter = () => {
    return <div>twitter-call</div>;
};

export default twitter;
