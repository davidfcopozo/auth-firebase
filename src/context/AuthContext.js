import React, { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

//Create context
const AuthContext = React.createContext();

//Function to use the context
export function useAuth() {
  return useContext(AuthContext);
}

//Context provider
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //Function with firebase method to create a user with username and password
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  //Run this code only when the component mounts
  useEffect(() => {
    //Method to store current user in the state variable and unsubscribe it when unmounted
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    //Cleanup to unsubscribe
    return unsubscribe;
  }, []);

  //Context value to provide
  const value = {
    currentUser,
    signup,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
