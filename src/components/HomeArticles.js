import React, { useState, useEffect } from 'react';
import { host } from '../script/variables';
import '../style/HomeArticles.css';
import { Link } from 'react-router-dom';
import { MdOutlineReadMore } from "react-icons/md";
import Spinner from './spinner/Spinner';
const HomeArticles = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${host}/blog/homeBlogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });


      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data); // Assuming backend returns an array of blog objects
    } catch (error) {
      console.error('Error fetching blogs:', error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []); // Fetch blogs on component mount

  return (
    <div className="home-blogs-container">
       <h2 className='q1-h'>Latest Articles</h2>
      <div className="blogs-slider">
        {blogs.length ==0 && <Spinner/>}
        {blogs.map((blog) => (
          <Link 
            key={blog._id} 
            to={`/blog/${blog.title}`} // Correct query parameter for blogs
          >
            <div className="blog-card">
            <p>{blog.title.substring(0, 30)}</p>

              <img style={{width:'200px'}} src={`${blog.thumbnail}`} />
            </div>
          </Link>
        ))}
        <Link 
            key={'more'}
            to={`/blog`} // Correct query parameter for blogs
          >
            <div className="blog-card">
            <MdOutlineReadMore style={{fontSize:'200px',color:'#cdedf6'}} />
            </div>
          </Link>
      </div>
    </div>
  );
};

export default HomeArticles;
