import AssignRole from '@WORKFORCE_MODULES/members/components/assignRole'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AssignRole {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index