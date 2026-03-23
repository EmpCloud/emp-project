import View from '@WORKFORCE_MODULES/admin/components/view'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <View {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index