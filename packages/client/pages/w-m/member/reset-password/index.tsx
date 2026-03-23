import MemberResetPassword from '@WORKFORCE_MODULES/member/components/memberResetPassword'
import React from 'react'
const index = ({startLoading,stopLoading}) => {
  return (
<>
<MemberResetPassword  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index