import MemberLogin from '@WORKFORCE_MODULES/member/components/memberLogin'
import React from 'react'
const index = ({startLoading,stopLoading}) => {
  return (
<>
<MemberLogin  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index