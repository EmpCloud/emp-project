import React from 'react'
import AdminSignIn from '@WORKFORCE_MODULES/admin/components/adminSignin';
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AdminSignIn {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index