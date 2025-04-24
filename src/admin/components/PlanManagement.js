import React, { useState } from 'react';
import AddMenu from './AddMenu';
import AddPlan from './AddPlan';
import Plans from './Plans';
import Menus from './Menus';
import "./style/PlanManagement.css"; // Import the CSS file for styling

const PlanManagement = () => {
  // Define components with their labels
  const components = [
    { id: 'plans', label: 'View Plans', component: <Plans /> },
    { id: 'menus', label: 'View Menus', component: <Menus /> },
    { id: 'addPlan', label: 'Add Plan', component: <AddPlan /> },
    { id: 'addMenu', label: 'Add Menu', component: <AddMenu /> }
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

export default PlanManagement;