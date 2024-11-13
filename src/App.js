import logo from './logo.svg';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import UserCreationForm from './components/UserCreationForm';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import UpdatePaymentOrderStatus from './components/UpdatePaymentOrderStatus';
import SinglePlan from './components/SinglePlan';

function App() {
  return (
    
<>
      <Router>
        <Routes>
          <Route path='/'  Component={Home}   exact/>
          <Route   path='/regform' Component={UserCreationForm}    />
          <Route   path='/dashboard' Component={UserDashboard}    />
          <Route   path='/uos' Component={UpdatePaymentOrderStatus}    />
          <Route path="/plandetails" element={<SinglePlan />} />
       </Routes>
      </Router>
      
    
      </>
    
  );
}

export default App;
