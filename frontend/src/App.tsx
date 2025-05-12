import { ToastContainer } from 'react-toastify';
import { Navigate, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import ProfileInfo from './pages/Profile';
import TransactionsPage from './pages/Transaction';
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
           <Route path="/profile" element={<ProtectedRoute><ProfileInfo/></ProtectedRoute>} />
           <Route path="/transactions" element={<ProtectedRoute><TransactionsPage/></ProtectedRoute>} />
        </Routes>
        </div>
    </div>
  )
}

export default App