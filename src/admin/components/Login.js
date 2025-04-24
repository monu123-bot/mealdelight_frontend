import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import './style/login.css'
import { host } from '../../script/variables'

const Login = ({ isLogin, setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await axios.post(`${host}/admin/login`, formData)

      const { token } = response.data

      // Store token in cookie (valid for 7 days)
      Cookies.set('adminToken', token, { expires: 7 })

      alert('Login successful!')
      setIsLogin(true)
    } catch (err) {
      console.error(err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
