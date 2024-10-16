import React, { useState } from 'react';
import '../style/UserCreationForm.css';
import axios from 'axios';
import { host } from '../script/variables';
import ProgressBar from "@ramonak/react-progress-bar";

import { fn } from 'moment/moment';

function UserCreationForm() {

  const [fName,setfname] = useState(null)
  const [lName,setlName] = useState(null)
  const [phone,setPhone] = useState(null)
  const [email,setEmail] = useState(null)
  const [password,setPassword] = useState(null)
  const [street,setStreet] = useState(null)
  const [apartment,setApartment] = useState(null)
  const [city,setCity] = useState(null)
  const [state,setState] = useState(null)
  const [postalcode,setPostalCode] = useState(null)
  const [address,setAddress] = useState(null)
  const [name,setName] = useState(null)
  const [index,setIndex] = useState(0)
 const [postOffices,setPostOffices] = useState([])
 const [selectedPostOffice, setSelectedPostOffice] = useState('');  // Selected post office

 const handlePostOfficeChange = (e) => {
  const selectedPostOfficeName = e.target.value;
  setSelectedPostOffice(selectedPostOfficeName);

  // Find the selected post office from the array
  const selectedPostOffice = postOffices.find(postOffice => postOffice.Name === selectedPostOfficeName);

  if (selectedPostOffice) {
    setState(selectedPostOffice.State);
    setCity(selectedPostOffice.Region);
  }
};
  const handleInputChange = (name, value) => {
    switch (name) {
      case 'fName':
        setfname(value);
        break;
      case 'lName':
        setlName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        break;
      case 'street':
        setStreet(value);
        break;
      case 'apartment':
        setApartment(value);
        break;
      case 'address':
        setAddress(value);
        break;
      default:
        break;
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`${host}/user/create`, formData);
  //     alert(response.data.msg);
  //   } catch (error) {
  //     alert('Error creating user: ' + error.response?.data?.msg || error.message);
  //   }
  // };
  const handlePostalCodeChange =async (code)=>{
    // console.log(code)
    setPostalCode(code)
    if (code.length === 6) { // Assuming postal code length is 6
      console.log(code)
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
        if (response.data[0].Status === 'Success') {
          console.log(response.data[0].PostOffice)
          setPostOffices(response.data[0].PostOffice || []);
        } else {
          setPostOffices([]); // Clear post offices if not found
        }
      } catch (error) {
        console.error('Error fetching post offices:', error);
      }
    } else {
      setPostOffices([]); // Reset post offices if postal code is not valid
    }

  }
  const columns = ['name','phone','email','password','postalCode','street','apartment','address']
  const content = [
    {
      html: (
        <>
          <p className='reg-form-h'>Your Name</p><br/>
          <input 
            className='inp' 
            type="text" 
            value={fName} 
            onChange={(e) => handleInputChange('fName', e.target.value)} 
            placeholder='First Name' 
          />
          <br/>
          <input 
            className='inp' 
            type="text" 
            value={lName} 
            onChange={(e) => handleInputChange('lName', e.target.value)} 
            placeholder='Last Name' 
          />
        </>
      )
    },
    {
      html: (
        <>
          <p className='reg-form-h'>Hy {fName} <br/>What's your contact number</p><br/>
          <input 
            className='inp' 
            type="text" 
            value={phone} 
            onChange={(e) => handleInputChange('phone', e.target.value)} 
            placeholder='phone' 
          />
          <br/>
        </>
      )
    },
    {
      html: (
        <>
          <p className='reg-form-h'>Hy {fName}! <br/> What's Your email</p><br/>
          <input 
            className='inp' 
            type="email" 
            value={email} 
            onChange={(e) => handleInputChange('email', e.target.value)} 
            placeholder='email' 
          />
          <br/>
        </>
      )
    },
    {
      html: (
        <>
          <p className='reg-form-h'>Hy {fName}! <br/>Set your password</p><br/>
          <input 
            className='inp' 
            type="password" 
            value={password} 
            onChange={(e) => handleInputChange('password', e.target.value)} 
            placeholder='password' 
          />
          <br/>
        </>
      )
    },
    {
      html: (
        <>
          <p className='reg-form-h'>{fName} <br/> Let's connect <br/> Your address ?</p><br/>
         
        
          <input 
            className='inp' 
            type="text" 
            value={apartment} 
            onChange={(e) => handleInputChange('apartment', e.target.value)} 
            placeholder='apartment /flat /room' 
          />
          <br/>
           <input 
            className='inp' 
            type="text" 
            value={street} 
            onChange={(e) => handleInputChange('street', e.target.value)} 
            placeholder='street' 
          />
          
          <br/>
          <input 
            className='inp' 
            type="text" 
            value={postalcode} 
            onChange={(e) => handlePostalCodeChange(e.target.value)} 
            placeholder='postal code' 
          />
          <br/>
          
          {
          postOffices && postOffices.length > 0 && (
        <select className="inp" value={selectedPostOffice} onChange={handlePostOfficeChange}  style={{ marginTop: '7px', marginBottom: '7px', marginLeft: '2px', marginRight: '2px' }} >
          <option value="">Select Post Office</option>
          {postOffices.map((postOffice,index) => (
            <option key={index} value={postOffice.Name}>
              {postOffice.Name}
            </option>
          ))}
        </select>
      )}
      <br/>
      <input 
            className='inp' 
            type="text" 
            value={city} 
            
            placeholder='City' 
          />
          <br/>
           <input 
            className='inp' 
            type="text" 
            value={state} 
            
            placeholder='State' 
          />
      <br/>
          <input 
            className='inp' 
            type="text" 
            value={address} 
            onChange={(e) => handleInputChange('address', e.target.value)} 
            placeholder='address' 
          />
          <br/>
        </>
      )
    }
  ];
  const isNameValid = ()=>{
    return false
  }
  const isEmailValid = ()=>{
    return false
  }
  const isPhoneValid = ()=>{
    return false
  }
  const isPasswordValid = ()=>{
    return false
  }
  const handleNext = ()=>{
    if(index==0){
      if(isNameValid()){
          alert('Enter name')
          return
      }
    }
    if(index==1){
      if(isPhoneValid()){
        alert("Enter Phone Number")
        return
      }
    }
    if(index==2){
      if(isEmailValid()){
        alert("Enter Email")
        return
      }
    }
    if(index==3){
      if(isPasswordValid()){
        alert("Enter Email")
        return
      }
    }
    
      if(index+1<content.length){
        setIndex(index+1)
      }
      
  }
  const handlePrev = ()=>{
     if(index-1>=0){
      setIndex(index-1)
     }
  }
  return (
    <>
    <div className='regform-container'>

    
    <div className='logo_div'>
    <img className='logo_img' src='/logo_transparent.svg' />
    
    </div>
        
    <div className='updateprofmaindiv'>
      <div className='progressbar'><ProgressBar isLabelVisible={false}  height='6px' bgColor='green' completed={((index+1)/content.length)*100} /></div>
      
      
      <div className='mainDiv comp'>
        {content[index].html}
      </div>
      <br/>
      <div className='compnb'>
        
   
        {
          (index===0 || index===content.length-1) ? ' ' : <div className='innerCont' onClick={()=>{handlePrev()}}>Prev</div>
        }
      
      {
        (index===content.length-1) ? '' :       <div className='innerCont' onClick={()=>{handleNext()}}>Save & Next</div>

      }
    
  
    
      </div>
    </div>

      
    </div>
    
    </>
  );
}

export default UserCreationForm;
