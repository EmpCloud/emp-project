import RestoreUsers from '@WORKFORCE_MODULES/members/components/restoreUsers'
import React from 'react'

const index = ({ startLoading, stopLoading }) => {
  return (
    <>
   <RestoreUsers {...{ startLoading, stopLoading }} />
   </>
  )
}

export default index