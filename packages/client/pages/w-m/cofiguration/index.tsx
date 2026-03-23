import AdminConfig from '@WORKFORCE_MODULES/cofiguration/components/adminConfig'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AdminConfig {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index