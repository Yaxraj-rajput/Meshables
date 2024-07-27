import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const Plugins = () => {
  return (
    <div className="page_content">
      <PageTitle title="Plugins" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="plugins" />
      </div>
    </div>
  );
};

export default Plugins;
