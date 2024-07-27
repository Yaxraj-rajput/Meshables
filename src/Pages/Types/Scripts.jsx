import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Scripts = () => {
  return (
    <div className="page_content">
      <PageTitle title="Scripts" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="scripts" />
      </div>
    </div>
  );
};

export default Scripts;
