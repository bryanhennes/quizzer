import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import { db, auth, realDb } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import {getDatabase, ref, set, child, update, remove, onValue, get} from "firebase/database";
import pic from './whopokemon.jpg';
import Stylesheet from './HomeStyleSheet';

export default function PokemonWeight() {

  const [pokeName1, setName] = useState("");
  const [pokeWeight1, setWeight] = useState("");
  const [pokeName2, setName2] = useState("");
  const [pokeWeight2, setWeight2] = useState("");
  const [gameState, setGameState] = useState(pic);
  const [total, setTotal] = useState(0); //get total number of pokemon in database

  //get random number between 1 and total size of pokemon count in database to display randomly
  const getRand = () => {
    readTotal();
    console.log(total);
    const min = Math.ceil(1);
    const max = Math.floor(total+1);
    return Math.floor(Math.random() * (max-min) + min);
  }

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
  });
  const [user, setUser] = useState({});

  const displayPokemon = async () => {
    readData(getRand());
    readData2(getRand());
  }

  
//change card background when game starts
  const checkWinner = async () => {
    setGameState("");
    displayPokemon();
  }


  const readTotal = async () => {
    const pokeRef = ref(realDb, 'pokemon/');
    onValue(pokeRef, (snapshot) => {
      if(snapshot.exists()){
        setTotal(snapshot.size);
      }     
  })
}

  const startGame = async () => {
    displayPokemon();
  }

  

  //read pokemon data from firebase
  const readData = async (num) => {
    const pokeRef = ref(realDb, 'pokemon/'+num);
    onValue(pokeRef, (snapshot) => {
      if(snapshot.exists()){
      const data = snapshot.val();
        setName(data?.name);
        setWeight(data?.weight);
      }     
  })
}

const readData2 = async (num) => {
  const pokeRef = ref(realDb, 'pokemon/'+num);
  onValue(pokeRef, (snapshot) => {
    if(snapshot.exists()){
    const data = snapshot.val();
      setName2(data?.name);
      setWeight2(data?.weight);
    }     
})
}
  return (
    <>
    <Stylesheet primary ={true}/>
    <div className="pokeCard1" onClick={checkWinner}>
      <div class="card">
      <img src={gameState}/>
        <h1>{pokeName1}</h1>
        <h2>{pokeWeight1}</h2>
      </div>
    </div>

    <div className="pokeCard2">
      <div class="card">
      <img src={pic} alt="cover"/>
      <h1>{pokeName2}</h1>
      <h2>{pokeWeight2}</h2>
      </div>
    </div>

    <div className="startGame">
      <button className="startGameButton" onClick={startGame}>Start Game</button>
    </div>
    </>
  )
}
