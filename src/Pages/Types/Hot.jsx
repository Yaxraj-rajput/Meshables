import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import CategoryGrid from "../../Components/CategoryGrid";
import ItemsListing from "../../Components/ItemsListing";

const Hot = () => {
  return (
    <div className="page_content">
      <PageTitle title="Hot" />
      <CategoryGrid />
      <div className="listing_section">
        {/* <ListingSidebar /> */}
        <ItemsListing />
      </div>
    </div>
  );
};

export default Hot;
