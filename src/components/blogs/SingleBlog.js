import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { host } from '../../script/variables';
import './style/blog.css';
import { PiHandsClappingDuotone } from "react-icons/pi";
// import Comments from '../Comments';
import Blog from './Blog';

const SingleBlog = () => {
    const { title } = useParams();
    const [blog, setBlog] = useState(null);
    const [isClapped, setIsClapped] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [claps, setClaps] = useState(0);
    const [blogId, setBlogId] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const [authorBlogs,setAuthorBlogs] = useState([])
const [tagBlogs,setTagBlogs] = useState([])

    const encryption = (text)=>{
        return text
    }
    const fetchMoreWithTags =async () =>{
        try {
            const tags = blog.tags
           const payload = {tags}
            const response = await fetch(`${host}/blog/tagblog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setTagBlogs(data)
            }
            else{
                console.log('error in fetching blogs from tag backend')
            }
        } catch (error) {
            console.log('error in fetching blogs from tag frontend')

        }
    }
    const fetchMoreWithAuthor =async () =>{
        console.log('tags feetching is running')
        try {
            const authoremail = blog.authorDetails.email
           
            const response = await fetch(`${host}/blog/authorblog?em=${encryption(authoremail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAuthorBlogs(data)
            }
            else{
                console.log('error in fetching blogs from author backend')
            }
        } catch (error) {
            console.log('error in fetching blogs from author frontend')

        }
    }
    const fetchBlog = async () => {
        console.log('fetchblog running');
        try {
            const payload = { title };
            const response = await fetch(`${host}/blog/fetchbytitle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data[0]);
                setBlogId(data[0]._id);
                setBlog(data[0]);
                setClaps(data[0].likeCount);
                setCommentCount(data[0].commentCount);
                
            }
        } catch (error) {
            console.log('there is an error in fetching blog');
        }
    };

    const CheckIsClapped = async () => {
        try {
            const token = localStorage.getItem('mealdelight');
            const response = await fetch(`${host}/blog/checkisclapped/?title=${title}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('isclapped is ', data);
                setIsClapped(data);
            }
        } catch (error) {
            console.log('error in checking is clapped');
        }
    };

    const objToHtml = (obj) => {
        const type = obj.type;
        if (type === 'header') {
            return `<h${obj.data.level}>${obj.data.text}</h${obj.data.level}>`;
        } else if (type === 'paragraph') {
            return `<p>${obj.data.text}</p>`;
        } else if (type === 'list') {
            let listItems = '';
            for (let item of obj.data.items) {
                listItems += `<li>${item}</li>`;
            }
            return obj.data.style === 'ordered' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
        } else if (type === 'image') {
            return `
                <figure>
                    <img src=${obj.data.file.url} alt="Blog Image" />
                    <figcaption><small>${obj.data.caption}</small></figcaption>
                </figure>
            `;
        }
        return '';
    };

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
            return months === 1 ? '1 month' : `${months} months`;
        } else if (weeks > 0) {
            return weeks === 1 ? '1 week' : `${weeks} weeks`;
        } else if (days > 0) {
            return days === 1 ? '1 day' : `${days} days`;
        } else if (hours > 0) {
            return hours === 1 ? '1 hour' : `${hours} hours`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 minute' : `${minutes} minutes`;
        } else {
            return seconds <= 5 ? 'just now' : `${seconds} seconds`;
        }
    }

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
                CheckIsClapped();
            } else {
                setIsLogin(false);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    };

    const clapp = async (id) => {
        try {
            const payload = { bid: id, isClapped: isClapped };
            const token = localStorage.getItem('mealdelight');
            const response = await fetch(`${host}/blog/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setClaps(isClapped ? claps - 1 : claps + 1);
                setIsClapped(!isClapped);
            } else {
                setIsClapped(false);
            }
        } catch (error) {
            console.log('Error in clapping', error);
        }
    };

    useEffect(() => {
        console.log('useeffect run');
        checkLogin();
        fetchBlog();
        
        
    }, [title]);
   useEffect(()=>{fetchMoreWithAuthor()

    
   },[blog])

   useEffect(()=>{fetchMoreWithTags()},[authorBlogs])
    const encrypt = (text) => text;

    return (
        <div className='single-blog-container'>
            {!blog && (
  <div 
    style={{
      backgroundColor: '#f8d7da', 
      color: '#721c24', 
      border: '1px solid #f5c6cb', 
      borderRadius: '5px', 
      padding: '15px', 
      textAlign: 'center', 
      fontSize: '16px', 
      fontWeight: 'bold', 
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <span>📝 Now your article is under review... it will be live once approved by our team.</span>
  </div>
)}

            {blog && (
                <>
                    <h1 className='rajdhani-font'>{blog.title}</h1>
                    <br />
                    <div className='single-blog-header'>
                        {blog.authorDetails && (
                            <p>
                                {/* <img style={{ width: '20px' }} src={blog.authorDetails.image} alt="Author" /> */}
                                <Link to={`/user?id=${encrypt(blog.authorDetails.email)}`}>
                                    {blog.authorDetails.username}
                                </Link>
                            </p>
                        )}
                        {/* <small>Published {timeAgo(blog.createdAt)} ago</small> */}
                    </div>
                    <br />
                    <div className='blog-div roboto-thin' dangerouslySetInnerHTML={{ __html: blog.body.map(objToHtml).join('') }} />
                    <br />
                    <br/>
                    <hr/>

                    <div className='single-blog-taglist'>
                        {blog.tags && blog.tags.map((tag) => (
                            <p className='cutive-mono-regular blog-card-tag' key={tag}>#{tag}</p>
                        ))}
                    </div>
                    <hr />
                    <br/>
                    {/* <div className='single-blog-footer'>
                        <div className='single-blog-like'>
                            {isClapped ? (
                                <PiHandsClappingDuotone onClick={() => clapp(blog._id)} style={{ fontSize: '30px', color: 'red' }} />
                            ) : (
                                <PiHandsClappingDuotone onClick={() => clapp(blog._id)} style={{ fontSize: '30px' }} />
                            )}
                            {claps} claps
                        </div>
                    </div> */}
                </>
            )}
            <br/>
            {/* <div>
                {blogId !== null && (
                    // <Comments postid={blogId} setCommentCount={setCommentCount} commentCount={commentCount} isLogin={isLogin} isBlog={true} />
                )}
            </div> */}
            {authorBlogs.length>1 &&  <h4>More from {blog.authorDetails.username}</h4> }
           
            <div className='more-blogs-author'>
             
            {authorBlogs &&  authorBlogs.map((blog1, index) => (
                (blog._id!==blog1._id) ? <Blog key={index} blog={blog1}  /> : ""

                
          ))}

                
            </div>
{tagBlogs.length>1 && <h4>Simillar topics</h4>}
            <div className='more-blogs-tags'>
            {tagBlogs &&  tagBlogs.map((blog1, index) => (
            (blog._id!==blog1._id) ? <Blog key={index} blog={blog1}  /> : ""
          ))}
            </div>
        </div>
    );
};

export default SingleBlog;
