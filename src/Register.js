import React, {useState, useEffect} from 'react'
import { db, auth, realDb } from "./firebase-config";
import {getDatabase, ref, set, child, update, remove, onValue} from "firebase/database";
import { Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { collection, getDocs, addDoc, doc, updateDoc} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [newName, setNewName] = useState("");
    const [newUn, setNewUn] = useState("");

    const [user, setUser] = useState({});
    let navigate = useNavigate();

    let today = new Date();
    let date=parseInt(today.getMonth()+1) + "/" + today.getDate() + "/"+today.getFullYear();

    //translate firebase error codes to more readable messages
    const notify = (message) => {
    const map = {};
    map['auth/user-not-found'] = "Account with that email does not exist";
    map['auth/wrong-password'] = 'Password is incorrect';
    map['auth/missing-email'] = 'Please enter a valid email';
    map['auth/invalid-email'] = 'Please enter a valid email';
    map['auth/invalid-password'] = 'Password must be at least 6 characters';
    map['auth/email-already-in-use'] = "An account with that email already exists";
    map['auth/internal-error'] = 'Please enter valid credentials';
    map['auth/weak-password'] = 'Password must be at least 8 characters';
    toast(map[message]);
  }

    useEffect(()=> {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        //setEmail(user?.email);
      });
    });

    const handleSubmit = event => {
      event.preventDefault()
      toast('Almost there...enter your name and create a username to start playing!');
      register();
      event.target.reset();
    }

    const handleFinalSubmit = event => {
      event.preventDefault()
      if(newName === "" || newUn === ""){
        toast('Cannot leave fields blank');
      }
      else {
        createUser();
      }
      
    }

    const goToLogin = async () => {
      navigate('/Login');
    }

    const createUser = async () => {

      await set(ref(realDb, 'users/' + user.uid),{
				firstname: newName,
				username: newUn,
        email: user?.email,
        joindate: date, 
        poke_highscore: 0,
        poke_name_highscore: 0,
      })
      navigate('/Home');
    };


    const register = async () => {
      try{
        const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        console.log(user);
        //navigate('/LoginForm');
      }catch (error){
        console.log(error.code);
        notify(error.code);
      }
    };
  return (
    <div className="registerUser">
        <br></br>
        {/*<h3>Sign Up</h3>
        <br></br>
        <input placeholder="Email..." onChange={(e) => {
          setRegisterEmail(e.target.value);
        }}/>
        <br></br>
        <input type="password" placeholder="Password..." onChange={(e) => {
          setRegisterPassword(e.target.value);
        }}/>
        <br></br>
        <br></br>
        <div className="RegisterButton">
        <button onClick={register}>Sign Up</button>
      </div>*/}
      <section class="section-sign-up">
  <div class="sign-up-card">
  <h1>Quizzer</h1>
  {(user === null) ? (
    <form className="form" onSubmit={handleSubmit}>
    <div className="form-control">
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" onChange={(e) => {
        setRegisterEmail(e.target.value);
      }}/>
    </div>
    <div className="form-control">
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" onChange={(e) => {
        setRegisterPassword(e.target.value);
      }}/>
    </div>
    <div className="form-control">
        <button type ='submit' className="btn-sign-up">Sign Up</button>
      </div>
      <div className="more">
        <a className="forget-password-link" href="#" onClick={goToLogin}>Already have an account? Sign In.</a>
      </div>
    </form>
            
          ):(
    <form className="form" onSubmit={handleFinalSubmit}>
      <div className="form-control">
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" onChange={e => setNewName(e.target.value)}/>
      </div>
      <div className="form-control">
        <label htmlFor="username">Username:</label>
        <input id="username" type="text" onChange={e => setNewUn(e.target.value)}/>
      </div>
      <div className="form-control">
        <button type ='submit' className="btn-sign-up">Save</button>
      </div>
    </form>)}
 </div>
 </section>

        <div className="toast">
        <ToastContainer
          position="center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </div>
      </div>
  )
}
