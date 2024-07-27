import React from "react";
import { useUser } from "../Context/UserProvider";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../Components/UI/PageTitle";
import exchange_icon from "../assets/Icons/exchange.png";
import plus_icon from "../assets/Icons/plus.png";

const Trade = () => {
  const { currentUser } = useUser();
  const [items, setItems] = useState([]);
  const location = useLocation();
  const { item } = location.state || {};
  const [tradeItemSelectedId, setTradeItemSelectedId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      let itemsQuery;

      if (currentUser) {
        itemsQuery = query(
          collection(db, "Assets"),
          where("userId", "==", currentUser.uid)
        );
      } else {
        itemsQuery = query(collection(db, "Assets"));
      }

      const snapshot = await getDocs(itemsQuery);
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    };

    fetchItems();
  }, [currentUser]);

  return (
    <>
      <div className="page_content">
        <PageTitle title="Trade" />
        <div className="trade_main">
          <div className="trade_frame">
            <div className="top">
              <div className="trading_for_item">
                <div className="trading_for_item_container">
                  {item && (
                    <div className="trading_for_item_card">
                      <div className="card_image">
                        <img src={item.thumbnail} alt={item.title} />
                      </div>

                      <div className="card_details">
                        <h3 className="title">{item.title}</h3>

                        <p className="price">
                          {(
                            item.price -
                            (item.price * item.discount) / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="trade_icon">
                <img src={exchange_icon} alt="Trade" />
              </div>

              <div className="my_trade_item">
                <div className="my_trade_item_container">
                  {/* {tradeItemSelectedId &&
              items.map((item) => (
                <div key={item.id} className="my_trade_item_card">
                  <img src={item.thumbnail} alt={item.title} />
                  <h3>{item.title}</h3>

                  <p>
                    {(item.price - (item.price * item.discount) / 100).toFixed(
                      2
                    )}
                  </p>
                </div>
              ))} */}

                  {tradeItemSelectedId &&
                    items.filter((item) => item.id === tradeItemSelectedId)
                      .length > 0 && (
                      <div className="my_trade_item_card">
                        <div className="card_image">
                          <img
                            src={
                              items.find(
                                (item) => item.id === tradeItemSelectedId
                              )?.thumbnail
                            }
                            alt={
                              items.find(
                                (item) => item.id === tradeItemSelectedId
                              )?.title
                            }
                          />
                        </div>

                        <div className="card_details">
                          <h3 className="title">
                            {
                              items.find(
                                (item) => item.id === tradeItemSelectedId
                              )?.title
                            }
                          </h3>

                          <p className="price">
                            {(
                              items.find(
                                (item) => item.id === tradeItemSelectedId
                              )?.price -
                              (items.find(
                                (item) => item.id === tradeItemSelectedId
                              )?.price *
                                items.find(
                                  (item) => item.id === tradeItemSelectedId
                                )?.discount) /
                                100
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="bottom">
              <button className="trade_button">Trade</button>
            </div>
          </div>

          <div className="trade_options">
            <div className="title">
              <h1>Your Items</h1>
            </div>
            {items.filter((item) => item.id !== tradeItemSelectedId).length ===
              0 && (
              <div className="no_items">
                <h1>No items available</h1>
              </div>
            )}
            {items
              .filter(
                (item) =>
                  item.price - (item.price * item.discount) / 100 > 0 &&
                  item.id !== tradeItemSelectedId
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="trade_option_card"
                  onClick={() => setTradeItemSelectedId(item.id)}
                >
                  <div className="card_image">
                    <img src={item.thumbnail} alt={item.title} />
                  </div>

                  <div className="card_details">
                    <h3 className="title">{item.title}</h3>

                    <p className="price">
                      {(
                        item.price -
                        (item.price * item.discount) / 100
                      ).toFixed(2)}
                    </p>
                  </div>

                  <button
                    className="add_to_trade"
                    onClick={() => setTradeItemSelectedId(item.id)}
                  >
                    <img src={plus_icon} alt="Add" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trade;
