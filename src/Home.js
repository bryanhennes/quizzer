import { useState, useEffect } from "react";
import Stylesheet from './HomeStyleSheet';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import pic from './pokemon.jpg';

export default function Home() {
    useEffect(()=> {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
      });
    
      const [user, setUser] = useState({});
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
          <button className="playButton">Play</button>
          <p>Highscore:</p>
      
        </div>
      </div>
    </div>
  </div>
    
    </>
  )
}
