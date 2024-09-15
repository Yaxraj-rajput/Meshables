import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import CategoryGrid from "../../Components/CategoryGrid";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Hot = () => {
  return (
    <>
      <Helmet>
        <title>Hot | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of hot items on Meshables."
        />

        <meta property="og:title" content="Hot | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of hot items on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Hot | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of hot items on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Hot" />
        {/* <CategoryGrid /> */}
        <div className="listing_section">
          {/* <ListingSidebar /> */}
          <ItemsListing />
        </div>
      </div>
    </>
  );
};

export default Hot;
