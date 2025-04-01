import React, { useEffect, useState } from 'react';
import Blog from './Blog';
import { host } from '../../script/variables';
import './style/blog.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-bootstrap/esm/Spinner';
import { Link } from 'react-router-dom';

const BlogsHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [pno, setPno] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [searchInp, setSearchInp] = useState('');

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem('mealdelight');
      const response = await fetch(`${host}/user/vlogin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error ", error);
    }
  }

  const fetchBlogs = async (page = 1) => {
    try {
      const payload = {
        searchText: searchInp,
        pageNo: page
      };

      const response = await fetch(`${host}/blog/fetchwithinp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setPno(page + 1);
        setBlogs(prevBlogs => page === 1 ? data : [...prevBlogs, ...data]);
        if (data.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.log('there is an error in fetching blogs');
    }
  }

  useEffect(() => {
    checkLogin();
    fetchBlogs();
  }, []);

  const handleSearch = () => {
    setPno(1);
    setHasMore(true);
    setBlogs([]);
    fetchBlogs(1);
  }

  const handleReset = () => {
    setPno(1);
    setHasMore(true);
    setBlogs([]);
    setSearchInp('');
    fetchBlogs(1);
  }

  return (
    <>
      
      <div className='blog-search'>
        <button onClick={handleReset} style={{ width: '20%',margin:'2px',borderRadius:'12px' }} className='btn btn-sm btn-primary'>Reset</button>
        <input
          style={{ width: '60%', borderRadius: '12px', marginLeft: 'auto', marginRight: 'auto' }}
          type='text'
          value={searchInp}
          onChange={(e) => setSearchInp(e.target.value)}
          placeholder={`Search here...`}
        />
        <button onClick={handleSearch} style={{ width: '20%' ,margin:'2px',borderRadius:'12px'}} className='btn btn-sm btn-primary'>Search</button>
      </div>
      
      <div className='write-blog-button'>
        <Link to={`/write`} >Write your fitness article</Link>
      </div>
      <div className='blog-main-container'>
        <InfiniteScroll
          dataLength={blogs.length} // Important field to render the next data
          next={() => fetchBlogs(pno)}
          hasMore={hasMore}
          loader={
            <Spinner animation="border" role="status">
            </Spinner>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {blogs.map((blog, index) => (
            <Blog key={index} blog={blog}  />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default BlogsHome;
