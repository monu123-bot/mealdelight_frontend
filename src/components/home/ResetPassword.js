import React, { useEffect, useState } from 'react';
import '../../style/UserCreationForm.css';
import axios from 'axios';
import { host } from '../../script/variables';

function ResetPassword() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const [isPhoneValidv, setIsPhoneValidv] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const isPhoneValid = (val) => {
    const sanitized = val?.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(sanitized);
  };

  const handlePhoneChange = (val) => {
    setPhone(val);
    setIsPhoneVerified(false);
    setOtp('');
    setOtpId(null);
    setMessage('');
  };

  const sendOtp = async () => {
    try {
      setMessage('Sending OTP...');
      const resp = await axios.post(`${host}/phone/sentotp_f`, { phone });
      if (resp.status === 200) {
        setOtpId(resp.data.otpId);
        setMessage('OTP has been sent');
        setStep(1);
      } else {
        setMessage(resp.data?.msg || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('Error: Try again later');
    }
  };

  const verifyOtp = async () => {
    try {
      setMessage('Verifying OTP...');
      const resp = await axios.post(`${host}/phone/verifyotp`, { otp, id: otpId });
      if (resp.status === 200) {
        setIsPhoneVerified(true);
        setMessage('OTP verified successfully');
        setStep(2);
      } else {
        setMessage(resp.data?.msg || 'Incorrect OTP');
      }
    } catch (error) {
      setMessage('Error verifying OTP');
    }
  };

  const updatePassword = async () => {
    try {
      setMessage('Updating password...');
      const resp = await axios.post(`${host}/user/forgotpassword`, {
        phone,
        newPassword,
        otpId,
        otp,
      });
      if (resp.status === 200) {
        setMessage('Password updated successfully');
        setStep(3);
      } else {
        setMessage(resp.data?.msg || 'Failed to update password');
      }
    } catch (error) {
      setMessage('Server error while updating password');
    }
  };

  useEffect(() => {
    setIsPhoneValidv(isPhoneValid(phone));
  }, [phone]);

  return (
    <div className="regform-container">
      {/* <div className="logo_div">
        <img className="logo_img" src="/logo_transparent.svg" alt="logo" />
      </div> */}

      <div className="updateprofmaindiv">
        {step === 0 && (
          <div className="mainDiv comp">
            <p className="reg-form-h">Enter your registered phone number</p>
            <input
              className="inp"
              type="text"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Phone Number"
            />
            {isPhoneValidv && (
              <div className="innerCont" onClick={sendOtp}>
                Send OTP
              </div>
            )}
            <p style={{ color: '#cdedf6' }}>{message}</p>
          </div>
        )}

        {step === 1 && (
          <div className="mainDiv comp">
            <p className="reg-form-h">Enter OTP sent to {phone}</p>
            <input
              className="inp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <div className="innerCont" onClick={verifyOtp}>
              Verify OTP
            </div>
            <p style={{ color: '#cdedf6' }}>{message}</p>
          </div>
        )}

        {step === 2 && (
          <div className="mainDiv comp">
            <p className="reg-form-h">Enter your new password</p>
            <input
              className="inp"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <div className="innerCont" onClick={updatePassword}>
              Update Password
            </div>
            <p style={{ color: '#cdedf6' }}>{message}</p>
          </div>
        )}

        {step === 3 && (
          <div className="success-container">
            <div className="circle">
              <div className="checkmark"></div>
            </div>
            <div className="success-message">Password reset successfully!</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
