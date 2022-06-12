import React, { useState, useEffect } from "react";
import Stylesheet from './HomeStyleSheet';
import { db, auth, realDb } from "./firebase-config";
import {getDatabase, ref, set, child, update, remove, onValue, get} from "firebase/database";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import pic from './pokemon.jpg';
import PokemonWeight from "./PokemonWeight";


export default function Home() {
    useEffect(()=> {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          readTotal();
          console.log(total + " pokemon in database");
        });
    });
    const [pokeName, setName] = useState("");
    const [pokeWeight, setWeight] = useState("");
    const [total, setTotal] = useState(0);

    //user must be logged in to play
    const goToGame = () => {
      if(user != null)
        navigate('/PokemonWeight');
      else
        navigate('/Login');
    }

    const readTotal = async () => {
      const pokeRef = ref(realDb, 'pokemon/');
      onValue(pokeRef, (snapshot) => {
        if(snapshot.exists()){
          setTotal(snapshot.size);
        }     
    })
  }

  //temporary helper function to add pokemon to database
  const pokeHelper = async () => {
    const newtotal = total +1;
    await set(ref(realDb, 'pokemon/' + newtotal),{
      name: pokeName,
      weight: Number(pokeWeight),
    })
    setName("");
    setWeight("");
  };
    
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
          <h2>Which Pokemon Weighs More?</h2>
          <button className="playButton" onClick={goToGame}>Play</button>
      
        </div>
      </div>
    </div>
    <br></br>
    <button className="pokeHelperButton" onClick={pokeHelper}>Add Pokemon</button>
    <input type="text" placeholder="Pokemon name" value={pokeName} onChange={(e) => {
          setName(e.target.value);
        }}/>
    <input type="number" placeholder="Pokemon weight" value={pokeWeight} onChange={(e) => {
          setWeight(e.target.value);
        }}/>
      </div>
    
    </>
  )
}
