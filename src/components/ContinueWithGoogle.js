import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const clientID = process.env.GOOGLE_CLIENT_ID; // Environment variable, no need for template literals

const ContinueWithGoogle = () => {
  const handleSuccess = (credentialResponse) => {
    console.log("Login Success", credentialResponse);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Login success", decoded);

      axios.post('/api/auth/google', {
        token: credentialResponse.credential,
      })
      .then(res => {
        console.log("Backend login success", res.data);
        localStorage.setItem("token", res.data.token); // Save the token
      })
      .catch(err => {
        console.error("Backend login failed", err);
      });

    } catch (error) {
      console.error("JWT decode failed", error);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </GoogleOAuthProvider>
  );
};

export default ContinueWithGoogle;