import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Lgoogle from "../assets/google.png";
import Lapple from "../assets/apple.png";
import Lmicrosoft from "../assets/microsoft.png";
import Lopenai from "../assets/logo_openia.png";
import "../styles/signin.css";
import { auth } from "./firebase-config";
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  browserLocalPersistence,
  inMemoryPersistence,
  signInWithRedirect,
} from "firebase/auth";

function SignIn() {
  const [user, setUser] = useState("");
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      console.log(currentUser);
    }
  });
  if (auth.currentUser) {
    console.log("connected");
  } else {
    console.log("no");
  }

  async function signinwithGoogle() {
    setPersistence(auth, inMemoryPersistence)
      .then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithRedirect(auth, provider).then((result) => {
          const user = result.user;
        });
      })
      .catch((error) => {
        console.error("Google Sign-In Error", error);
      });
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signin(e) {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Email/Password Sign-In Successful", user);
          })
          .catch((error) => {
            console.log(error.code);
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div>
      <div className="loader">
        <p>chargement</p>
        <div className="dot" id="dot1"></div>
        <div className="dot" id="dot2"></div>
        <div className="dot" id="dot3"></div>
      </div>
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
          <button onClick={signin} id="continue">
            Continue
          </button>
          <div>
            Don't have an account?{" "}
            <a id="signup">
              <Link to="/signup">Sign up</Link>
            </a>
          </div>
        </div>
        <div className="divider">
          <span className="line"></span>
          <span className="separator">or</span>
          <span className="line"></span>
        </div>
        <div className="login-buttons">
          <button
            className="google-btn"
            id="other-method"
            onClick={signinwithGoogle}
          >
            <img src={Lgoogle} alt="Google" />
            Se connecter avec Google
          </button>
          <button className="microsoft-btn" id="other-method">
            <img src={Lmicrosoft} alt="Microsoft" />
            Se connecter avec Microsoft
          </button>
          <button className="apple-btn" id="other-method">
            <img src={Lapple} alt="Apple" />
            Se connecter avec Apple
          </button>
        </div>
        {/* ... (privacy policy and copyright) ... */}
      </div>
      <div>
        <h2>Welcome to your Dashboard, {user?.displayName}!</h2>
        <p>Email: {user?.email}</p>
        <img src={user?.photoURL} alt="Profile" />
      </div>
    </div>
  );
}

export default SignIn;
