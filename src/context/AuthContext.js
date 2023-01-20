import React, { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  signInWithPopup,
  GithubAuthProvider,
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

  function githupSingIn() {
    const githupProvider = new GithubAuthProvider();
    //Function with firebase method to sign in with Github
    signInWithPopup(auth, githupProvider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credentials = GithubAuthProvider.credentialFromResult(result);
        const token = credentials.accessToken;

        //signOut();
        //console.log(result.user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // The email of the user's account used.
        //const email = error.customData.email;
        // The AuthCredential type that was used.
        //const credential = new GithubAuthProvider.credentialFromError(error);
        // ...
      });
  }

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

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function emailUpdate(email) {
    return updateEmail(currentUser, email);
  }

  function passwordUpdate(email) {
    return updatePassword(currentUser, email);
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
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  //Context value to provide
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    emailUpdate,
    passwordUpdate,
    githupSingIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
