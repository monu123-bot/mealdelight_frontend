import React, { useState } from 'react';
import Profiles from './Profiles';
import History from './History';
import "./style/customerManagement.css"; // Import the CSS file for styling
import TransactionsList from './TransactionOrderList';
import UserActivityHistory from './UserActivityHistory';

const CustomerManagement = () => {
  // Define components with their labels
  const components = [
    { id: 'profiles', label: 'Customer Profiles', component: <Profiles /> },
    { id: 'history', label: 'Transaction', component: <History /> },
    { id: 'Transaction', label: 'Payment Order', component: <TransactionsList /> },
    { id: 'UserActivity', label: 'User Activity', component: <UserActivityHistory /> },

    // You can easily add more subcomponents here in the future
  ];

  // State to track active component
  const [activeComponent, setActiveComponent] = useState(components[0].id);

  // Handler for changing the active component
  const handleComponentChange = (componentId) => {
    setActiveComponent(componentId);
  };

  // Get the currently active component
  const renderActiveComponent = () => {
    const component = components.find(comp => comp.id === activeComponent);
    return component ? component.component : null;
  };

  return (
    <div className="customer-management-container">
      <div className="horizontal-slider">
        {components.map((comp) => (
          <button
            key={comp.id}
            className={`slider-tab ${activeComponent === comp.id ? 'active' : ''}`}
            onClick={() => handleComponentChange(comp.id)}
          >
            {comp.label}
          </button>
        ))}
      </div>
      
      <div className="component-container">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default CustomerManagement;