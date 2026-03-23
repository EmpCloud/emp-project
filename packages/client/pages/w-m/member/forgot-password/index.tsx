import MemberForgetPassword from '@WORKFORCE_MODULES/member/components/memberForgetPassword'
import React from 'react'
const index = ({startLoading,stopLoading}) => {
  return (
<>
<MemberForgetPassword  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index