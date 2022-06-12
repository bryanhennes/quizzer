import React, {useState, useEffect, setState} from 'react';
import { db, auth, realDb } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import userEvent from '@testing-library/user-event';
import Stylesheet from './ProfileStyleSheet';
import pic from './handsomesquidward.jpg';
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate, Navigate, useParams } from "react-router-dom";
import {getDatabase, ref, set, child, update, remove, onValue, get} from "firebase/database";



export default function Profile() {

  const [newName, setName] = useState("");
  const [newUn, setUsername] = useState("");
  const [newCountry, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      readData();
    });
  });
  

  //reference user in database
  const userRef = ref(realDb, 'users/'+user.uid);

  //read users data from firebase
  const readData = async () => {
    onValue(userRef, (snapshot) => {
      if(snapshot.exists()){
      const data = snapshot.val();
        setCountry(data?.country);
        setName(data?.firstname);
        setUsername(data?.username);
        setDate(data?.joindate);
      }     
  })
}

  return (
    <div className="profile">
    <div class="profile-card">
    <img src={pic} alt="Person"/>
    <h1>{newUn}</h1>
    <p>Country: {newCountry}</p>
    <p>Member Since: {date}</p>
    </div>
    <br></br>
    <div className="achievements-card">
      <h1>Achievements</h1>
    </div>
    
    
    </div>
  )
}
