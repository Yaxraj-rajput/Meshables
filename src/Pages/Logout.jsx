import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Logout = () => {
  // Sign out the user
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out");
      window.location.href = "/";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });

  return <div></div>;
};

export default Logout;
