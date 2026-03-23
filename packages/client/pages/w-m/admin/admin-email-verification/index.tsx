import AdminEmailVerification from '@WORKFORCE_MODULES/admin/components/adminEmailVerification'
import React from 'react'
const index = ({startLoading,stopLoading}) => {
  return (
<>
<AdminEmailVerification  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index