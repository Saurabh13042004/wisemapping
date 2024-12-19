import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ReactFlowProvider  } from '@xyflow/react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CanvasPage from './pages/CanvasPage';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './context/authContext';
import RedirectIfLoggedIn from './components/RedirectIfLoggedIn';

const AuthProviderWrapper = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigate={navigate}>{children}</AuthProvider>;
};

function App() {
  return (
      <ReactFlowProvider >
        <Router>
          <AuthProviderWrapper>
          <div className="App" >
            <Routes>
              <Route 
                  path="/" 
                  element={
                    <RedirectIfLoggedIn>
                      <LandingPage />
                    </RedirectIfLoggedIn>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <RedirectIfLoggedIn>
                      <Login />
                    </RedirectIfLoggedIn>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <RedirectIfLoggedIn>
                      <Register />
                    </RedirectIfLoggedIn>
                  } 
                />
              <Route
                path="/canvas/:id"
                element={
                  <PrivateRoute>
                    <CanvasPage/>
                  </PrivateRoute>
                } 
              />
              <Route path='/forgot-password' element={<ForgotPassword/>}/>
              <Route
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <UserDashboard/>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          </AuthProviderWrapper>
        </Router>
      </ReactFlowProvider >
  )
}

export default App;