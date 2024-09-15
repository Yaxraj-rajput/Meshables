import React, { useEffect, useState } from "react";
import ItemInfoTable from "../Components/ItemInfoTable";
import Keywords from "../Components/Keywords";
import sky from "../assets/Models/illovo_beach_balcony_4k.hdr";
import Breadcrumbs from "../Components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import ModelViewer from "../Components/ModelViewer";
import UserCard from "../Components/UI/UserCard";
import ToastAlert from "../Components/UI/ToastAlert";
import TradeButton from "../Components/UI/TradeButton";
import Trade from "./Trade";
import { useNavigate } from "react-router-dom";
import ViewItemImages from "../Components/ViewItemImages";
import { Helmet } from "react-helmet";
import { useUser } from "../Context/UserProvider";

import "@google/model-viewer";
import ScriptViewer from "../Components/ScriptViewer";

const View = () => {
  const { currentUser, userProfile } = useUser();
  const docId = useParams().id;
  const [is3d, setIs3d] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastState, setToastState] = useState("");
  const [item, setItem] = useState({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [isItemOwned, setIsItemOwned] = useState(false);
  const [group, setGroup] = useState(null); // Define group state

  useEffect(() => {
    const fetchItem = async () => {
      const itemDocRef = doc(db, "Assets", docId);
      const itemDocSnap = await getDoc(itemDocRef);

      if (itemDocSnap.exists()) {
        setItem({ id: itemDocSnap.id, ...itemDocSnap.data() });
        setIs3d(itemDocSnap.data().is3d);
      } else {
        console.log("No such document!");
      }
    };

    fetchItem();
  }, [docId]);

  useEffect(() => {
    if (userProfile && userProfile.purchasedItems) {
      setIsItemOwned(userProfile.purchasedItems.includes(item.id));
    }
  }, [userProfile, item]);
  useEffect(() => {
    const fetchGroup = async () => {
      // Fetch group data from Firestore where the current user is a member
      const groupQuery = query(collection(db, "Groups"));
      const groupSnapshot = await getDocs(groupQuery);

      // Filter groups where the current user is a member
      const groupData = groupSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((group) =>
          group.users.some((user) => user.email === currentUser.email)
        );

      if (groupData.length > 0) {
        setGroup(groupData[0]);
      } else {
        console.log("No group found for the current user.");
      }
    };

    if (currentUser) {
      fetchGroup();
    }

    return () => {
      setGroup(null);
    };
  }, [currentUser]);

  // console log the group data

  const handleViewTrades = () => {
    navigate("/Trade", { state: { item } });
  };

  // useEffect(() => {
  //   // fetch items whihc is also owned by one of the group members

  return (
    <>
      <Helmet>
        <title>{`${item.title} | Meshables`} </title>

        <meta name="description" content={item.description} />

        <meta property="og:title" content={`${item.title} | Meshables`} />
        <meta property="og:description" content={item.description} />
        <meta property="og:image" content={item.thumbnail} />

        <meta property="twitter:title" content={`${item.title} | Meshables`} />
        <meta property="twitter:description" content={item.description} />
        <meta property="twitter:image" content={item.thumbnail} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />

        <meta property="twitter:site" content="@meshables" />
        <meta property="twitter:creator" content="@meshables" />

        <meta property="og:site_name" content="Meshables" />
        <meta property="og:locale" content="en_US" />
      </Helmet>
      <div className="page_content">
        {item.id ? (
          <div className="view_item_main">
            {showToast ? (
              <ToastAlert message={toastMessage} state={toastState} />
            ) : null}

            <Breadcrumbs
              links={[
                { title: "Home", path: "/" },
                { title: item.type, path: `/${item.type}` },
                { title: item.title, path: `/View/${item.id}` },
              ]}
            />
            <div className="content">
              <div className="left">
                {item.type === "textures" || item.type === "shaders" ? (
                  <>
                    <ViewItemImages
                      mainImage={item.thumbnail}
                      images={item.maps}
                    />
                  </>
                ) : item.type === "models" || item.type === "printables" ? (
                  <ModelViewer
                    model={item.model}
                    alt={item.title}
                    ar={item.vrArLowPoly}
                    sky={sky}
                    onLoad={() => console.log("Model loaded successfully")}
                    onError={(e) => console.error("Error loading model:", e)}
                  />
                ) : item.type === "scripts" ? (
                  <ScriptViewer
                    script={item.script}
                    scriptName={item.scriptName}
                    id={item.id}
                    price={item.price - (item.price * item.discount) / 100}
                  />
                ) : (
                  <img src={item.thumbnail} alt={item.title} />
                )}

                <div className="asset_details">
                  <h2 className="title">Details</h2>

                  <div className="details">
                    <div className="detail">
                      <div className="title">
                        <i className="icon fas fa-cube"></i> Physical Size
                      </div>
                      <div className="item">
                        <span className="label">Height</span>
                        <span className="value">1.2m</span>
                      </div>
                      <div className="item">
                        <span className="label">Width</span>
                        <span className="value">1.5m</span>
                      </div>
                      <div className="item">
                        <span className="label">Depth</span>
                        <span className="value">1m</span>
                      </div>
                    </div>
                  </div>

                  <div className="details">
                    <div className="detail">
                      <div className="title">
                        <i className="icon fa-solid fa-layer-group"></i> LODs
                      </div>
                      <div className="item">
                        <span className="label">SOURCE</span>
                        <span className="value">116,066 Polygons</span>
                      </div>
                      <div className="item">
                        <span className="label">LOD 0</span>
                        <span className="value">116,066 Polygons</span>
                      </div>
                      <div className="item">
                        <span className="label">LOD 1</span>
                        <span className="value">57,580 Polygons</span>
                      </div>

                      <div className="item">
                        <span className="label">LOD 2</span>
                        <span className="value">30,778 Polygons</span>
                      </div>

                      <div className="item">
                        <span className="label">LOD 3</span>
                        <span className="value">15,389 Polygons</span>
                      </div>

                      <div className="item">
                        <span className="label">LOD 4</span>
                        <span className="value">7,695 Polygons</span>
                      </div>
                    </div>
                  </div>

                  <div className="details">
                    <div className="detail">
                      <div className="title">
                        <i className="icon fa-solid fa-image"></i> Texture Files
                        & Formats
                      </div>
                      <div className="item">
                        <span className="label">Ambient Occlusion</span>
                        <span className="value">PNG</span>
                      </div>
                      <div className="item">
                        <span className="label">Normal</span>
                        <span className="value">PNG</span>
                      </div>
                      <div className="item">
                        <span className="label">Roughness</span>
                        <span className="value">PNG</span>
                      </div>
                      <div className="item">
                        <span className="label">Metallic</span>
                        <span className="value">PNG</span>
                      </div>
                      <div className="item">
                        <span className="label">Diffuse</span>
                        <span className="value">PNG</span>
                      </div>
                    </div>
                  </div>

                  <div className="description">
                    <h2 className="title">Description</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="top_info">
                  <div className="title">
                    <h2>{item.title}</h2>

                    <div className="deatils">
                      <UserCard
                        userId={item.userId}
                        profilePic={item.profilePic}
                        username={item.username}
                      />
                      <div className="rating">
                        <span className="icons">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <span
                                key={i}
                                className="icon fa fa-star checked"
                              ></span>
                            ))}
                        </span>

                        <span className="rating_count">(15)</span>
                      </div>
                    </div>
                  </div>

                  <div className="price">
                    {isItemOwned ? (
                      <span className="ownership_badge">Purchased</span>
                    ) : (
                      ""
                    )}
                    <span className="price_value">
                      {item.price - (item.price * item.discount) / 100 == 0
                        ? "Free"
                        : `$${(
                            item.price -
                            (item.price * item.discount) / 100
                          ).toFixed(2)}`}
                    </span>
                    <span className="before_price">
                      {item.discount && `$${item.price}`}
                    </span>

                    {item.discount && (
                      <span className="discount">-{item.discount}%</span>
                    )}
                  </div>

                  <div className="action_buttons">
                    <button
                      className="add_to_cart_btn"
                      onClick={() => {
                        if (
                          item.price - (item.price * item.discount) / 100 ==
                          0
                        ) {
                          window.open(item.model, "_blank");

                          return;
                        } else if (
                          userProfile &&
                          userProfile.purchasedItems &&
                          userProfile.purchasedItems.includes(item.id)
                        ) {
                          item.type === "models" &&
                            window.open(item.model, "_blank");

                          item.type === "printables" &&
                            window.open(item.model, "_blank");

                          if (item.type === "scripts") {
                            // Function to download the script
                            const downloadFile = (url) => {
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = url.split("/").pop(); // Use the file name from the URL
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            };

                            // Check if the file is a Python, C#, or C++ file
                            const fileExtension = "py";
                            const validExtensions = ["py", "cs", "cpp"];

                            if (validExtensions.includes(fileExtension)) {
                              downloadFile(item.script);
                            } else {
                              // Force download for other file types
                              fetch(item.script)
                                .then((response) => response.blob())
                                .then((blob) => {
                                  const url = window.URL.createObjectURL(blob);
                                  downloadFile(url);
                                  window.URL.revokeObjectURL(url);
                                })
                                .catch((error) =>
                                  console.error("Download error:", error)
                                );
                            }
                          }

                          return;
                        }

                        let cart = localStorage.getItem("cart")
                          ? JSON.parse(localStorage.getItem("cart"))
                          : [];

                        if (cart.find((cartItem) => cartItem.id === item.id)) {
                          setToastMessage("Item already in cart");
                          setToastState("warning");
                          setShowToast(true);
                          setTimeout(() => {
                            setShowToast(false);
                          }, 4000);
                          return;
                        }

                        cart.push(item);

                        localStorage.setItem("cart", JSON.stringify(cart));

                        setToastMessage("Item added to cart");
                        setToastState("success");
                        setShowToast(true);

                        setTimeout(() => {
                          setShowToast(false);
                        }, 4000);
                      }}
                    >
                      {item.price - (item.price * item.discount) / 100 == 0 ? (
                        <>
                          <i className="icon fas fa-download"></i>
                          Download
                        </>
                      ) : isItemOwned ? (
                        <>
                          <i className="icon fas fa-download"></i>
                          Download
                        </>
                      ) : (
                        <>
                          <i className="icon fas fa-shopping-cart"></i>
                          Add to cart
                        </>
                      )}
                    </button>

                    {item.price - (item.price * item.discount) / 100 ==
                    0 ? null : (
                      <button
                        className="add_to_wishlist_btn"
                        onClick={() => handleViewTrades(item)}
                      >
                        <i className="icon fas fa-exchange-alt"></i>
                      </button>
                    )}

                    <button className="add_to_wishlist_btn">
                      <i className="icon fas fa-heart"></i>
                    </button>
                  </div>
                </div>
                <ItemInfoTable
                  // if type is model show following
                  details={
                    item.type === "models"
                      ? [
                          { label: "Resolution", value: item.resolution },
                          { label: "LODs", value: item.lods },
                          { label: "Physical Size", value: item.physicalSize },
                          { label: "Vertices", value: item.vertices },
                          { label: "Textures", value: item.textures },
                          { label: "Materials", value: item.materials },
                          { label: "Rigged", value: item.rigged },
                          { label: "Animated", value: item.animated },
                          {
                            label: "VR / AR / Low-poly",
                            value: item.vrArLowPoly,
                          },
                        ]
                      : item.type === "printables"
                      ? [
                          { label: "Material", value: item.material },
                          { label: "Resolution", value: item.resolution },
                          { label: "Physical Size", value: item.physicalSize },
                          { label: "vertices", value: item.vertices },
                          { label: "Volume", value: item.volume },
                          { label: "Surface Area", value: item.surfaceArea },
                          {
                            label: "Supports Required",
                            value: item.supportsRequired,
                          },
                          {
                            label: "Print Time Estimate",
                            value: item.printTimeEstimate,
                          },
                          { label: "Nozzle Size", value: item.nozzleSize },
                          { label: "Manifold", value: item.manifold },
                          { label: "Layer Height", value: item.layerHeight },
                          {
                            label: "Infill Percentage",
                            value: item.infillPercentage,
                          },
                        ]
                      : item.type === "scripts"
                      ? [
                          {
                            label: "Language",
                            value:
                              item.scriptName.split(".")[1] === "py"
                                ? "Python"
                                : item.scriptName.split(".")[1] === "cs"
                                ? "C#"
                                : item.scriptName.split(".")[1] === "cpp"
                                ? "C++"
                                : "Unknown",
                          },
                          { label: "Script name", value: item.scriptName },
                          {
                            label: "Script Size",
                            value: (item.scriptSize / 1024).toFixed(2) + " KB",
                          },
                        ]
                      : []
                  }
                />
                <Keywords keywords={item.tags} />
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </>
  );
};

export default View;
