import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ setLoggedIn }) => {
  let navigate = useNavigate();

  const naviSignup = () => {
    navigate("/signup");
  };
  const [signindata, setSignindata] = useState({ email: "", password: "" });

  const handleLogin = () => {
    if (signindata.email.length) {
      axios({
        url: "http://localhost:3001/signin",
        method: "POST",
        headers: {},
        data: signindata,
      })
        .then((data) => {
          if (data.data.authToken.length > 0) {
            setLoggedIn(true);

            alert(`${signindata.email} signed in sucessfully`);
            navigate("/home");
          }
        })
        .catch((err) => {
          alert(err.response.data);
          if (err.response.data === "email not exist please signup") {
            navigate("/signup");
          }
        });
    } else {
      alert("email cann't be empty");
    }
  };

  return (
    <div className="logincontainer">
      <div className="logbox">
        <p className="paragraph2">
          Enter your credentials to access your account{" "}
        </p>

        <div>
          <input
            className="logininput1"
            placeholder="Email ID"
            type="text"
            onChange={(e) => {
              setSignindata({ ...signindata, email: e.target.value });
            }}
          />
        </div>
        <div className="input-wrapper">
          <input
            className="logininput2"
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setSignindata({ ...signindata, password: e.target.value });
            }}
          />
        </div>
        <button className="signin" onClick={handleLogin}>
          Sign In
        </button>
        <p className="signup" onClick={naviSignup}>
          Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;
