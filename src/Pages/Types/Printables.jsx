import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Printables = () => {
  return (
    <div className="page_content">
      <PageTitle title="Printables" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="printables" />
      </div>
    </div>
  );
};

export default Printables;
