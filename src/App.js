import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";
import Stylesheet from "./Stylesheet";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import NavBarSignedIn from "./NavBarSignedIn";
import NavBarNotSignedIn from "./NavBarNotSignedIn";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function App() {

  toast.configure();
  /* try to make this conditional formatting work

    {(user != null) ? (
        <NavBarSignedIn />
      ):(
        <h1>Not Logged in</h1>
      )}


  */

  const goToRegister = () => {
  
  }

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
  
  //newName is input from name input field...useState is default state of name input which should be empty string
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const usersCollectionRef = collection(db, "users");

  const [user, setUser] = useState({});

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

 
  return (
    <>
    <Stylesheet primary ={true}/>
    {/*show different options on nav bar depending on whether or not a user is logged in*/}
    {(user != null) ? (
        <NavBarSignedIn />
      ):(
        <NavBarNotSignedIn />
      )}
    

    <div className ="mainPage">
      

    </div>

    </>
  )
}

export default App;
