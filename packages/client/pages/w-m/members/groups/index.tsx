import Groups from '@WORKFORCE_MODULES/groups/components/groups'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Groups {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index