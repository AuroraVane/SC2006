import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginForm';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';  
import RegisterForm from './components/RegisterForm';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  return (
    <Router>
      <div className='App'>
        <div className = "content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path = "/login" element={<LoginPage />} />
            <Route path = "*" element = {<NotFound />} />
            <Route path = "/dashboard" element = {<Dashboard />} />
            <Route path = "/register" element = {<RegisterForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
