import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { useUser } from "../Context/UserProvider";

const Group = () => {
  const { currentUser } = useUser();
  const [mails, setMails] = useState([]);
  const [requests, setRequests] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    groupName: "",
    users: [],
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        users: [
          {
            email: currentUser.email,
            role: "owner",
            isAccepted: true,
          },
        ],
      }));
    }
  }, [currentUser]);

  const handleGroupNameChange = (e) => {
    setFormData({
      ...formData,
      groupName: e.target.value,
    });
  };

  const handleEmailsChange = (e) => {
    const emailInput = e.target.value;
    const emailArray = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
    setMails(emailArray);
  };

  const createGroup = async () => {
    console.log("create group");
    try {
      const users = [
        ...formData.users,
        ...mails.map((email) => ({
          email,
          role: "member",
          isAccepted: false,
        })),
      ];
      const docRef = await addDoc(collection(db, "Groups"), {
        groupName: formData.groupName,
        users,
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  const fetchRequests = async () => {
    console.log("fetch requests");
    try {
      const requestsQuery = query(
        collection(db, "Groups")
        // where("users", "array-contains", {
        //   email: "yaxrajd@gmail.com",
        //   isAccepted: false,
        // })
      );

      const snapshot = await getDocs(requestsQuery);
      const requestsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((group) =>
          group.users.some((user) => user.email === currentUser.email)
        );

      setRequests(requestsData);

      if (requestsData.length > 0) {
        console.log("You have group requests");
      } else {
        console.log("No group requests found");
      }

      return requestsData;
    } catch (error) {
      console.error("Error fetching group requests: ", error);
      throw error;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }
  const acceptTrade = async (groupId, userEmail) => {
    console.log("accept trade");
    try {
      const groupRef = doc(db, "Groups", groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();
      const userIndex = groupData.users.findIndex(
        (user) => user.email === userEmail
      );
      if (userIndex !== -1) {
        groupData.users[userIndex].isAccepted = true;
        await updateDoc(groupRef, {
          users: groupData.users,
        });
        console.log("Trade accepted");
        return true;
      } else {
        console.error("User not found in group");
        return false;
      }
    } catch (error) {
      console.error("Error accepting trade: ", error);
      throw error;
    }
  };
  return (
    <div className="page_content">
      <div className="group_page_main">
        <div className="tabs">
          <div
            className="tab"
            style={{
              fontSize: ".8rem",
            }}
            onClick={async () => setCurrentPage(4)}
          >
            Incoming requests
          </div>
          <div
            className={`tab ${currentPage == 1 ? "active" : ""}`}
            onClick={async () => {
              setCurrentPage(1);
            }}
          >
            1. Name your group
          </div>
          <div
            className={`tab ${currentPage == 2 ? "active" : ""}`}
            onClick={async () => {
              setCurrentPage(2);
            }}
          >
            2. Add members
          </div>
          <div
            className={`tab ${currentPage == 3 ? "active" : ""}`}
            onClick={async () => {
              setCurrentPage(3);
            }}
          >
            3. Review & create
          </div>
        </div>

        {currentPage === 1 && (
          <div className="group_tab">
            <div className="title">
              <h2>Name your group</h2>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCurrentPage(2);
              }}
            >
              <input
                type="text"
                name="groupname"
                onChange={handleGroupNameChange}
                placeholder="group name"
                value={formData.groupName}
              />

              <button type="submit">Create Group</button>
            </form>
          </div>
        )}

        {currentPage === 2 && (
          <div className="group_tab">
            <div className="title">
              <h2>Add members to the group</h2>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCurrentPage(3);
              }}
            >
              <input
                type="text"
                name="mails"
                onChange={handleEmailsChange}
                placeholder="email"
              />
              <button type="submit">Add Members</button>
            </form>
          </div>
        )}

        {currentPage === 3 && (
          <div className="group_tab">
            <div className="title">
              <h2>Review & Create</h2>
            </div>
            <div className="group_details">
              <h3 className="group_title">{formData.groupName}</h3>
              <form action="">
                <div className="users">
                  <div className="user">
                    <span>{currentUser.email}</span>
                    <span className="role">Owner</span>
                  </div>
                  {mails.map((email) => (
                    <div className="user" key={email}>
                      <span>{email}</span>
                      <span className="role">member</span>
                      <div className="buttons">
                        <button>
                          <i className="icon fas fa-pencil"></i>
                        </button>
                        <button>
                          <i className="icon fas fa-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={createGroup}>Create Group</button>
              </form>
            </div>
          </div>
        )}

        {currentPage === 4 && (
          <div className="group_tab">
            <form>
              <div className="group_requests">
                <h2>Group Requests</h2>
                <div className="requests">
                  {requests.map((request) => (
                    <div className="request" key={request.id}>
                      <h3>{request.groupName}</h3>
                      <div className="users">
                        {request.users.map((user) => (
                          <div className="user" key={user.email}>
                            <span>{user.email}</span>
                            <span className="role">
                              {user.role}{" "}
                              {user.isAccepted ? (
                                <i className="tickmark fas fa-check"></i>
                              ) : (
                                ""
                              )}
                            </span>

                            {/* <span>
                              {" "}
                              {user.isAccepted ? "Accepted" : "Pending"}
                            </span> */}
                          </div>
                        ))}
                      </div>

                      {request.users.find(
                        (user) => user.email === currentUser.email
                      ) && (
                        <button
                          onClick={async () => {
                            await acceptTrade(request.id, currentUser.email);
                            fetchRequests();
                          }}
                        >
                          {request.users.find(
                            (user) => user.email === currentUser.email
                          ).isAccepted
                            ? "Accepted"
                            : "Accept"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;
