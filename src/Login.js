import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import Stylesheet from "./Stylesheet";


export default function Login() {
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  let navigate = useNavigate();

  const login = async () => {
    try{
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
    }catch (error){
      console.log(error.message);
    }
  }

  const logout = async () => {
    await signOut(auth);
  }

  const [user, setUser] = useState({});

  useEffect(()=> {
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
});

  return (
    <div className="mainPage">
      <div className="Welcome">
      <h2>Welcome, <span>{user?.email}</span></h2>
      </div>
      <Stylesheet primary ={true}/>
        <h3>Login</h3>
        <input placeholder="Email..." onChange={(e) => {
          setloginEmail(e.target.value);
        }}/>
        <br></br>
        <input placeholder="Password..." onChange={(e) => {
          setloginPassword(e.target.value);
        }}/>
        <br></br>
        <button onClick={login}>Login</button>

        <h4>User Logged In:</h4>
        <p>{user?.email}</p>

        <button onClick={logout} id="signout">Sign Out</button>
        <br></br>
        <br></br>
        <div className="registerbtn">
        <button onClick={()=>{navigate('/Register')}}>Register</button>
        </div>
      </div>
  )
}
