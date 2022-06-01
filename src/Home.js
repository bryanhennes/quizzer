import React, { useState, useEffect } from "react";
import Stylesheet from './HomeStyleSheet';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import pic from './pokemon.jpg';
import PokemonWeight from "./PokemonWeight";


export default function Home() {
    useEffect(()=> {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
    });

    const goToGame = () => {
      navigate('/PokemonWeight');
    }
    
      const [user, setUser] = useState({});

      let navigate = useNavigate();
  return (
    <>
    <Stylesheet primary ={true}/>
    <div className="mainHome">
  
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
          <img src={pic} alt="cover"/>
          </div>
        <div class="flip-card-back">
          <h1></h1>
          <h2>Which Pokemon has a higher weight?</h2>
          <button className="playButton" onClick={goToGame}>Play</button>
      
        </div>
      </div>
    </div>
  </div>
    
    </>
  )
}
