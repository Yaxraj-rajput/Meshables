import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Textures = () => {
  return (
    <div className="page_content">
      <PageTitle title="Textures" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="textures" />
      </div>
    </div>
  );
};

export default Textures;
