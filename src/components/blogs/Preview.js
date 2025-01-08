import React, { useEffect } from 'react'

const Preview = ({html}) => {

 
  return (
    <div className='blog-preview'>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Preview
