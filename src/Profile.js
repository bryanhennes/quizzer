import React, {useState, useEffect} from 'react';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import userEvent from '@testing-library/user-event';
import './profile.css';
import Home from "./Home";
import pic from './handsomesquidward.jpg';
import { collection, getDocs, addDoc } from "firebase/firestore";


export default function Profile() {

  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);

  useEffect(()=> {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  //display current users from firebase on page
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    getUsers();
  }, [])

  const [user, setUser] = useState({});
  return (
    <div className="profile">Welcome, {user?.email}
    <div className="profile_pic">
      <img src={pic} alt="Person"/>
    </div>
    
    
    
    </div>
  )
}
