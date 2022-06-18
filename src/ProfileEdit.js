import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { db, auth, realDb } from "./firebase-config";
import {getDatabase, ref, set, child, update, remove, onValue, get, query, limitToLast, orderByChild} from "firebase/database";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";

export default function ProfileEdit() {

const [user, setUser] = useState({});
const [name, setName] = useState("");
const [country, setCountry] = useState("");
const [username, setUsername] = useState("");
const [newUn, setNewUsername] = useState(username);
const [newName, setNewName] = useState(name);
const [newCountry, setNewCountry] = useState(country);

  useEffect(()=> {
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    getUserInfo();
  });
});

const updateInfo = async () => {
    update(ref(realDb, 'users/' + user.uid), {
        firstname: newName,
        username: newUn,
        country: newCountry,
    })

}

const getUserInfo = async () => {
    const userRef = ref(realDb, 'users/'+user.uid);
    onValue(userRef, (snapshot) => {
      if(snapshot.exists()){
      const data = snapshot.val();
        setName(data?.firstname);
        setCountry(data?.country);
        setUsername(data?.username);
      }
    })
}

  return (
    <>
    <div>ProfileEdit</div>
    <div className="form-inner">
        <h2>Add Your Info</h2>
            {/* Error*/}
            <div className="form-group">
                <input type="text" placeholder={name} name="name" id="name" onChange={e => setNewName(e.target.value)}/>
            </div>
            <br></br>
            <div className="form-group">
                <input type="text" placeholder={username} name="username" id="username" onChange={e => setNewUsername(e.target.value)}/>
            </div>
            <br></br>
            <div className="form-group">
                <input type="text" placeholder={country} name="country" id="country" onChange={e => setNewCountry(e.target.value)}/>
            </div>
            <br></br>
            <button onClick={updateInfo}>Update Info</button>
            
        </div>
        
    </>
  )
}
