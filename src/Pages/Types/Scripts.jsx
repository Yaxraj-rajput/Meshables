import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Scripts = () => {
  return (
    <>
      <Helmet>
        <title>Scripts | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of scripts on Meshables."
        />

        <meta property="og:title" content="Scripts | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of scripts on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Scripts | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of scripts on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Scripts" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="scripts" />
        </div>
      </div>
    </>
  );
};

export default Scripts;
