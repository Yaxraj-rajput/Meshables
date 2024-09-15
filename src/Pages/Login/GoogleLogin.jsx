import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../../../firebase";
import { auth } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";



export const loginWithGoogle = () => {
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
      alert("Login with Google successful!");
      window.location.href = "/"; // Redirect to the home page after login
    })
    .catch((error) => {
      console.log(error);
      alert("Login with Google failed: " + error.message);
    });
};
