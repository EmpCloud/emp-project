import SuspendedUsers from '@WORKFORCE_MODULES/members/components/suspendedUsers'
import React from 'react'

const index = ({ startLoading, stopLoading }) => {
  return (
    <>
   <SuspendedUsers {...{ startLoading, stopLoading }} />
   </>
  )
}

export default index