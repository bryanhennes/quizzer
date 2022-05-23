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




function App() {



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
    <Router>
    <nav>
      <div className="topnav">
    
      <Link to="/">Login</Link>
      <Link to="/Profile">Profile</Link>
      <Link to="/Register">Sign Up</Link>
      </div>
    </nav>
    <div className="appName">Quizzer</div>
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
    </Router>

    <div className ="mainPage">

    </div>

    </>
  )
}

export default App;
