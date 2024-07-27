import React from "react";
import { useUser } from "../../Context/UserProvider";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const TradeButton = (props) => {
  const { currentUser } = useUser();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      let itemsQuery;

      if (currentUser) {
        itemsQuery = query(
          collection(db, "Assets"),
          where("userId", "==", currentUser.uid)
        );
      } else {
        itemsQuery = collection(db, "Assets");
      }

      const snapshot = await getDocs(itemsQuery);
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    };

    fetchItems();
  }, []);

  if (currentUser) {
    return (
      <>
        <button>Trade</button>

        <div className="dropdown">
          <div className="dropdown-content">
            {items.map((item) => (
              <a key={item.id} href={`/View/${item.id}`}>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default TradeButton;
