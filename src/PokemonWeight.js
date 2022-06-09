import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import { db, auth, realDb } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import {getDatabase, ref, set, child, update, remove, onValue, get, query, limitToLast, orderByChild} from "firebase/database";
import pic from './whopokemon.jpg';
import Stylesheet from './PokeStyleSheet';
import {storage} from './firebase-config';
import { ref as sRef, getDownloadURL, listAll } from 'firebase/storage';
import 'animate.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Login from "./Login";
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
  const usersList= [];
  const [leaderboardUsers, setLeaderboardUsers] = useState(new Map());
  const [open, setOpen] = useState(false);
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  const[leaderBoard, setLeaderboard] = useState("");
  const [users, setUsers] = useState([]);
  const [loadCounter, setCounter] = useState(0);
  let navigate = useNavigate();
  //open summary dialog
  const handleOpen = () => {
    //displayLeaderboards();
    users.sort((a, b) => (a.poke_highscore < b.poke_highscore) ? 1 : -1);
    console.log(users);
    getLeaderboardString();
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
    setUsers([]);
  };


  //get random selection from pookemon map
  const getRandomSelection = (collection) => {
    var keys = Object.keys(collection);
    var len = keys.length;
    var rnd = Math.floor(Math.random()*len);
    var key = keys[rnd];
    return key;
  }

  const [user, setUser] = useState({});
  useEffect(()=> {
    
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      readTotal();
      getPreviousHighScore();
      listImages();
      getPokemon();
    });
  });

  //display 2 randomly selected pokemon
  const displayPokemon = () => {
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    console.log(selection1 + ", " + selection2);
    if(selection1 !== selection2 && pokeMap[selection1] !== pokeMap[selection2]){
    setImgSrc1(imageMap[selection1]);
    setName(selection1);
    setImgSrc2(imageMap[selection2]);
    setName2(selection2);
    }
    //call again if both selections are the same
    else{
      displayPokemon();
    }
    //console.log(selection1 + " weighs: " + pokeMap[selection1] + " vs " + selection2 + " weighs: " + pokeMap[selection2]);
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

  const getLeaderboardString = async () => {
    const iterator1 = leaderboardUsers.keys();
    const iterator2 = leaderboardUsers.values();
    var result = "";
    for(var i =0; i < leaderboardUsers.size; i++){
    result += iterator1.next().value + ": " + iterator2.next().value +"\n";
    }
    setLeaderboard(result);
   
  }

  const displayLeaderboards = async () => {
    //users.reverse();
    users.forEach(element => {    
      usersList.push({username : element.username});
      usersList.push({highscore : element.poke_highscore});
    })
  }

  const populateUsers = async () => {
      const recentUsers = query(ref(realDb, 'users/'), orderByChild("poke_highscore", "desc"));
      get(recentUsers)
      .then((snapshot)=> {

        snapshot.forEach(childSnapshot => {
          users.push(childSnapshot.val());
        })
      })
      setUsers(users);
      
    
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
    //user must be logged in to play
    if(user === null){
      navigate('/Login');
    }
    else{
    //setUsers([]);
    populateUsers();
    setStreak(0);
    setShowLeaderboards(false);
    setLastStreak(0);
    setPlaying(true);
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    if(selection1 !== selection2 && pokeMap[selection1] !== pokeMap[selection2]){
      setImgSrc1(imageMap[selection1]);
      setName(selection1);
      setImgSrc2(imageMap[selection2]);
      setName2(selection2);
      }
      else{
        startGame();
      }

      //console.log(selection1 + " weighs: " + pokeMap[selection1] + " vs " + selection2 + " weighs: " + pokeMap[selection2]);
    }
  }


  const showResults = async () => {
    //populateUsers();
    handleOpen();
  }

  
  return (
    <>
    <Stylesheet primary ={true}/>

    <div className="startGame">
      <h1>Which Pokemon Weighs More?</h1>
      <h2>Current Streak: {streak}</h2>
      <h2>Best Streak: {oldStreak}</h2>
      <br></br>
      <button className="startGameButton" onClick={startGame}>Start Game</button>
      <div className="pokeCard1" id="poke1" onClick={checkWinner}>
      <div className="card-poke1">
      <img src={imgSrc1}></img>
        <h1>{pokeName1}</h1>
      </div>
    </div>

    <div className="pokeCard2" id="poke2" onClick={checkWinner}>
      <div className="card-poke2">
      <img src={imgSrc2} alt="cover"/>
      <h1>{pokeName2}</h1>
      </div>
    </div>
    </div>
 
    

    {/*<div className="equalButton">
      <button onClick={checkWinner} id="equal">Same Weight</button>
    </div>

    <div className="leaderboard">
      <h1>Leaderboards</h1>
  </div>*/}

    <Dialog open={open} onClose={handleClose}>
    {(!showLeaderboards) ? (
            <>
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
          <Button onClick={()=>setShowLeaderboards(true)} color="primary">
           Leaderboards
          </Button>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
        </DialogActions> 
            </>
          ):(
            <>
        <DialogTitle>
          Leaderboards:<br></br>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {users.map((user)=>{
              return (
                <h1>{`${user.username}: ${user.poke_highscore}`}</h1>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowLeaderboards(false)} color="primary">
           Go back
          </Button>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
        </DialogActions>
        </>
      )}
      </Dialog>
    </>
  )
}
