import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Home from "./Home";
import Profile from './Profile';
import Login from './Login';
import LoginForm from './LoginForm';
import PokemonWeight from './PokemonWeight';
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";



export default function Navigation() {

  const [user, setUser] = useState({});

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
});

const logout = async () => {
  await signOut(auth);
}

  return (
    <Router>
   
      <nav className="navigation">
      <a href="/Home" className="brand-name">
        Quizzer
      </a>
      <button className="hamburger">
        {/* icon from heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className="navigation-menu">
        <ul>
          <li>
            <a href="/Home">Home</a>
          </li> 
          {(user != null) ? (
            <>
            <li>
            <a href="/Profile">Profile</a>
            </li>
            <p>{user?.email}</p>
            <li>
            <a onClick={logout}>Sign Out</a>
            </li>
            </>
          ):(
            <>
            <a href="/Login">Login</a>
            <li>
            <a href="/Register">Sign Up</a>
            </li>
            </>
          )}
          
        </ul>
      </div>
    </nav>


<Routes>
<Route path="/Profile" element={<Profile />} />
<Route path="/Home" element={<Home />} />
<Route path="/LoginForm" element={<LoginForm />} />
<Route path="/Login" element={<Login />} />
<Route path="/PokemonWeight" element={<PokemonWeight />} />

</Routes>
</Router>
  )
}
