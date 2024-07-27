import React, { useEffect, useState } from "react";
import ListedItemCard from "./UI/ListedItemCard";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFilters } from "../Context/FilterContext";

const ItemsListing = (props) => {
  const [items, setItems] = useState([]);
  const filters = useFilters().filters;
  // console.log(filters);

  let asset_type = props.category ? props.category : "models";

  useEffect(() => {
    const fetchItems = async () => {
      let itemsQuery;

      if (props.userId) {
        console.log("props.userId", props.userId);
        // Create a query to fetch items for a specific user
        itemsQuery = query(
          collection(db, "Assets"),
          where("userId", "==", props.userId)
        );
      } else {
        // Create a query to fetch all items
        itemsQuery = query(
          collection(db, "Assets"),
          where("type", "==", asset_type)
        );
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

  const filteredItems = items.filter((item) => {
    const afterDiscountPrice = item.price - (item.price * item.discount) / 100;
    let categoryFilterPassed = true;
    let priceFilterPassed = true;
    let discountFilterPassed = true;

    if (filters && filters.categories && filters.categories.length !== 0) {
      categoryFilterPassed = filters.categories.includes(item.category);
    }

    if (filters && filters.price) {
      priceFilterPassed = afterDiscountPrice <= filters.price;
    }
    if (filters && filters.discounts && filters.discounts.length > 0) {
      discountFilterPassed = item.discount >= filters.discounts[0];
    } else {
      discountFilterPassed = true; // No discount filter applied, list all products
    }

    return categoryFilterPassed && priceFilterPassed && discountFilterPassed;
  });
  return (
    <div className="item_listing">
      {filteredItems.map((item) => (
        <ListedItemCard
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.thumbnail}
          discount={item.discount}
          price={(item.price - (item.price * item.discount) / 100).toFixed(2)}
          rating={5}
          rating_count={16}
          publisher={"kamlesh"}
        />
      ))}
    </div>
  );
};

export default ItemsListing;
