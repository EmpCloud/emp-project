import React from 'react'
import View from '@WORKFORCE_MODULES/members/components/view'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <View {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index