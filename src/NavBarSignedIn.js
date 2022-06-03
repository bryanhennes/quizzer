import { useState, useEffect, DropdownButton, Dropdown } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import LoginForm from "./LoginForm";
import Home from "./Home";
import Profile from "./Profile";
import Stylesheet from "./Stylesheet";
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import NavBarNotSignedIn from "./NavBarNotSignedIn";
import PokemonWeight from "./PokemonWeight";

export default function () {
  const logout = async () => {
    await signOut(auth);
  }

  const [user, setUser] = useState({});

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
});

  return (
    <>
    <Stylesheet primary ={true}/>
    <Router>
    <nav>
      <div className="topnav">
      <Link to="/Profile">
      <span className="userNameDisplay">{user?.email}</span>
      <span className="material-symbols-outlined">
        account_circle
      </span>
      </Link>
      <Link className="signedInLogoBtn" to="/Home">Quizzer</Link>
      <Link to="/Home" className="signOutButton" onClick={logout}>Sign Out</Link>
      </div>
     
    </nav>
   
    
    <Routes>
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/PokemonWeight" element={<PokemonWeight />} />
      
    </Routes>
    </Router>

    </>
  )
}
