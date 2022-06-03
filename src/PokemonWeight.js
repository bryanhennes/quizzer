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
  const [imgSrc, setImgSrc] = useState(pic);
  const [total, setTotal] = useState(0); //get total number of pokemon in database
  const [streak, setStreak] = useState(0); //keep track of user's streak
  const [oldStreak, setOldStreak] = useState(0); //get previous streak from user database

  //get random number between 1 and total size of pokemon count in database to display randomly
  const getRand = () => {
    const min = Math.ceil(1);
    const max = Math.floor(total+1);
    return Math.floor(Math.random() * (max-min) + min);
  }

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      readTotal();
      getPreviousHighScore();
    });
  });
  const [user, setUser] = useState({});

  //display 2 randomly selected pokemon
  const displayPokemon = async () => {
    readData(getRand());
    readData2(getRand());
  }

  //retrieve previous high score from database
  const getPreviousHighScore = async () => {
    const userRef = ref(realDb, 'users/'+user.uid);
    onValue(userRef, (snapshot) => {
      if(snapshot.exists()){
      const data = snapshot.val();
        setOldStreak(data?.poke_highscore);
      }
      else {
        //should set users poke highscore to 0 if it doesnt already exist in database
      }   
  })
}

  
//check if selected answer is correct
  const checkWinner = e => {
    //setImgSrc("");
    console.log(e.currentTarget.id);
    if(e.currentTarget.id === "poke1" && pokeWeight1 > pokeWeight2){
      console.log("Correct");
      setStreak(streak+1);
      displayPokemon();
    }
    else if(e.currentTarget.id === "poke2" && pokeWeight2 > pokeWeight1){
      console.log("Correct");
      setStreak(streak+1);
      displayPokemon();
    }

    //if pokemon have equal weight and equal button is selected it should be correct
    else if(e.currentTarget.id === "equal" && pokeWeight2 === pokeWeight1){
      console.log("Correct");
      setStreak(streak+1);
      displayPokemon();
    }
    else {
      console.log("False");
      if(streak > oldStreak)
        setHighscore();
      endGame();
    }
    
  }

  //if new highscore update users highscore in database
  const setHighscore = async () => {
    update(ref(realDb, 'users/' + user.uid), {
      poke_highscore: streak,
  })
  }

  //get total number of pokemon in database currently
  const readTotal = async () => {
    const pokeRef = ref(realDb, 'pokemon/');
    onValue(pokeRef, (snapshot) => {
      if(snapshot.exists()){
        setTotal(snapshot.size);
      }     
  })
}

  //begin game
  const startGame = async () => {
    setStreak(0);
    displayPokemon();
  }

  //game ends, set all states to default
  const endGame = async () => {
    setName("");
    setWeight("");
    setName2("");
    setWeight2("");
    setStreak(0);
  }

  

  //read pokemon data from firebase for poke card 1
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


//read pokemon data from firebase for poke card 2
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
    <div className="gameArea">
    <div className="pokeCard1" id="poke1" onClick={checkWinner}>
      <div class="card">
      <img src={imgSrc}/>
        <h1>{pokeName1}</h1>
        <h2>{pokeWeight1}</h2>
      </div>
    </div>

    <div className="pokeCard2" id="poke2" onClick={checkWinner}>
      <div class="card">
      <img src={pic} alt="cover"/>
      <h1>{pokeName2}</h1>
      <h2>{pokeWeight2}</h2>
      </div>
    </div>

    <div className="startGame">
      <h1>Current Streak: {streak}</h1>
      <button className="startGameButton" onClick={startGame}>Start Game</button>
    </div>

    <div className="equalButton">
      <button onClick={checkWinner} id="equal">Equal</button>
    </div>
    </div>
    </>
  )
}
