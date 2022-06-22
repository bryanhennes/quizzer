import React, { useState, useEffect } from "react";
import Stylesheet from './HomeStyleSheet';
import { db, auth, realDb } from "./firebase-config";
import {getDatabase, ref, set, child, update, remove, onValue, get} from "firebase/database";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import pic from './pokemoncover2.jpg';
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

    //user must be logged in to play
    const goToPokeName = () => {
      if(user != null)
        navigate('/PokemonName');
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
      <ul class="cards">
  <li className="one">
    <a href="" class="card">
      <img src={pic} class="card__image" alt="" />
      <div class="card__overlay">
        <div class="card__header">
          <div class="card__header-text">
            <h3 class="card__title">Can You Guess Which Pokémon Weighs More?</h3>
            <br></br>
            <button className="playButton" onClick={goToGame}>Play</button>            
          </div>
        </div>
        <p class="card__description">
        
        </p>
      </div>
    </a>      
  </li>
  <li className="two">
    <a href="" class="card">
      <img src={pic} class="card__image" alt="" />
      <div class="card__overlay">        
        <div class="card__header">
          <div class="card__header-text">
            <h3 class="card__title">Name That Pokemon!</h3>
            <br></br>
            <button className="playButton" onClick={goToPokeName}>Play</button>
          </div>
        </div>
        <p class="card__description"></p>
      </div>
    </a>
  </li>
  <li className="three">
    <a href="" class="card">
      <img src="https://i.imgur.com/oYiTqum.jpg" class="card__image" alt="" />
      <div class="card__overlay">
        <div class="card__header">
          <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                     
          <img class="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
          <div class="card__header-text">
            <h3 class="card__title">Jessica Parker</h3>
            <span class="card__tagline">Lorem ipsum dolor sit amet consectetur</span>            
            <span class="card__status">1 hour ago</span>
          </div>
        </div>
        <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
      </div>
    </a>
  </li>
  <li className="four">
    <a href="" class="card">
      <img src="https://i.imgur.com/2DhmtJ4.jpg" class="card__image" alt="" />
      <div class="card__overlay">
        <div class="card__header">
          <svg class="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>                 
          <img class="card__thumb" src="https://i.imgur.com/sjLMNDM.png" alt="" />
          <div class="card__header-text">
            <h3 class="card__title">kim Cattrall</h3>
            <span class="card__status">3 hours ago</span>
          </div>          
        </div>
        <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
      </div>
    </a>
  </li>    
</ul>
  
      {/*<div class="flip-card">
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
  </div>*/}
    <br></br>
    {/*<button className="pokeHelperButton" onClick={pokeHelper}>Add Pokemon</button>
    <input type="text" placeholder="Pokemon name" value={pokeName} onChange={(e) => {
          setName(e.target.value);
        }}/>
    <input type="number" placeholder="Pokemon weight" value={pokeWeight} onChange={(e) => {
          setWeight(e.target.value);
        }}/>*/}
      </div>
    
    </>
  )
}
