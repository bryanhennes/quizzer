import React, {useState, useEffect} from 'react'
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";


export default function Register() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [user, setUser] = useState({});

    useEffect(()=> {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    });

    const register = async () => {
      try{
        const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        console.log(user);
      }catch (error){
        console.log(error.message);
      }
    };
  return (
    <div className="registerUser">
        <br></br>
        <h3>Sign Up</h3>
        <input placeholder="Email..." onChange={(e) => {
          setRegisterEmail(e.target.value);
        }}/>
        <br></br>
        <input placeholder="Password..." onChange={(e) => {
          setRegisterPassword(e.target.value);
        }}/>
        <br></br>
        <br></br>
        <button onClick={register}>Sign Up</button> 
      </div>
  )
}
