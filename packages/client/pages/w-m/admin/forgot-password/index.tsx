import AdminForgetPassword from '@WORKFORCE_MODULES/admin/components/adminForgetPassword'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AdminForgetPassword {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index