import Roles from '@WORKFORCE_MODULES/members/components/roles'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Roles {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index