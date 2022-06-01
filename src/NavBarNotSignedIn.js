import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./Home";
import Stylesheet from "./Stylesheet";
import LoginForm from "./LoginForm";
import PokemonWeight from "./PokemonWeight";

export default function () {
  return (
    <>
    <Stylesheet primary ={true}/>
    <Router>
    <nav>
      <div className="topnav">
      <Link to="/Login">Login</Link>
      <Link to="/Register">Sign Up</Link>
      </div>
      <div className="logoButton">
      <Link className="logoBtn" to="/Home">Quizzer</Link>
      </div>
    </nav>

    
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/LoginForm" element={<LoginForm />} />
      <Route path="/PokemonWeight" element={<PokemonWeight />} />
    </Routes>
    </Router>
    </>
  )
}