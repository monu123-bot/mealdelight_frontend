import React, { useEffect, useState, useRef } from 'react';
import { checkLogin } from '../../script/tokenVerification';


import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');
import "quill/dist/quill.snow.css"; // Add css for snow theme
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

import { host } from '../../script/variables';
import './style/blog.css';
import Preview from './Preview';
import Editor from './Editor';

const WriteBlog = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [mapState, setMapState] = useState(new Map([[0, '']]));
  const [title,setTitle] = useState('')
  const [content, setContent] = useState('');
  const [curIndex, setCurIndex] = useState(1);
  const [isPreview,setIsPreview] = useState(false)
  const { quill, quillRef } = useQuill();
  const [tags,setTags] = useState([])
  const [titleAv,setTitleAv] = useState(true)

  const [isPublished,setIsPublished] = useState(false)
  const token = localStorage.getItem('mealdelight');

  useEffect(() => {
    async function checklogin() {
      const login = await checkLogin();
      setIsLogin(login);
    }
    checklogin();
  }, []);

const changeTagInput = (select)=>{
console.log(select)


}






const checkTitleAvailability = async (title)=>{
// write title to remove spaces from it 

  try {
    const response = await fetch(`${host}/blog/checktitle?tname=${title}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    // console.log("cafes are",response)
    if (response.status===200) {
      
     
     
      const data = await response.json();

      if(data.length>0){
        setTitleAv(false)
      }
      else{
        setTitleAv(true)
      }
    }
    else{
      console.log('eror in backend')
    }
  } catch (error) {
    console.log('error in checking title name front')
  }

}
  return (
    <>
      
      <br/>
      <div className='blog-write-container'>
      <div className='blog-write-title'>
      
      <textarea
        
        value={title}
        onChange={(e)=>{
          setTitle(e.target.value)
          checkTitleAvailability(e.target.value)
        }}
        className='blog-write-text'
        placeholder='Title here...'
        style={{ height: 'auto', resize: 'none', fontSize: '30px',fontWeight:'bolder' }}
        rows={1}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
      <small>{(titleAv) ? <p style={{color:'green'}}>Available</p> : <p style={{color:'red'}}>Not available</p>} </small>
      </div>
      
      <div className='blog-write-main-div'>
      <Editor title={title} titleAv={titleAv} />
     
      
      </div>
      {/* {quill &&  <Preview html={quill.container.innerHTML} /> } */}
      <br/><br/>
      
      </div>
   
    </>
  );
};

export default WriteBlog;
