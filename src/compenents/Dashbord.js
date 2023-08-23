import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate
import { auth } from "./firebase-config";
import "../styles/dashbord.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import deafultPhoto from "../assets/profile_null.jpg";

function Dashboard() {
  const [profileImage, setProfileImg] = useState(deafultPhoto);
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    console.log(currentUser);
    if (currentUser.photoURL !== null) {
      setProfileImg(currentUser.photoURL);
    }
  });

  function logout() {
    signOut(auth);
  }

  const [user, setUser] = useState("");

  return (
    <div>
      <h1>profil setting</h1>
      <div id="card">
        <div className="pfp-erea">
          <img src={profileImage} />
        </div>
        <div className="information">
          {user ? (
            <>
              <p>Name: {user.displayName}</p>
              <p>E-mail: {user.email}</p>
              <p>Creation Time: {user.metadata.creationTime}</p>{" "}
              {/* Accessing creation time */}
              <button onClick={logout}>Sign Out</button>
            </>
          ) : (
            <p>Please sign in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
