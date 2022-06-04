import React, {useState, useEffect} from 'react';
import { connectAuthEmulator, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile }  from "firebase/auth";
import { db, auth, realDb } from "./firebase-config";
import { collection, getDocs, addDoc, doc, updateDoc} from "firebase/firestore";
import {getDatabase, ref, set, child, update, remove, onValue} from "firebase/database";
import { Navigate, useNavigate } from 'react-router-dom';

export default function LoginForm({Login, error}) {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newUn, setNewUn] = useState("");
    const [newCountry, setNewCountry] = useState("");
    const [userId, setUid] = useState({});

    let navigate = useNavigate();

    let today = new Date();
    let date=parseInt(today.getMonth()+1) + "/" + today.getDate() + "/"+today.getFullYear();

    useEffect(()=> {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          
        });
      });
    const [user, setUser] = useState({});
  

    const createUser = async () => {
      console.log(user.uid);
      await set(ref(realDb, 'users/' + user.uid),{
				firstname: newName,
				username: newUn,
				country: newCountry,
        email: user?.email,
        joindate: date, 
        poke_highscore: 0,
      })
      navigate('/Home');
    };


    //save users information in database
    const submitHandler = e => {
        e.preventDefault();
       
        alert("Information saved");
    }


  return (
    
        <div className="form-inner">
            <h1>Welcome, {user?.email} </h1>
            <h2>Add Your Info</h2>
            {/* Error*/}
            <div className="form-group">
                <input type="text" placeholder="Name" name="name" id="name" onChange={e => setNewName(e.target.value)}/>
            </div>
            <br></br>
            <div className="form-group">
                <input type="text" placeholder='Username' name="username" id="username" onChange={e => setNewUn(e.target.value)}/>
            </div>
            <br></br>
            <div className="form-group">
                <input type="text" placeholder='Country' name="country" id="country" onChange={e => setNewCountry(e.target.value)}/>
            </div>
            <br></br>
            <button className="submitButton" onClick={createUser}>Submit</button>
            
        </div>
        
 
  )
}
