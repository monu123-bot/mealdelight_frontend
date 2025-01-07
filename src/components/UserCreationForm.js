import React, { useEffect, useState } from 'react';
import '../style/UserCreationForm.css';
import axios from 'axios';
import { host } from '../script/variables';
import ProgressBar from "@ramonak/react-progress-bar";
import {SkewLoader} from "react-spinner"
import { fn } from 'moment/moment';
import Login from './Login';

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
 const [phoneOtpSent,setPhoneOtpSent] = useState(false)
const [otp,setOtp] = useState(null)
const [isPhoneVerified,setIsPhoneVerified] = useState(false)
const [isPhoneValidv,setIsPhoneValidv] = useState(false)
const [expireAt,setExpiresAt] = useState(null)
const [otpId,setOtpId] = useState(null)
const [otpSending,setOtpSending] = useState(false)
const [isSearchingPostalCode,setIsSearchingPostalCode] = useState(false)
const [isUserRegistered,setIsUserRegistered] = useState(false)
const [message,setMessage] = useState('')
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
    console.log(name,value)
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
      case 'postalcode':  // Updated to match how 'postalcode' is passed in the onChange handler
        setPostalCode(value);
        break;
      case 'street':
        setStreet(value);
        break;
      case 'apartment':
        setApartment(value);
        break;
      // case 'address':
      //   setAddress(value);
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
  const verifyOtp = async (otp,id)=>{
    const data = {id,otp}
    try {
      const resp = await axios.post(`${host}/phone/verifyotp`, data);
      console.log('headers are ',resp)
      if (resp.status === 200) {
        setMessage('Phone Number Verified')
          console.log('otp is verified')
          setIsPhoneVerified(true)
      // localStorage.setItem('mealdelight', token1);
      // navigate('/dashboard');
      } 
      if(resp.status===201){
        setMessage(resp.data.msg)
      }
  } catch (error) {
      console.log("Error show", error)
  }
  }
  const sentOtp = async (phone)=>{
    setOtpSending(true)
    setMessage('Sending OTP...')
    const data = {phone}
    try {
      const resp = await axios.post(`${host}/phone/sentotp`, data);
      
      console.log('headers are ',resp)
      if (resp.status === 200) {
      setMessage("OTP has been sent")
          console.log('otp is ',resp.data.otpId)
          setPhoneOtpSent(true)
          setOtpId(resp.data.otpId)
          // setExpiresAt(resp.data.expireAt)
          setOtpSending(false)
      // localStorage.setItem('mealdelight', token1);
      // navigate('/dashboard');
      } 
      if(resp.status===201){
        setMessage(resp.data.msg)
      }
  } catch (error) {
    setMessage('Server is busy, Please try after some time')
      console.log("Error show", error)
  }
  }
  const handlePostalCodeChange =async (code)=>{
    // console.log(code)
    setPostalCode(code)
    if (code.length === 6) { // Assuming postal code length is 6
      setMessage('Searching Zip Code Details...')
      setIsSearchingPostalCode(true)
      
      console.log(code)
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${code}`);
        if (response.data[0].Status === 'Success') {
          setMessage('')
          console.log(response.data[0].PostOffice)
          setPostOffices(response.data[0].PostOffice || []);
          setIsSearchingPostalCode(false)
        } else {
          setPostOffices([]); // Clear post offices if not found
        }
      } catch (error) {
        setMessage('Server is busy, Please try after some time')
        console.error('Error fetching post offices:', error);
      }
    } else {
      setPostOffices([]); // Reset post offices if postal code is not valid
    }

  }
  const handlePhoneChange = (val)=>{
    // console.log(val)

    setPhone(val)         
    setIsPhoneVerified(false)
    setOtpSending(false)
    setPhoneOtpSent(false)
    setIsPhoneValidv(false)
    // isPhoneValid(val)
  }
  const saveUser = async ()=>{
    setMessage('Saving Your Details...')
    const data = {
      firstName:fName, lastName:lName, email:email, phone:phone, password:password
      // , street:street, apartment:apartment, city:city, state:state, postalCode:postalcode,address:address
    }
    try {
      const resp = await axios.post(`${host}/user/create`, data);
      console.log('headers are ',resp)
      if (resp.status === 200) {
        setMessage('')
         console.log('account created')
         setIsUserRegistered(true)
      } 
  } catch (error) {
      console.log("Error show in frontend", error)
  }
  }
  const columns = ['name','phone','email','password','postalCode','street','apartment']
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
            onChange={(e) => handlePhoneChange(e.target.value)} 
            placeholder='phone' 
          />
          {
            otpSending && <>  <p style={{color:'#cdedf6',marginLeft:"auto",marginRight:"auto"}}>{message}</p>
            
            </>
          }
          <br/>
          { !otpSending && isPhoneValidv && !phoneOtpSent &&  <button className='innerCont' onClick={()=>{sentOtp(phone)}} > Send OTP </button>}
          <br/>
          {isPhoneValidv && phoneOtpSent && !isPhoneVerified && (
            <input 
            className='inp' 
            type="text" 
            value={otp} 
            onChange={(e) => {setOtp(e.target.value)}} 
            placeholder='OTP' 
          />
          ) }
          {isPhoneVerified && <p style={{color:"#cdedf6",marginLeft:"auto",marginRight:"auto"}}>{message}</p>}
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
    }
    // {
    //   html: (
    //     <>
    //       <p className='reg-form-h'>{fName} <br/> Let's connect <br/> Your address ?</p><br/>
         
        
    //       <input 
    //         className='inp' 
    //         type="text" 
    //         value={apartment} 
    //         onChange={(e) => handleInputChange('apartment', e.target.value)} 
    //         placeholder='Apartment /Flat' 
    //       />
    //       <br/>
    //        <input 
    //         className='inp' 
    //         type="text" 
    //         value={street} 
    //         onChange={(e) => handleInputChange('street', e.target.value)} 
    //         placeholder='Street' 
    //       />
          
    //       <br/>
    //       <input 
    //         className='inp' 
    //         type="text" 
    //         value={postalcode} 
    //         onChange={(e) => handlePostalCodeChange(e.target.value)} 
    //         placeholder='Zip Code' 
    //       />
    //       <br/>
    //       {isSearchingPostalCode && <p style={{color:"#cdedf6",marginLeft:"auto",marginRight:"auto"}}>{message}</p>}
    //       {
    //       postOffices && postOffices.length > 0 && (
    //     <select className="inp" value={selectedPostOffice} onChange={handlePostOfficeChange}  style={{ marginTop: '7px', marginBottom: '7px', marginLeft: '2px', marginRight: '2px' }} >
    //       <option value="">Select Post Office</option>
    //       {postOffices.map((postOffice,index) => (
    //         <option key={index} value={postOffice.Name}>
    //           {postOffice.Name}
    //         </option>
    //       ))}
    //     </select>
    //   )}
    //   <br/>
    //   <input 
    //         className='inp' 
    //         type="text" 
    //         value={city} 
            
    //         placeholder='City' 
            
    //       />
    //       <br/>
    //        <input 
    //         className='inp' 
    //         type="text" 
    //         value={state} 
            
    //         placeholder='State' 
            
    //       />
    //   <br/>
    //       <textarea 
    //         className='inp' 
    //         type="text" 
    //         value={address} 
    //         onChange={(e) => handleInputChange('address', e.target.value)} 
    //         placeholder='Full Address' 
    //       />
    //       <br/>
    //     </>
    //   )
    // }
  ];
  const isNameValid = ()=>{
   // Check if first or last name is empty
   if (!fName || !lName)
{
  return false
}  if (fName.trim() === '' || lName.trim() === '') {         
    return false;
  }

  // Check if first or last name contains spaces
  if (fName.includes(' ') || lName.includes(' ')) {
    return false;
  }

  // Check for non-alphabetic characters
  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
    return false;
  }

  // Check for name length (usually a minimum of 2 characters and a reasonable max length)
  if (fName.length < 2 || fName.length > 50 || lName.length < 2 || lName.length > 50) {
    return false;
  }
    return true
  }
  const isEmailValid = ()=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  }
  const isPhoneValid = (val)=>{
    console.log(val)
    if(!val){
      return false
  }
    // Remove spaces, dashes, or parentheses (common formatting symbols)
  const sanitizedVal = val.replace(/[\s\-()]/g, '');

  // Regular expression to validate 10-digit Indian phone number starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;

  // Optional country code (+91) with 10-digit phone number
  const phoneWithCountryCodeRegex = /^(\+91)?[6-9]\d{9}$/;

  // Log the value being checked (for debugging purposes)
  console.log(sanitizedVal);

  // Check if phone number is valid with or without country code
  if (phoneWithCountryCodeRegex.test(sanitizedVal)) {
    return true;
  }

  return false;
  }
  const isPasswordValid = ()=>{
    return true
  }
  const handleNext = ()=>{
    console.log(phone)
    if(index==0){
      
      if(!isNameValid()){
          alert('Enter name')
          return
      }
      setPhone('')
    }
    if(index==1){
      if(!isPhoneValid(phone) ){
        
        alert("Enter Phone Number")
        return
      }
      if(!isPhoneVerified){
        alert("Verify Phone Number")
        return 
      }
      setEmail('')
      
    }
    if(index==2){
      if(!isEmailValid()){
        alert("Enter Email")
        return
      }
      setPassword('')
    }
    if(index==3){
      if(!isPasswordValid()){
        alert("Enter Email")
        return
      }
      setApartment('')

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
useEffect(()=>{

  if(otp && otp.length==4){
    verifyOtp(otp,otpId)
  }
},[otp])
useEffect(()=>{

  if(isPhoneValid(phone)){
        
    setIsPhoneValidv(true)
  }
  else{
    setIsPhoneValidv(false)
  }
  
},[phone])
  return (
    <>
    <div className='regform-container'>

    
    <div className='logo_div'>
    <img className='logo_img' src='/logo_transparent.svg' />
    
    </div>
        
    <div className='updateprofmaindiv'>

      {!isUserRegistered && <>
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
    {
  (index===content.length-1) && <><div className='innerCont' onClick={()=>{handlePrev()}}>Prev</div> <div className='innerCont' onClick={()=>{saveUser()}}>Save Details</div></>
    }
  
    
      </div>
      </>  }
      {(isUserRegistered) && <>
      <div className="success-container">
    <div className="circle">
      
      <div className="checkmark"></div>
    </div>
    <div className="success-message">
      Your account has been created successfully!
    </div>
    
  </div>
  <Login/>
    </>}

      
    </div>
  

   
  
    </div>
    
    </>
  );
}

export default UserCreationForm;