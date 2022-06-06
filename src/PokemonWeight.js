import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import { db, auth, realDb } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import {getDatabase, ref, set, child, update, remove, onValue, get} from "firebase/database";
import pic from './whopokemon.jpg';
import Stylesheet from './HomeStyleSheet';
import {storage} from './firebase-config';
import { ref as sRef, getDownloadURL, listAll } from 'firebase/storage';
import 'animate.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

export default function PokemonWeight() {

  const [pokeName1, setName] = useState("");
  const [pokeWeight1, setWeight] = useState("");
  const [pokeName2, setName2] = useState("");
  const [pokeWeight2, setWeight2] = useState("");
  const [imgSrc1, setImgSrc1] = useState(pic);
  const [imgSrc2, setImgSrc2] = useState(pic);
  const [total, setTotal] = useState(0); //get total number of pokemon in database
  const [streak, setStreak] = useState(0); //keep track of user's streak
  const [lastStreak, setLastStreak] = useState(0); //keep track of user's streak
  const [oldStreak, setOldStreak] = useState(0); //get previous streak from user database
  const [isPlaying, setPlaying] = useState(false); //is currently playing game
  const imageMap = {};
  const pokeMap = {};
  const[isCorrect, setCorrect] = useState("");

  //get random number between 1 and total size of pokemon count in database to display randomly
  const getRand = () => {
    const min = Math.ceil(1);
    const max = Math.floor(total+1);
    return Math.floor(Math.random() * (max-min) + min);
  }

  const [open, setOpen] = useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  //when summary box is closed, clear game
  const handleClose = () => {
    setOpen(false);
    setPlaying(false);
    setName("");
    setWeight("");
    setName2("");
    setWeight2("");
    setStreak(0);
    setImgSrc1(pic);
    setImgSrc2(pic);
  };


  //get random selection from pookemon map
  const getRandomSelection = (collection) => {
    var keys = Object.keys(collection);
    var len = keys.length;
    var rnd = Math.floor(Math.random()*len);
    var key = keys[rnd];
    return key;
  }


  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      readTotal();
      getPreviousHighScore();
      listImages();
      getPokemon();
      
    });
  });
  const [user, setUser] = useState({});

  //display 2 randomly selected pokemon
  const displayPokemon = () => {
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    console.log(selection1 + ", " + selection2);
    if(selection1 != selection2){
    setImgSrc1(imageMap[selection1]);
    setName(selection1);
    setImgSrc2(imageMap[selection2]);
    setName2(selection2);
    }
    else{
      console.log("display pokemon called 2 poke of the same pokemon: " + selection1 + " and " + selection2);
      displayPokemon();
    }
  }

  //when pokemon page first loads, grab all download urls from pokemon images in firebase storage
  //add them to an image map to be accessed during the game
  const listImages = async () => {
    const listRef= sRef(storage, 'pokemon_images/');
    listAll(listRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach((itemRef) => {
        // All the items under listRef.
         getDownloadURL(itemRef).then((e) => {
          let name = itemRef.name.substring(0, itemRef.name.length-4);
          imageMap[name] = e; 
        })
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  }

  //this does successfully loop through all pokemon in database
  const getPokemon = async () => {
    for(var i =1; i<= total;i++){
      const pokeRef = ref(realDb, 'pokemon/'+i);
      onValue(pokeRef, (snapshot) => {
        if(snapshot.exists()){
        const data = snapshot.val();
          pokeMap[data?.name] = data?.weight; 
        }     
    })
    }
    
  }

  function displayResult() {
        return (
            <div className="displayResult">
                {isCorrect}
            </div>
        )
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

const animateCard = (e) => {
  const element1 = document.querySelector('pokeCard1');
  const element2 = document.querySelector('pokeCard2');
  if(e.currentTarget.id === "poke1"){
    element1.classList.add('animate__animated', 'animate__bounce');

    element1.addEventListener('animationend', () => {
      element1.classList.remove('animate__animated', 'animate__bounce');
    });
  }
  else if(e.currentTarget.id === "poke2"){
    element2.classList.add('animate__animated', 'animate__bounce');

    element2.addEventListener('animationend', () => {
      element2.classList.remove('animate__animated', 'animate__bounce');
    });
  }
}

  
//check if selected answer is correct
  const checkWinner = e => {
    if(isPlaying){
      setWeight(pokeMap[pokeName1]);
      setWeight2(pokeMap[pokeName2]);
    if(e.currentTarget.id === "poke1" && pokeMap[pokeName1] > pokeMap[pokeName2]){
      setStreak(streak+1);
      setLastStreak(lastStreak+1);
      displayPokemon();
    }
    else if(e.currentTarget.id === "poke2" && pokeMap[pokeName2] > pokeMap[pokeName1]){
      setStreak(streak+1);
      setLastStreak(lastStreak+1);
      displayPokemon();
    }

    //if pokemon have equal weight and equal button is selected it should be correct
    else if(e.currentTarget.id === "equal" && pokeMap[pokeName2] === pokeMap[pokeName1]){
      setStreak(streak+1);
      setLastStreak(lastStreak+1);
      displayPokemon();
    }
    else {
      if(streak > oldStreak)
        setHighscore();
      showResults();
    }
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
    setLastStreak(0);
    setPlaying(true);
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    if(selection1 != selection2){
      setImgSrc1(imageMap[selection1]);
      setName(selection1);
      setImgSrc2(imageMap[selection2]);
      setName2(selection2);
      }
      else{
        startGame();
      }
  
  }

  //game ends, set all states to default
  const endGame = async () => {
    showResults();
    setName("");
    setWeight("");
    setName2("");
    setWeight2("");
    setStreak(0);
    setImgSrc1(pic);
    setImgSrc2(pic);
  }

  const showResults = async () => {
    handleOpen();
  }

  
  return (
    <>
    <Stylesheet primary ={true}/>
    <div className="pokeCard1" id="poke1" onClick={checkWinner}>
      <div class="card">
      <img src={imgSrc1}></img>
        <h1>{pokeName1}</h1>
      </div>
    </div>

    <div className="pokeCard2" id="poke2" onClick={checkWinner}>
      <div class="card">
      <img src={imgSrc2} alt="cover"/>
      <h1>{pokeName2}</h1>
      </div>
    </div>

    <div className="startGame">
      <h1>Which Pokemon weighs more?</h1>
      <h2>Current Streak: {streak}</h2>
      <h2>Best Streak: {oldStreak}</h2>
      <button className="startGameButton" onClick={startGame}>Start Game</button>
    </div>

    {/*<div className="equalButton">
      <button onClick={checkWinner} id="equal">Equal</button>
    </div>

    <div className="leaderboard">
      <h1>Leaderboards</h1>
  </div>*/}

    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            You Lost!<br></br>
           {pokeName1} weighs {pokeWeight1}lbs<br></br>
           {pokeName2} weighs {pokeWeight2}lbs
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h1>Summary</h1>
            <p>Score: {lastStreak}</p>
            <p>Best: {oldStreak} </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}
