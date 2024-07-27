import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Shaders = () => {
  return (
    <div className="page_content">
      <PageTitle title="Shaders" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="shaders" />
      </div>
    </div>
  );
};

export default Shaders;
