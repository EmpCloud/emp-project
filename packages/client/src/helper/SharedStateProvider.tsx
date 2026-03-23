import React, { useState ,useEffect} from 'react';
import { SharedStateContextProvider } from './function'; 
import Cookies from 'js-cookie';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';


// Create a provider component
const SharedStateProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState('');
  const [profileData,setProfileData] = useState(null);

  const getProfileData = () => {
    fetchProfile().then(response => {
      if (response && response.data?.body.status === 'success') {
        setProfileData(response.data.body.data);
      }
    });
  };



  useEffect(() => {
    const profilePicFromCookie = Cookies.get('profilePic');
    // getProfileData()
    if (profilePicFromCookie) {
      setSharedState(profilePicFromCookie);
    }
  }, []);

  const updateSharedState = (newState) => {
    setSharedState(newState);
  };

  return (
    <SharedStateContextProvider value={{ sharedState, updateSharedState ,profileData,setProfileData}}>
      {children}
    </SharedStateContextProvider>
  );
};

export default SharedStateProvider;
