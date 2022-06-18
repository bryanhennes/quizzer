import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import Stylesheet from "./Stylesheet";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Login() {
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  let navigate = useNavigate();


  //translate firebase error codes to more readable messages
  const notify = (message) => {
    const map = {};
    map['auth/user-not-found'] = "Account with that email does not exist";
    map['auth/wrong-password'] = 'Password is incorrect'
    map['auth/invalid-email'] = 'Please enter a valid email';
    map['auth/invalid-password'] = 'Password must be at least 6 characters';
    map['auth/email-already-in-use'] = "An account with that email already exists";
    map['auth/internal-error'] = 'Enter valid credentials';
    toast(map[message]);
  }

  
  const handleSubmit = event => {
    event.preventDefault()
    login();
  }

  const login = async () => {
    try{
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
      navigate('/Home');
    }catch (error){
      console.log(error.code);
      notify(error.code);
    }
  }

  const logout = async () => {
    await signOut(auth);
  }

  const goToRegister = async () => {
    navigate('/Register');
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
        {/*<h3>Login</h3>
        <br></br>
        <input placeholder="Email..." onChange={(e) => {
          setloginEmail(e.target.value);
        }}/>
        <br></br>
        <input type="password" placeholder="Password..." onChange={(e) => {
          setloginPassword(e.target.value);
        }}/>
        <br></br>
        <div className="LoginButton">
        <button onClick={login}>Login</button>
      </div>*/}

<section className="section-sign-up">
  <div className="sign-up-card">
  <h1>Quizzer</h1>
    <form onSubmit={handleSubmit} className="form">
      <div className="form-control">
        <input id="email" type="email" name='email' autocomplete="email" onChange={(e) => {
          setloginEmail(e.target.value);
        }}/>
      </div>
      <div className="form-control">
       
        <input id="password" type="password" name='password'  autocomplete="password" onChange={(e) => {
          setloginPassword(e.target.value);
        }}/>
      </div>
      <div className="form-control">
        <button className="btn-sign-up" type='submit'>Log In</button>
      </div>
      <div className="more">
        <a onClick={goToRegister} className="forget-password-link">Don't have an account? Sign up.</a>
      </div>
    </form>
  </div>
</section>
      
        <div className="toast">
        <ToastContainer
          position="top-center"
          autoClose={2000}
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
