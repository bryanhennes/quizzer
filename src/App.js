import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { db, auth } from "./firebase-config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut }  from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";



function App() {
  const register = async () => {
    try{
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
    }catch (error){
      console.log(error.message);
    }
  };

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
      <div className="registerUser">
        <h3>Register User</h3>
        <input placeholder="Email..." onChange={(e) => {
          setRegisterEmail(e.target.value);
        }}/>
        <input placeholder="Password..." onChange={(e) => {
          setRegisterPassword(e.target.value);
        }}/>
        <button onClick={register}>Create User</button> 
      </div>

      <div className="login">
        <h3>Login</h3>
        <input placeholder="Email..." onChange={(e) => {
          setloginEmail(e.target.value);
        }}/>
        <input placeholder="Password..." onChange={(e) => {
          setloginPassword(e.target.value);
        }}/>
        <button onClick={login}>Login</button>

        <h4>User Logged In:</h4>
        <p>{user?.email}</p>

        <button onClick={logout}>Sign Out</button>
      </div>
    

    </>
  )
}

export default App;
