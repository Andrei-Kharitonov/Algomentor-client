import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Courses from './pages/Courses.tsx';
import Themes from './pages/Themes.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/themes" element={<Themes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
