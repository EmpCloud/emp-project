import React from 'react'
import PermissionGroup from '@WORKFORCE_MODULES/permisssion/components/permissions'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <PermissionGroup {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index