import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

// Importing components
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import NotFound from './components/NotFound';
import ViewJobDetails from './components/ViewJobDetails';
import OperatorMainMenu from './components/OperatorMainMenu';
import ManageJobs from './components/ManageJobs';
import ManageRunner from './components/ManageRunner';
import CreateNewRunner from './components/CreateNewRunner';
import HistoryLogs from './components/HistoryLogs';
import ViewRunner from './components/ViewRunner';
import CreateNewJob from './components/CreateNewJob';
import RunnerMainMenu from './components/RunnerMainMenu';
import ViewCarparkAvailability from './components/ViewCarparkAvailability';
import ViewJobs from './components/ViewJobs';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route element={<Layout />}>
            {/* Fully Accessible Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<NotFound />} />

            {/* General Routes */}
            <Route path="/viewjobdetails" element={<ViewJobDetails />} />

            {/* Operator Routes */}
            <Route path="/omm" element={<ProtectedRoute element={OperatorMainMenu} allowedUsertype="operator" />} />
            <Route path="/mngjob" element={<ProtectedRoute element={ManageJobs} allowedUsertype="operator" />} />
            <Route path="/mngrnr" element={<ProtectedRoute element={ManageRunner} allowedUsertype="operator" />} />
            <Route path="/createnewrunner" element={<ProtectedRoute element={CreateNewRunner} allowedUsertype="operator" />} />
            <Route path="/createnewjob" element={<ProtectedRoute element={CreateNewJob} allowedUsertype="operator" />} />
            <Route path="/viewrunner" element={<ProtectedRoute element={ViewRunner} allowedUsertype="operator" />} />
            <Route path="/historylogs" element={<ProtectedRoute element={HistoryLogs} allowedUsertype="operator" />} />

            {/* Runner Routes */}
            <Route path="/rmm" element={<ProtectedRoute element={RunnerMainMenu} allowedUsertype="runner" />} />
            <Route path="/viewcarpark" element={<ProtectedRoute element={ViewCarparkAvailability} allowedUsertype="runner" />} />
            <Route path="/viewjobs" element={<ProtectedRoute element={ViewJobs} allowedUsertype="runner" />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
