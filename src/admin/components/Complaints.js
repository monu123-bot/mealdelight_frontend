import React, { useState } from 'react';
import WalletComplaints from './WalletComplaints';
import './style/complaint.css'; // Make sure to create this CSS file

const Complaints = () => {
  // Define components with their labels
  const components = [
    { id: 'walletComplaints', label: 'Wallet Complaints', component: <WalletComplaints /> },
    // Add more components here as needed, for example:
    // { id: 'accountComplaints', label: 'Account Complaints', component: <AccountComplaints /> },
    // { id: 'serviceComplaints', label: 'Service Complaints', component: <ServiceComplaints /> },
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
    <div className="plan-management-container">
      {/* Horizontal slider for component selection */}
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
      
      {/* Component display area */}
      <div className="component-container">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Complaints;