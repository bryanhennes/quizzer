import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate } from "react-router-dom";
import { db, auth, realDb } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import {getDatabase, ref, set, child, update, remove, onValue, get, query, limitToLast, orderByChild} from "firebase/database";
import pic from './pokeball.png';
import moment from "react-moment";
import Stylesheet from './PokeStyleSheet';
import {storage} from './firebase-config';
import { ref as sRef, getDownloadURL, listAll } from 'firebase/storage';
import 'animate.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Login from "./Login";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';

export default function PokemonName() {

const [oldStreak, setOldStreak] = useState(0);
const [streak, setStreak] = useState(0); //keep track of user's streak
const [pokeName, setName] = useState("");
const [btn1Text, setBtn1Text] = useState("?");
const [btn2Text, setBtn2Text] = useState("?");
const [btn3Text, setBtn3Text] = useState("?");
const [btn4Text, setBtn4Text] = useState("?");
const [lastStreak, setLastStreak] = useState(0); //keep track of user's streak
const [imgSrc, setImgSrc] = useState(() => {
    return pic;
  });
const [user, setUser] = useState({});
const [total, setTotal] = useState(() => {
    console.log("reading total");
return 0;
});
const [isPlaying, setPlaying] = useState(false); //is currently playing game
const [buttonText, setButtonText] = useState('Start Game');
const imageMap = {};
const [scoreTotal, setScoreTotal] = useState(0);
const [finalImageMap, setMap] = useState({});
const [isDisabled, setDisabled] = useState(true);
const [answer, setAnswer] = useState("");
const [open, setOpen] = useState(false);
const [skipped, setSkipped] = useState(false);
const [showLeaderboards, setShowLeaderboards] = useState(false);
const [users, setUsers] = useState(() => {
    return [];
  });
let navigate = useNavigate();

const [seconds, setSeconds] = useState(0);
const [minutes, setMinutes] = useState(5);
const [isActive, setIsActive] = useState(false);


  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setMinutes(5);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds===0){
            if(minutes === 0){
                reset();
                startGame();
                clearInterval(interval);
            }
            else {
                setSeconds(59);
                setMinutes(minutes => minutes - 1);
            }
        }
        else
        setSeconds(seconds => seconds - 1);
      }, 1000);
    }
    
 
    

    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);


useEffect(()=> {
    listImages();
    //getPreviousHighScore();
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
}, []);

useEffect(()=> {
    readTotal();
    getPreviousHighScore();
    //getPokemon();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
});

const getRandomSelection = (collection) => {
    var keys = Object.keys(collection);
    var len = keys.length;
    var rnd = Math.floor(Math.random()*len);
    var key = keys[rnd];
    return key;
  }

  //display randomly selected pokemon
  const displayPokemon = () => {
    const selection = getRandomSelection(finalImageMap);
    console.log(selection);
    setImgSrc(finalImageMap[selection]);
    setName(selection);
    setTimeout(() => {
      getChoices(selection);
    }, 150);
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
    setMap(imageMap);
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

const getChoices = async (currentSelection) => {
  let choices = [currentSelection, getRandomSelection(finalImageMap), getRandomSelection(finalImageMap), getRandomSelection(finalImageMap)];
  choices = choices.sort(() => Math.random() - 0.5);
  setBtn1Text(choices[0]);
  setBtn2Text(choices[1]);
  setBtn3Text(choices[2]);
  setBtn4Text(choices[3]);

}

const clearChoices = async () => {
  setBtn1Text("?");
  setBtn2Text("?");
  setBtn3Text("?");
  setBtn4Text("?");
}

//check if selected answer is correct
const checkWinner = e => {
  console.log(e.target.innerHTML);
    if(isPlaying){

    if(e.target.innerHTML === pokeName){
      customToast.success('Correct!');
      setStreak(streak+1);
      //checkStreak();
      setLastStreak(lastStreak+1);  
      displayPokemon();
     
    }
    else {
      //toast.error('Wrong');
      customToast.error('Wrong!');
      displayPokemon();
    }
  }
  }

const startGame = async () => {
    //user must be logged in to play
    if(user === null){
      navigate('/Login');
    }

    else if(isPlaying){
      reset();
      showResults();
    }

    else{
    setIsActive(true);
    setButtonText('End Game');
    //populateUsers();
    setStreak(0);
    setShowLeaderboards(false);
    setLastStreak(0);
    setPlaying(true);
    const selection = getRandomSelection(finalImageMap);
    console.log(selection);
    setImgSrc(finalImageMap[selection]);
    setName(selection);
    getChoices(selection);
    }
  }

  const showResults = async () => {
    handleOpen();
  }

  //show top ten users in terms of poke highscore
  const populateUsers = async () => {
    const recentUsers = query(ref(realDb, 'users/'), orderByChild("poke_name_highscore", "desc"), limitToLast(10));
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
        setOldStreak(data?.poke_name_highscore);
      }
      else {
        console.log('does not exist');
        //should set users poke highscore to 0 if it doesnt already exist in database
      }   
  })
  if(oldStreak !== null){
    console.log(oldStreak);
  }
}

//if new highscore update users highscore in database
const setHighscore = async () => {
    update(ref(realDb, 'users/' + user.uid), {
      poke_name_highscore: streak,
  })
  }

//open summary dialog
const handleOpen = () => {
    clearChoices();
    if(streak > oldStreak)
      setHighscore();
    //displayLeaderboards();
    users.sort((a, b) => (a.poke_highscore < b.poke_highscore) ? 1 : -1);
    //alertNewBest();
    setOpen(true);
  };

//when summary box is closed, clear game
const handleClose = () => {
    setOpen(false);
    setPlaying(false);
    setName("");
    setStreak(0);
    setImgSrc(pic);
    setUsers([]);
    setButtonText('Start Game');
  };

  const customToast = {
    success(msg, options = {}) {
      return toast.success(msg, {
        ...options,
        className: 'toast-success-container toast-success-container-after',
        progressClassName: css({
          background: '#34A853',
        }),
      });
    },
    error(msg, options = {}) {
      return toast.error(msg, {
        ...options,
        className: 'toast-error-container toast-error-container-after',
        progressClassName: css({
          background: '#ee0010',
        }),
      });
    },
    info(msg, options = {}) {
      return toast.info(msg, {
        ...options,
        className: 'toast-info-container toast-info-container-after',
        progressClassName: css({
          background: '#07F',
        }),
      });
    },
  };



  return (
    <>
    <Stylesheet primary ={true}/>
    <div className="startGame-pokename">
      <h1>Name That Pokemon!</h1>
      <h2>Correct: {streak}</h2>
      <h2>Best: {oldStreak}</h2>
      <h2>Time Remaining: { minutes }:{ seconds < 10 ? `0${ seconds }` : seconds }</h2>
      {/*<h2>Best Streak: {oldStreak}</h2>*/}
      <br></br>
      {(isDisabled) ? (
            <h2>Loading Pokemon...</h2>
          ):(
            <button className="startGameButton" onClick={startGame}>{buttonText}</button>
        )}
      
      {/*<div id="circular" class="circular">
        <div class="inner">

        </div>
          <div class="number">
            Timer
          </div>
            <div class="circle">
              <div class={`${isActive ? 'bar left': 'bar-left-inactive'}`}>
                  <div class="progress">

                  </div>
              </div>
                    <div class={`${isActive ? 'bar right': 'bar-right-inactive'}`} onAnimationEnd={startGame}>
                      <div class="progress">

                      </div>
                    </div>
              </div>
          </div>*/}
      <div className="pokeCards-name">
      <div className="pokeCard-pokename" id="poke1">
      <div className="card-poke-name">
      <img src={imgSrc} alt={pokeName}></img>
        {/*<form onSubmit={handleSubmit}><br></br><br></br>*/}
        <div className="poke-choices">
        <br></br>
        <button id="choice1" type ='submit' onClick={checkWinner} className="btn-answer">{btn1Text}</button>
        <button id="choice2" type ='submit' onClick={checkWinner} className="btn-answer">{btn2Text}</button>
        <button id="choice3" type ='submit' onClick={checkWinner} className="btn-answer">{btn3Text}</button>
        <button id="choice4" type ='submit' onClick={checkWinner} className="btn-answer">{btn4Text}</button>
        {/*</div></form>*/}
        </div>
      </div>
    </div>
    </div>
    <ToastContainer
          position="bottom-center"
          className="toast-container"
          closeButton={false}
          autoClose={300}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </div>
 

    <Dialog className="leaderboard-dialog"open={open} onClose={handleClose}>
    {(!showLeaderboards) ? (
            <>
          <DialogTitle>
            Game Over!<br></br>
    
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
                <h1 id="leaderboard-display">{`${user.username}: ${user.poke_highscore}`}</h1>
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
