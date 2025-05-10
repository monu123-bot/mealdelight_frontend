import React, { useState } from 'react'
import Login from './Login'
import FinanceManagement from './FinanceManagement'
import PlanManagement from './PlanManagement'
import CustomerManagement from './CustomerManagement'
import Complaints from './Complaints'
import './style/adminPage.css'

const AdminPage = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [activeComponent, setActiveComponent] = useState('finance')
  
  // Define available components - easily extendable for future components
  const components = [
    { id: 'finance', name: 'Finance', component: <FinanceManagement /> },
    { id: 'plan', name: 'Plan', component: <PlanManagement /> },
    { id: 'customer', name: 'Customer', component: <CustomerManagement /> },
    { id: 'complaints', name: 'Complaints', component: <Complaints /> }
  ]
  
  // Function to handle navigation clicks
  const handleNavClick = (componentId) => {
    setActiveComponent(componentId)
  }
  
  // Function to render the active component
  const renderActiveComponent = () => {
    const component = components.find(comp => comp.id === activeComponent)
    return component ? component.component : null
  }
  
  // Function to handle logout
  const handleLogout = () => {
    setIsLogin(false)
  }

  return (
    <div className="admin-container">
      {!isLogin ? (
        <Login isLogin={isLogin} setIsLogin={setIsLogin} />
      ) : (
        <>
          <header className="admin-header">
            <div className="logo">
              <h2>Admin Dashboard</h2>
            </div>
            
            {/* <nav className="admin-nav">
              <ul>
                {components.map(comp => (
                  <li key={comp.id}>
                    <button 
                      className={activeComponent === comp.id ? 'active' : ''}
                      onClick={() => handleNavClick(comp.id)}
                    >
                      {comp.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav> */}

            <div className="admin-nav">
        {components.map((comp) => (
          <button 
          className={activeComponent === comp.id ? 'active' : ''}
          onClick={() => handleNavClick(comp.id)}
        >
          {comp.name}
        </button>
            
        ))}
      </div>
            
            <small className="admin-actions">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </small>
          </header>
          
          <main className="admin-content">
            {renderActiveComponent()}
          </main>
          
          <footer className="admin-footer">
            <p>&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  )
}

export default AdminPage