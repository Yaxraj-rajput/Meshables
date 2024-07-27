import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";

const HDRIs = () => {
  return (
    <div className="page_content">
      <PageTitle title="HDRIs" />
      <div className="listing_section">
        <ListingSidebar />
        <ItemsListing category="hdris" />
      </div>
    </div>
  );
};

export default HDRIs;
