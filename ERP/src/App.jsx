// import "./App.css";
// import { Routes,Route,Link , useNavigate} from "react-router-dom"
// import {useEffect} from "react";
// import Login from "./pages/login/Login.jsx"
// import Signup from "./pages/signup/Signup.jsx"
// import Dashboard from "./pages/Dashboard/Dashboard.jsx"




// const App = () => {
//   const navigate=useNavigate();
//   useEffect(()=>{
//     // Check if user is authenticated
//     const token = localStorage.getItem('token');
//     if (token) {
//       // If authenticated, navigate to dashboard
//       navigate('/dashboard');
//     } else {
//       // If not authenticated, navigate to login
//       navigate('/');
//     }
//   }, [navigate]);


//   return (
    
//       // <div className="App">
//       //   <h1>Welcome to ERP System</h1>
//       //   <Dashboard user={{username:"bishal",email:"bishal@example.com"}} />
//       // </div>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
    
//   )
// }
// export default App;



import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Track authentication state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Set as authenticated
      navigate('/dashboard'); // Navigate to dashboard
    }
  }, [navigate]);


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;


