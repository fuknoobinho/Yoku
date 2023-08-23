import "../styles/signin.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Lopenai from "../assets/logo_openia.png";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup(e) {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Email/Password Sign-Up Successful", user);
    } catch (error) {
      console.error("Email/Password Sign-Up Error", error);
    }
  }

  return (
    <div className="content">
      <div className="logo_oa">
        <img src={Lopenai} alt="openai" id="logo_oa" />
      </div>
      <div className="form">
        <h2>Welcome back</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          id="email"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChangeCapture={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          id="password"
        />
        <br />
        <button onClick={signup} id="continue">
          Continue
        </button>
        <div>
          Don't have an account?{" "}
          <a id="signup">
            <Link to="/signin">Sign in</Link>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
