import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Import Firestore functions

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="login">
        <div className="google_login">
          <button className="google" onClick={loginWithGoogle}>
            <i className="fab fa-google"></i> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
