import React, {useState, useEffect} from 'react';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import userEvent from '@testing-library/user-event';
import './profile.css';
import Home from "./Home";
import pic from './handsomesquidward.jpg';


export default function Profile() {

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  const [user, setUser] = useState({});
  return (
    <div className="profile">Welcome, {user?.email}
    <div className="profile_pic">
      <img src={pic} alt="Person"/>
    </div>
    
    
    
    </div>
  )
}
