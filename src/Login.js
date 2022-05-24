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
      navigate('/Home');
    }catch (error){
      alert(error.message);
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
      <Stylesheet primary ={true}/>
        <br></br>
        <h3>Login</h3>
        <input placeholder="Email..." onChange={(e) => {
          setloginEmail(e.target.value);
        }}/>
        <br></br>
        <input type="password" placeholder="Password..." onChange={(e) => {
          setloginPassword(e.target.value);
        }}/>
        <br></br>
        <br></br>
        <button onClick={login}>Login</button>


       
        <br></br>
        <br></br>
        <div className="registerbtn">
        {/*<button onClick={()=>{navigate('/Register')}}>Register</button>*/}
        </div>
      </div>
  )
}
