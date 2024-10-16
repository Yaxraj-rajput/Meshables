import React from "react";
import { useUser } from "../Context/UserProvider";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../Components/UI/PageTitle";
import exchange_icon from "../assets/Icons/exchange.png";
import plus_icon from "../assets/Icons/plus.png";

const Trade = () => {
  const { currentUser } = useUser();
  const [items, setItems] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
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

  useEffect(() => {
    const fetchTradeItems = async () => {
      try {
        if (!currentUser) {
          return;
        }

        const itemsQuery = query(collection(db, "Trades"));

        const snapshot = await getDocs(itemsQuery);
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTradeItems(itemsData);
      } catch (error) {
        console.error("Error fetching trade items: ", error);
      }
    };

    fetchTradeItems();
  }, [currentUser]);

  const placeTrade = async () => {
    // Extract details of the asset we are trading with
    const tradingWithUserId = item.userId;
    const tradingWithUserAssetId = item.id;
    const tradingWithUserAssetTitle = item.title;
    const tradingWithUserAssetThumbnail = item.thumbnail;
    const tradingWithUserAssetPrice = item.price;
    const tradingWithUserAssetDiscount = item.discount;

    // Extract details of our asset
    const ourAsset = items.find((item) => item.id === tradeItemSelectedId);

    if (!ourAsset) {
      console.error("Selected trade item not found");
      return;
    }

    const tradeData = {
      tradingWithUserId,
      tradingWithUserAssetId,
      tradingWithUserAssetTitle,
      tradingWithUserAssetThumbnail,
      tradingWithUserAssetPrice,
      tradingWithUserAssetDiscount,
      ourUserId: currentUser.uid,
      ourAssetId: ourAsset.id,
      ourAssetTitle: ourAsset.title,
      ourAssetThumbnail: ourAsset.thumbnail,
      ourAssetPrice: ourAsset.price,
      ourAssetDiscount: ourAsset.discount,
    };

    console.log(tradeData);

    // Save the trade data to the "Trades" collection
    const tradeRef = doc(
      db,
      "Trades",
      `${currentUser.uid}_${tradingWithUserId}_${tradingWithUserAssetId}_${ourAsset.id}`
    );

    try {
      await setDoc(tradeRef, tradeData);
      console.log("Trade successfully placed");
    } catch (error) {
      console.error("Error placing trade: ", error);
    }
  };

  return (
    <>
      <div className="page_content">
        <PageTitle title="Trade" />

        <div className="trade_main">
          {/* <div>
            <div className="title">Items to be traded with me</div>

            <div>
              {tradeItems.map((item) => (
                <div key={item.tradedAssetId} className="trade_item_card">
                  <div className="card_image">
                    <img
                      src={item.trading_with_user_asset_thumbnail}
                      alt={item.title}
                    />
                  </div>

                  <div className="card_details">
                    <h3 className="title">{item.title}</h3>

                    <p className="price">
                      {(
                        item.price -
                        (item.trading_with_user_asset_price *
                          item.trading_with_user_asset_discount) /
                          100
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

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
              <button className="trade_button" onClick={placeTrade}>
                Trade
              </button>
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
