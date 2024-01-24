import Signup from "./components/signup";
import Login from "./components/login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Home from "./components/home";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login setLoggedIn={setLoggedIn} />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          {isLoggedIn ? (
            <Route path="/home" element={<Home />} />
          ) : (
            <Route path="/home" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
