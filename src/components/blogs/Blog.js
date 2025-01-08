import React from 'react'
import './style/blog.css'
import { host } from '../../script/variables'; 
import { Link } from 'react-router-dom';
import { FaCommentDots } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
const Blog = ({ blog }) => {
  function timeAgo(timestamp) {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);

    const timeDifference = currentTime - previousTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return months === 1 ? '1 month' : months + ' months';
    } else if (weeks > 0) {
      return weeks === 1 ? '1 week' : weeks + ' weeks';
    } else if (days > 0) {
      return days === 1 ? '1 day' : days + ' days';
    } else if (hours > 0) {
      return hours === 1 ? '1 hour' : hours + ' hours';
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute' : minutes + ' minutes';
    } else {
      return seconds <= 5 ? 'just now' : seconds + ' seconds';
    }
  }

  const cropText = (text)=>{
    const words = text.trim().split(/\s+/);

    // Get the first 15 words
    const first15Words = words.slice(0, 8);

    // Join the first 15 words back into a string
    return first15Words.join(' ')+' ';
  }
  return (
    <>
    <div className='blog-container'>
      <div className='blog-card-head'>

        <div className='blog-card-head1'>
          <div className='blog-card-thumbnail'>
            <img className='blog-card-thumbnail' src={`${blog.thumbnail}`} />
          </div>
          <div className='blog-card-head-0'> 
          <div className='blog-card-head-1'>
          <div className='blog-card-title'>
           <h4> {blog.title}</h4>
          </div>
          <div className='blog-card-createdat'>
           <small>{timeAgo(blog.createdAt)}</small> 
          </div>

          </div>
          <div className='blog-card-body '>
          <p><Link to={`/blog/${blog.title}`}>Read full blog...</Link></p>
        </div>
        </div>
        </div>

       
      </div>

      <div className='blog-card-footer'>


        <div className='blog-card-like'>
        <FcLike className='icons' />
        <p><b>  {blog.likeCount}</b></p>
        

        </div>
        <div className='blog-card-comment'>
          <FaCommentDots className='icons'/>
          <p><b>   {blog.commentCount}</b></p>
       
        </div>
        <div className='blog-card-authorname'>
          {blog.authorName}
        </div>
        <div className='blog-card-tags'>
          {blog.tags.map((tag) => (
            <p className='blog-card-tag cutive-mono-regular'>#{tag}</p>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}

export default Blog
