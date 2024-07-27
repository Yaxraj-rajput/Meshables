import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Models = () => {
  return (
    <div className="page_content">
      <PageTitle title="Models" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="models" />
      </div>
    </div>
  );
};

export default Models;
