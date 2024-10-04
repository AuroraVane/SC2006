import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

// Importing components
import HomePage from './components/HomePage';
import LoginPage from './components/LoginForm';
import NotFound from './components/NotFound';

import ViewJobDetails from './components/ViewJobDetails';

import OperatorMainMenu from './components/OperatorMainMenu';  
import RegisterForm from './components/RegisterForm';

import RunnerMainMenu from './components/RunnerMainMenu';

//Importing Protection
import ProtectedRoute from './components/ProtectedRoute';

// Importing CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  return (
    <Router>
      <div className='App'>
        <div className = "content">
          <Routes>
            {/* Fully Accessible Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path = "/login" element={<LoginPage />} />
            <Route path = "*" element = {<NotFound />} />

            {/* General Routes*/}
            <Route path = "/viewjobdetails" element = {<ViewJobDetails />} />

            {/* Operator Routes */}
            <Route path = "/omm" element={<ProtectedRoute element={OperatorMainMenu} allowedUsertype="operator" />}/>

            <Route path = "/rmm" element = {<ProtectedRoute element= {RunnerMainMenu} allowedUsertype="runner" />} />
            <Route path = "/register" element = {<RegisterForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
