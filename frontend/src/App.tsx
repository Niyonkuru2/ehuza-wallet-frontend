import { ToastContainer } from 'react-toastify';
import { Navigate, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import ProfileInfo from './pages/Profile';
const App = () => {
  return (
    <div>
       <ToastContainer />
       <div>
        <Routes>
          {/* Redirect root path to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register/>} />
           <Route path="/login" element={<Login/>} />
           <Route path="/reset-password/:token" element={<ResetPassword/>} />
           <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
           <Route path="/update" element={<ProtectedRoute><ProfileInfo/></ProtectedRoute>} />
        </Routes>
        </div>
    </div>
  )
}

export default App