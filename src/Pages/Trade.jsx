import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserProvider";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import PageTitle from "../Components/UI/PageTitle";
import exchange_icon from "../assets/Icons/exchange.png";
import plus_icon from "../assets/Icons/plus.png";

const TradePage = () => {
  const { currentUser } = useUser();
  const [items, setItems] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const location = useLocation();
  const { item } = location.state || {};
  const [tradeItemSelectedId, setTradeItemSelectedId] = useState(null);
  const [isTradeRequestsOpen, setIsTradeRequestsOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (!currentUser) return;

      const itemsQuery = query(
        collection(db, "Assets"),
        where("userId", "==", currentUser.uid)
      );

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
      if (!currentUser) return;

      const itemsQuery = query(
        collection(db, "Trades"),
        where("tradingWithUserId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(itemsQuery);
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const assetDetailsPromises = itemsData.map(async (item) => {
        const ownAssetDoc = await getDoc(doc(db, "Assets", item.ownAssetId));
        const tradingWithUserAssetDoc = await getDoc(
          doc(db, "Assets", item.tradingWithUserAssetId)
        );

        return {
          ...item,
          ownAssetDetails: ownAssetDoc.exists() ? ownAssetDoc.data() : null,
          tradingWithUserAssetDetails: tradingWithUserAssetDoc.exists()
            ? tradingWithUserAssetDoc.data()
            : null,
        };
      });

      const itemsWithAssetDetails = await Promise.all(assetDetailsPromises);
      setTradeItems(itemsWithAssetDetails);
    };

    fetchTradeItems();
  }, [currentUser]);

  const placeTrade = async () => {
    if (!item || !item.userId || !item.id) {
      console.error("Invalid item data");
      return;
    }

    const tradingWithUserId = item.userId;
    const tradingWithUserAssetId = item.id;

    const ourAsset = items.find((item) => item.id === tradeItemSelectedId);

    if (!ourAsset) {
      console.error("Selected trade item not found");
      return;
    }

    const tradeData = {
      tradingWithUserId,
      tradingWithUserAssetId,
      ownUserId: currentUser.uid,
      ownAssetId: ourAsset.id,
    };

    console.log(tradeData);

    const tradeRef = doc(
      db,
      "Trades",
      `${currentUser.uid}_${tradingWithUserId}_${tradingWithUserAssetId}_${ourAsset.id}`
    );

    try {
      await setDoc(tradeRef, tradeData);
      console.log("Trade successfully placed");
      alert("Trade successfully placed");
    } catch (error) {
      console.error("Error placing trade: ", error);
    }
  };

  const acceptTrade = async (tradeId) => {
    const tradeRef = doc(db, "Trades", tradeId);

    try {
      const batch = writeBatch(db);

      batch.update(tradeRef, { status: "accepted" });

      const trade = await getDoc(tradeRef);
      const tradeData = trade.data();

      const userRef = doc(db, "Profiles", tradeData.tradingWithUserId);
      const myUserRef = doc(db, "Profiles", tradeData.ownUserId);

      batch.update(userRef, {
        purchasedItems: arrayUnion(tradeData.ownAssetId),
      });

      batch.update(myUserRef, {
        purchasedItems: arrayUnion(tradeData.tradingWithUserAssetId),
      });

      await batch.commit();

      setTradeItems((prevTradeItems) =>
        prevTradeItems.map((item) =>
          item.id === tradeId ? { ...item, status: "accepted" } : item
        )
      );

      console.log("Trade accepted successfully");
    } catch (error) {
      console.error("Error accepting trade: ", error);
    }
  };

  const rejectTrade = async (tradeId) => {
    const tradeRef = doc(db, "Trades", tradeId);

    try {
      await deleteDoc(tradeRef);
      console.log("Trade rejected successfully");
      setTradeItems((prevTradeItems) =>
        prevTradeItems.filter((item) => item.id !== tradeId)
      );
    } catch (error) {
      console.error("Error rejecting trade: ", error);
    }
  };

  return (
    <div className="page_content">
      <div className="trade_main">
        <div className="title">
          <PageTitle title="Trade" />
          <button
            className="toggle_requests"
            onClick={() => setIsTradeRequestsOpen((prev) => !prev)}
          >
            <i className="icon fa-solid fa-exchange"></i> Trade Requests
          </button>
        </div>
        {isTradeRequestsOpen && (
          <div className="my_trades">
            <div className="title">
              <h2>Trade requests</h2>
            </div>

            <div className="items">
              {tradeItems.map((item) => (
                <div
                  key={item.id}
                  className={`trade_item_card ${
                    item.status === "accepted" && "accepted"
                  }`}
                >
                  <div className="left">
                    <div className="card_image">
                      <img
                        src={item.ownAssetDetails?.thumbnail}
                        alt={item.ownAssetDetails?.title}
                      />
                    </div>
                    <div className="card_details">
                      <h3 className="card_title">
                        {item.ownAssetDetails?.title}
                      </h3>
                      <span className="type">{item.ownAssetDetails?.type}</span>
                      <span className="price">
                        $
                        {(
                          item.ownAssetDetails?.price -
                          (item.ownAssetDetails?.price *
                            item.ownAssetDetails?.discount) /
                            100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="trade_icon">
                    <img src={exchange_icon} alt="Trade" />
                  </div>

                  <div className="right">
                    <div className="card_image">
                      <img
                        src={item.tradingWithUserAssetDetails?.thumbnail}
                        alt={item.tradingWithUserAssetDetails?.title}
                      />
                    </div>
                    <div className="card_details">
                      <h3 className="card_title">
                        {item.tradingWithUserAssetDetails?.title}
                      </h3>
                      <span className="type">
                        {item.tradingWithUserAssetDetails?.type}
                      </span>
                      <span className="price">
                        $
                        {(
                          item.tradingWithUserAssetDetails?.price -
                          (item.tradingWithUserAssetDetails?.price *
                            item.tradingWithUserAssetDetails?.discount) /
                            100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {item.status !== "accepted" && (
                    <div className="buttons">
                      <button
                        className="button reject_trade"
                        onClick={() => rejectTrade(item.id)}
                      >
                        <i className="icon fa-solid fa-times"></i>
                      </button>

                      <button
                        className="button accept_trade"
                        onClick={() => acceptTrade(item.id)}
                      >
                        <i className="icon fa-solid fa-check"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
                    {(item.price - (item.price * item.discount) / 100).toFixed(
                      2
                    )}
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
  );
};

export default TradePage;
