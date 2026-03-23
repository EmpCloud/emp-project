import MemberEmailVerification from '@WORKFORCE_MODULES/member/components/memberEmailVerification'
import React from 'react'
const index = ({startLoading,stopLoading}) => {
  return (
<>
<MemberEmailVerification  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index