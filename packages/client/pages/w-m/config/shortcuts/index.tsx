import ShortCuts from '@WORKFORCE_MODULES/config/components/shortCuts'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <ShortCuts {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index