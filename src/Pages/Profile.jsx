import React, { useEffect, useState } from "react";
import Breadcrumbs from "../Components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../Context/UserProvider";
import ItemsListing from "../Components/ItemsListing";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const followUser = async () => {
    // Implement follow user functionality here

    if (!user) {
      return;
    }

    const userRef = doc(db, "Profiles", id);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const followers = userData.followers || []; // Ensure followers is an array

      // add current user to followers list

      if (followers.includes(currentUser.uid)) {
        const index = followers.indexOf(currentUser.uid);
        followers.splice(index, 1);
        setIsFollowing(false);
      } else {
        followers.push(currentUser.uid);
        setIsFollowing(true);
      }

      await updateDoc(userRef, {
        followers,
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "Profiles", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          //   console.log("User data:", docSnap.data());
          setUser(docSnap.data());

          if (currentUser && currentUser.uid) {
            setIsFollowing(
              docSnap.data().followers &&
                docSnap.data().followers.includes(currentUser.uid)
            );
          }
        } else {
          console.log("No such user!");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    setTimeout(() => {
      fetchUser();
    }, 1000);
  }, [id]);

  return (
    <div className="page_content">
      <div className="profile_main">
        <div className="profile">
          <div className="top">
            <div className="left">
              <div className="profile_image">
                <img
                  src={
                    user
                      ? user.profilePic
                      : "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account"
                  }
                  alt={user ? user.username : "User"}
                />
              </div>

              <div className="profile_details">
                <div className="details">
                  <h1 className="username">{user ? user.username : "User"}</h1>
                  <span className="email">{user ? user.email : "Email"}</span>
                  <span className="bio">{user ? user.bio : "Bio"}</span>
                </div>
                <div className="rating">
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={`filled_${i}`}
                        className={`icon fas fa-star ${
                          user &&
                          typeof user.rating === "number" &&
                          user.rating > i
                            ? "filled"
                            : ""
                        }`}
                      ></i>
                    ))}
                  </div>

                  <span className="rating_count">
                    {user && typeof user.rating_count === "number"
                      ? user.rating_count
                      : 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="right">
              <span className="follower_count">
                {user && user.followers ? user.followers.length : 0} Followers
              </span>

              <div className="actions">
                <button className="follow_btn" onClick={followUser}>
                  {isFollowing ? (
                    <i className="icon fas fa-minus"></i>
                  ) : (
                    <i className="icon fas fa-plus"></i>
                  )}
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom"></div>
        <ItemsListing category="model" userId={user ? user.id : id} />
      </div>
    </div>
  );
};

export default Profile;
