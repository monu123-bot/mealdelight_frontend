import { host } from "./variables";

const verifyToken = async () => {
    const token = localStorage.getItem('mealdelight');
      if (!token) {
        return { isVerified: false, user: null }
      }
    try {
      const response = await fetch(`${host}/user/verifyToken`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return { isVerified: true, user: data.user };
      } else {
        return { isVerified: false, user: null };
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return { isVerified: false, message: 'Internal server error' };
    }
  };

  export {verifyToken}