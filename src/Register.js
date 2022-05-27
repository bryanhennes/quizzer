import React, {useState, useEffect} from 'react'
import { db, auth } from "./firebase-config";
import { Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { collection, getDocs, addDoc, doc, updateDoc} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const usersCollectionRef = collection(db, "users");

    const [user, setUser] = useState({});
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

    useEffect(()=> {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    });


    const register = async () => {
      try{
        const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        console.log(user);
        navigate('/LoginForm');
      }catch (error){
        console.log(error.code);
        notify(error.code);
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
        <input type="password" placeholder="Password..." onChange={(e) => {
          setRegisterPassword(e.target.value);
        }}/>
        <br></br>
        <br></br>
        <div className="RegisterButton">
        <button onClick={register}>Sign Up</button>
        </div>
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
