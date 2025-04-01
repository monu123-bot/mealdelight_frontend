
import React, { useState } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import { host } from '../../script/variables';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { useNavigate } from 'react-router-dom';
import ThumbnailUploader from './Thumbnail';

const ReactEditorJS = createReactEditorJS();

const BlogEditor = ({ title, titleAv }) => {
  
  const editorCore = React.useRef(null);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [taglist, setTagList] = useState([{ value: 'dosa', label: 'dosa' }]);
  const [thumbnailUrl,setThumbnailUrl] = useState('#')
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem('mealdelight');

  // AWS S3 Configuration
  const S3_BUCKET = 'foodieadvisormedia'; // Replace with your bucket name
  const REGION = 'us-east-1'; // Replace with your region
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: 'AKIAYS2NR76AMBVYZPGO', // Replace with your access key
      secretAccessKey: 'fedxYle7pzNqOrVy/0W9OZvrq+LyQfnHINAiHWm4', // Replace with your secret key
    },
  });


  const uploadFile = async (blogimg) => {
    if (!blogimg) {
      alert('Please select a file to upload.');
      return;
    }

    const file = blogimg;
    const contentType = file.type;

    if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
      alert('Please choose a JPEG or PNG file format');
      return;
    }
   let file_name = file.name.replace(/\s+/g, '');
    const filename = `${Date.now()}_${Math.floor(Math.random() * 1000)}_${file_name}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: filename,
      Body: file,
      ContentType: contentType,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      const imgUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${filename}`;
      return imgUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleTagSelect = (selected) => {
    if (tags.length >= 3) {
      alert('Only 3 tags are allowed');
      return;
    }

    setTags(selected);
    console.log(tags);
  };

  const fetchtaglist = async (inp) => {
    try {
      const response = await fetch(`${host}/blog/fetchtags?tname=${inp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return data.map((d) => ({ value: d.name, label: d.name }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleThumbnailUpload = async(event)=>{
    
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadFile(file);
      setThumbnailUrl(imageUrl);
      alert('Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Thumbnail upload failed.');
    }
  }

  const handleInitialize = React.useCallback((instance) => {
    editorCore.current = instance;
  }, []);

  const handleSave = async () => {
    if (title === '') {
      alert('Please enter title');
      return;
    }
    if (!titleAv) {
      alert('Title is already used. Please change the title');
      return;
    }
    setIsSaving(true);
    const savedData = await editorCore.current.save();
    const payload = {
      title,
      body: savedData.blocks,
      status: 'published',
      tags: tags,
      thumbnail:thumbnailUrl
    };

    try {
      const response = await fetch(`${host}/blog/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setIsSaving(false);
        navigate(`/blog/${title}`);
      } else {
        console.log('Data not sent to the backend:', response.data);
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
    }
  };

  const imageUpload = async (file) => {
    try {
      const imageUrl = await uploadFile(file);
      return {
        success: 1,
        file: {
          url: imageUrl,
        },
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      return {
        success: 0,
        message: 'Image upload failed',
      };
    }
  };

  const EDITOR_JS_TOOLS = {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        placeholder: 'Enter a heading',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 2,
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: {
      class: Image,
      config: {
        uploader: {
          uploadByFile(file) {
            return imageUpload(file);
          },
          uploadByUrl(url) {
            return {
              success: 1,
              file: {
                url: url,
              },
            };
          },
        },
      },
    },
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
          coub: true,
        },
      },
    },
  };

  return (
    <>
   <ThumbnailUploader uploadFile={uploadFile}  thumbnailUrl={thumbnailUrl} setThumbnailUrl={setThumbnailUrl}/>
      <div className='blog-write-editor'>
        <ReactEditorJS onInitialize={handleInitialize} tools={EDITOR_JS_TOOLS} />
      </div>
      <div className='blog-write-tag'>
        <AsyncCreatableSelect
          placeholder="Add tags"
          loadOptions={fetchtaglist}
          value={tags}
          isMulti
          onChange={handleTagSelect}
        />
      </div>
      <button className='btn btn-primary' onClick={handleSave}>
        {isSaving ? 'Publishing...' : 'Publish'}
      </button>
    </>
  );
};

export default BlogEditor;