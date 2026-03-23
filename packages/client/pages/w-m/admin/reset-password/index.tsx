import AdminResetPassword from '@WORKFORCE_MODULES/admin/components/adminResetPassword'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AdminResetPassword {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index