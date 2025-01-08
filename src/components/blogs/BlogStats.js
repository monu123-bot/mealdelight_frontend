import React from 'react'
import { useParams } from 'react-router-dom';
const BlogStats = () => {

    const decrypt = (text)=>{
        return text
    }
    let { authoremail } = useParams();
    authoremail = decrypt(authoremail)

   
  return (
    <div>
      
      blog stats {authoremail}
    </div>
  )
}

export default BlogStats
