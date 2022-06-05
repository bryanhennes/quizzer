import { useState, useEffect, DropdownButton, Dropdown } from "react";
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import Stylesheet from "./Stylesheet";
import Home from "./Home";
import NavBarSignedIn from "./NavBarSignedIn";
import NavBarNotSignedIn from "./NavBarNotSignedIn";

import Navigation from "./Navigation";






function App() {

  
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const usersCollectionRef = collection(db, "users");

  const [user, setUser] = useState({});

  useEffect(()=> {
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  
});


 
  return (
    <>
    <Stylesheet primary ={true}/>
    {/*show different options on nav bar depending on whether or not a user is logged in
    {(user != null) ? (
        <Navigation />
      ):(
        <NavBarNotSignedIn />
      )}*/}


      <Navigation />
    
     
     



      

    
    

    </>
  )
}

export default App;
