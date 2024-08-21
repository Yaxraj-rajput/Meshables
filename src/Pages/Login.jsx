import React from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Import Firestore functions
import { Helmet } from "react-helmet";

const Login = () => {
  const db = getFirestore(); // Initialize Firestore

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        console.log("login successful with email id", result.user.email);

        // Check if the user's profile already exists in the Firestore collection
        const userProfileRef = doc(db, "Profiles", result.user.uid);

        // Set the user's profile in Firestore "Profiles" collection
        await setDoc(
          userProfileRef,
          {
            username: result.user.displayName,
            email: result.user.email,
            profilePic: result.user.photoURL,
            uid: result.user.uid,
          },
          { merge: true }
        ); // Use merge option to avoid overwriting existing fields

        console.log("User profile stored in Firestore");

        window.location.href = "/"; // Redirect to the home page after login
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loginWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        console.log("login successful with email id", result.user.email);

        // Check if the user's profile already exists in the Firestore collection
        const userProfileRef = doc(db, "Profiles", result.user.uid);

        // Set the user's profile in Firestore "Profiles" collection
        await setDoc(
          userProfileRef,
          {
            username: result.user.displayName,
            email: result.user.email,
            profilePic: result.user.photoURL,
            uid: result.user.uid,
          },
          { merge: true }
        ); // Use merge option to avoid overwriting existing fields

        console.log("User profile stored in Firestore");
        window.location.href = "/"; // Redirect to the home page after login
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Login | Meshables</title>
        <meta name="description" content="Login with Google or GitHub" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Login | Meshables" />
        <meta property="og:description" content="Login with Google or GitHub" />
        <meta property="og:url" content="https://meshables.me/#/login" />
      </Helmet>
      <div className="page_content">
        <div className="login">
          <div className="buttons">
            <button className="google" onClick={loginWithGoogle}>
              <i className="fab fa-google"></i> Login with Google
            </button>
            <button className="github" onClick={loginWithGithub}>
              <i className="fab fa-github"></i> Login with GitHub
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
