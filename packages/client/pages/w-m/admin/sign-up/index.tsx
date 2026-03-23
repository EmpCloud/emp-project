import AdminSignUp from '@WORKFORCE_MODULES/admin/components/adminSignUp'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AdminSignUp {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index