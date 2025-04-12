import logo from './logo.svg';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import UserCreationForm from './components/UserCreationForm';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import UpdatePaymentOrderStatus from './components/UpdatePaymentOrderStatus';
import SinglePlan from './components/SinglePlan';
import BlogsHome from './components/blogs/BlogsHome';
import WriteBlog from './components/blogs/WriteBlog';
import SingleBlog from './components/blogs/SingleBlog';
import BlogStats from './components/blogs/BlogStats';
import MarketSize from './components/survey/MarketSize';

import ContinueMarketSize from './components/survey/ContinueMarketSize';

function App() {
  return (
    
<>
      <Router>
        <Routes>
          <Route path='/'  Component={Home}   exact/>
          <Route   path='/regform' Component={UserCreationForm}    />
          <Route   path='/blog' Component={BlogsHome}    />
          <Route   path='/dashboard' Component={UserDashboard}    />
          <Route   path='/write' Component={WriteBlog}    />
          <Route   path='/blog/:title' Component={SingleBlog}   />
          <Route   path='/blog/stats/:authoremail' Component={BlogStats}   />
          <Route   path='/uos' Component={UpdatePaymentOrderStatus}    />
          <Route path="/plandetails" element={<SinglePlan />} />
          <Route path="/survey/marketsize" element={<MarketSize  />} />
          <Route path="/survey/continue/:survey_Id" element={<ContinueMarketSize  />} />
       </Routes>
      </Router>
      
    
      </>
    
  );
}

export default App;
