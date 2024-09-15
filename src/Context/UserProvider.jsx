import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // fetch user profile data from Firestore
      const fetchUserProfile = async () => {
        if (user) {
          const userProfileRef = doc(db, "Profiles", user.uid);
          const userProfileSnap = await getDoc(userProfileRef);

          if (userProfileSnap.exists()) {
            const profileData = userProfileSnap.data();
            setUserProfile(profileData);
            // console.log(
            //   "User profile data fetched from Firestore",
            //   profileData
            // );
          } else {
            console.log("No such document!");
          }
        } else {
          setUserProfile(null); // Clear profile data if no user is logged in
        }
      };

      fetchUserProfile();
    });

    return unsubscribe;
  }, [db]);

  const updateUserProfile = async (updatedProfile) => {
    if (currentUser) {
      const userProfileRef = doc(db, "Profiles", currentUser.uid);
      await updateDoc(userProfileRef, updatedProfile);
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        ...updatedProfile,
      }));
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, userProfile, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
