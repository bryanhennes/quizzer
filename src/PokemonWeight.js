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
import { getAnalytics, logEvent } from "firebase/analytics";

const useStyles = makeStyles({
  dialog: {
    textAlign: "left"
  }
});


export default function PokemonWeight() {


  const [pokeName1, setName] = useState("");
  const [sum, setSum] = useState(0);
  const [pokeWeight1, setWeight] = useState(() => {
    return "";
  });
  const [pokeName2, setName2] = useState("");
  const [pokeWeight2, setWeight2] = useState("");
  const [imgSrc1, setImgSrc1] = useState(() => {
    return pic;
  });
  const [imgSrc2, setImgSrc2] = useState(() => {
    return pic;
  });
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(() => {
    console.log("reading total");
    return 0;
  }); //get total number of pokemon in database
  const [streak, setStreak] = useState(0); //keep track of user's streak
  const [lastStreak, setLastStreak] = useState(0); //keep track of user's streak
  const [oldStreak, setOldStreak] = useState(0); //get previous streak from user database
  const [isPlaying, setPlaying] = useState(false); //is currently playing game
  const [buttonText, setButtonText] = useState('Start Game');
  const imageMap = {};
  const [scoreTotal, setScoreTotal] = useState(0);
  const [finalImageMap, setMap] = useState({});
  const pokeMap = {};
  const [scoreCounter, setScoreCounter] = useState(0);
  const mileStones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const [open, setOpen] = useState(false);
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  const [averageScore, setAverageScore] = useState(0);
  const [isActive, setActive] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [users, setUsers] = useState(() => {
    return [];
  });
  let navigate = useNavigate();

  

  //fetch all image download urls from database before allowing game to begin
  useEffect(()=> {
    listImages();
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  }, []);
  
  useEffect(()=> {
    readTotal();
    getPreviousHighScore();
    getPokemon();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  
  //open summary dialog
  const handleOpen = () => {
    //displayLeaderboards();
    users.sort((a, b) => (a.poke_highscore < b.poke_highscore) ? 1 : -1);
    setActive(false);
    alertNewBest();
    //getAverageScore();
    setOpen(true);
  };

  //display streak milestones
  const checkStreak = () => {
    if(mileStones.includes(streak+1))
      toast(`${streak+1} streak!`);
  }


  const alertNewBest = () => {
    if(streak > oldStreak){
      toast(`New Personal Best: ${streak} Streak!`);
    }
  }

 
  
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
    setButtonText('Start Game');
  };


  //get random selection from pookemon map
  const getRandomSelection = (collection) => {
    var keys = Object.keys(collection);
    var len = keys.length;
    var rnd = Math.floor(Math.random()*len);
    var key = keys[rnd];
    return key;
  }




  //display 2 randomly selected pokemon
  const displayPokemon = () => {
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    if(selection1 !== selection2 && pokeMap[selection1] !== pokeMap[selection2]){
    setImgSrc1(finalImageMap[selection1]);
    setName(selection1);
    setImgSrc2(finalImageMap[selection2]);
    setName2(selection2);
    
    }
    //call again if both selections are the same
    else{
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
    setMap(imageMap);
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


  //show top ten users in terms of poke highscore
  const populateUsers = async () => {
      const recentUsers = query(ref(realDb, 'users/'), orderByChild("poke_highscore", "desc"), limitToLast(10));
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
  setActive(false);
  if(isPlaying){
    setWeight(pokeMap[pokeName1]);
    setWeight2(pokeMap[pokeName2]);
  if(e.currentTarget.id === "poke1" && pokeMap[pokeName1] > pokeMap[pokeName2]){
    setTimeout(() => {
      setActive(true);
    }, 1);
    setStreak(streak+1);
    checkStreak();
    setLastStreak(lastStreak+1);
    displayPokemon();
  }
  else if(e.currentTarget.id === "poke2" && pokeMap[pokeName2] > pokeMap[pokeName1]){
    setTimeout(() => {
      setActive(true);
    }, 1);
    setStreak(streak+1);
    checkStreak();
    setLastStreak(lastStreak+1);
    displayPokemon();
  }

  else {
    setActive(false);
    if(streak > oldStreak)
      setHighscore();
    //setScore();
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

  const setScore = async () => {
    setScoreCounter(scoreCounter+1);
    update(ref(realDb, 'users/' + user.uid + '/poke_attempts/'+scoreCounter), {
      score: streak,
  })
  }

  const getAverageScore = async () => {
    const totalRef = ref(realDb, 'users/' + user.uid + '/poke_attempts/');
    onValue(totalRef, (snapshot) => {
      if(snapshot.exists()){
        setScoreTotal(snapshot.size);
        console.log(scoreTotal);
      }     
  })
    var tempSum = 0;
    for(var i = 1; i <= scoreTotal; i++){
    const userRef = ref(realDb, 'users/'+user.uid +'/poke_attempts/'+i);
    onValue(userRef, (snapshot) => {
      if(snapshot.exists()){
      const data = snapshot.val();
        console.log(`score${i}: ` + data?.score);
        //setSum(sum + data?.score);
        tempSum += data?.score;
        console.log("sum so far: " + tempSum);
      }
      else {
      }   
  })
  }
  console.log(`${tempSum} / ${scoreTotal}`);
  setAverageScore(tempSum/scoreTotal);
  console.log(Math.trunc(averageScore));
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

    else if(isPlaying){
      setWeight(pokeMap[pokeName1]);
      setWeight2(pokeMap[pokeName2]);
      showResults();
    }

    else{
    //setActive(true);
    setButtonText('End Game');
    populateUsers();
    setStreak(0);
    setShowLeaderboards(false);
    setLastStreak(0);
    setPlaying(true);
    const selection1 = getRandomSelection(pokeMap);
    const selection2 = getRandomSelection(pokeMap);
    if(selection1 !== selection2 && pokeMap[selection1] !== pokeMap[selection2]){
      setActive(true);
      //console.log(finalImageMap);
      setImgSrc1(finalImageMap[selection1]);
      setName(selection1);
      setImgSrc2(finalImageMap[selection2]);
      setName2(selection2);
      setWeight(pokeMap[selection1]);
      setWeight2(pokeMap[selection2]);
      }
      else{
        startGame();
        //console.log('recalling');
      }
    }
    //console.log(imageMap);
  }


  const showResults = async () => {
    handleOpen();
  }

  const classes = useStyles()

  
  return (
    <>
    <Stylesheet primary ={true}/>

    <div className="startGame">
      <h1>Which Pokemon Weighs More?</h1>
      <h2>Current Streak: {streak}</h2>
      <h2>Best Streak: {oldStreak}</h2>
      <br></br>
      {(isDisabled) ? (
            <h2>Loading Pokemon...</h2>
          ):(
            <button className="startGameButton" onClick={startGame}>{buttonText}</button>
        )}
      
      <div id="circular" class="circular">
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
      </div>
      <div className="pokeCards">
      <div className="pokeCard1" id="poke1" onClick={checkWinner}>
      <div className="card-poke1">
      <img src={imgSrc1} alt={pokeName1}></img>
        <h1 className="pokeName1">{pokeName1}</h1>
      </div>
    </div>

    <div className="pokeCard2" id="poke2" onClick={checkWinner}>
      <div className="card-poke2">
      <img src={imgSrc2} alt={pokeName2}/>
      <h1 className="pokeName2">{pokeName2}</h1>
      </div>
    </div>
    </div>
    <ToastContainer
          position="top-center"
          closeButton={false}
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </div>
 

    <Dialog className="leaderboard-dialog"open={open} onClose={handleClose} classes={{
        paper: classes.dialog
      }}>
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
