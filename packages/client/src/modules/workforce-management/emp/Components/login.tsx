import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isEmpUser } from '../api/post';
import toast from '../../../../components/Toster/index'
import Cookies from 'js-cookie';
import Router from 'next/router';
import { adminConfig } from '@WORKFORCE_MODULES/cofiguration/api/post';
// import TranslationContext from 'pages/projects/context/context';
import { useContext } from 'react';
import SinUP from './signup';
import Loader from '../../../../../public/img/loding.json';
import Lottie from 'react-lottie-player';
import UserInfo from '@COMPONENTS/UserInfoModal/UserInfo';
import { jwtDecode } from 'jwt-decode';

const login = ({ startLoading, stopLoading }) => {
    const [showSignUp, setShowSignUp] = useState(false);

    const { query} =useRouter()
    const allConfig = ['projectFeature', 'taskFeature', 'subTaskFeature', 'invitationFeature'];

    const handleConfigSet = () => {
        adminConfig(allConfig)
            .then(response => {
                if (response.data.statusCode == 200) {
                    const exp = jwtDecode(response.data.body.data.accessToken).exp;
                    const expiresAt = exp ? new Date(exp * 1000) : undefined;
                    Cookies.remove('token');
                    Cookies.set('token', response.data.body.data.accessToken,{ expires: expiresAt });
                    Router.push('/w-m/dashboard');
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    const [adminDetails,setAdminDetails]=useState(null)

    const handleSumbmit = () => {
       const empToken = {"token":query?.token}
        isEmpUser(empToken)
            .then(response => {
                if (response.data.statusCode == 200) {

                    // toast({
                    //     type: 'success',
                    //     message: response ? response.data.body.message : null,
                    // });
            
                 Cookies.set('token', response?.data?.body?.data?.accessToken);
                Cookies.set('adminData', JSON.stringify(response?.data?.body?.data?.userData));
                Cookies.set('id', response?.data?.body?.data?.userData._id);
                Cookies.set('isAdmin', response.data.body.data.userData.isAdmin);
                Cookies.set('isEmpAdmin', response.data.body.data.userData.isEmpMonitorUser);
                Cookies.set('planName', response.data.body.data.userData.planName);
                Cookies.set('profilePic',response.data.body.data.userData.profilePic);


                if (!response.data.body.data.userData.isConfigSet) {
                    handleConfigSet();
                }
                if (response.data.body.data.userData.isConfigSet) {
                    Router.push('/w-m/dashboard');
                    
                }

                // Router.push('/w-m/dashboard');
                setTimeout(() => {
                    Cookies.remove('token');
                    Cookies.remove('adminData');
                    Cookies.remove('id');
                    Cookies.remove('isAdmin');
                    Cookies.remove('isEmpAdmin');
                    Router.push('/w-m/admin/sign-in');
                }, 86160000); // logout after 23hrs 58min;
          
                } 
                else if(response.data.statusCode == 400){
                    // Router.push('/projects/emp-wm-signup');
                    setAdminDetails(response?.data?.body.error)
                    setShowSignUp(true);
                    // Router.push(
                    //   '/projects/emp-wm-signup',
                      
                    //   );
                    
                }
         
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };

    useEffect(()=>{
        if(query?.token){
            handleSumbmit()
        }

    },[query?.token])
    const data ='sunil'
    

    return <div> {showSignUp ? <UserInfo  data={adminDetails}/>:
    <div className='flex justify-center items-center h-screen flex-col'>
    <Lottie
    loop
    animationData={Loader}
    play
    style={{ width: 150, height: 150 }}
    />
    <div>Redirecting to Emp Worforce Please wait...</div>
  </div>
  } 
  </div>;
};

export default login;
