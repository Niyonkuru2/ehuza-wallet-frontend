import { ToastContainer } from 'react-toastify';
import { Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
const App = () => {
  return (
    <div>
       <ToastContainer />
       <div>
        <Routes>
          <Route path="/register" element={<Register/>} />
           <Route path="/login" element={<Login/>} />
        </Routes>
        </div>
    </div>
  )
}

export default App