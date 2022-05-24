import { useState, useEffect } from "react";
import Stylesheet from './HomeStyleSheet';
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Switch, Link, useNavigate } from "react-router-dom";

export default function Home() {
    useEffect(()=> {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
      });
    
      const [user, setUser] = useState({});
  return (
    <>
    <Stylesheet primary ={true}/>
    <div className="mainHome">
        This will be the home page
    </div>
    
    </>
  )
}
