import React from 'react'
import PermissionGroup from '@WORKFORCE_MODULES/permission/components/permissions'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <PermissionGroup {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index