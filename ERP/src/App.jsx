import "./App.css";
import { Routes,Route,Link } from "react-router-dom"
import Login from "./pages/login/Login.jsx"
import Signup from "./pages/signup/Signup.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx"



const App = () => {
  return (
    
      <div className="App">
        <h1>Welcome to ERP System</h1>
        <Dashboard user={{username:"bishal",email:"bishal@example.com"}} />
      </div>
    
  )
}
export default App;

