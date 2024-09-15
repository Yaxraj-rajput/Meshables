import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  // Sign out the user
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out");
      navigate("/");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });

  return <div></div>;
};

export default Logout;
