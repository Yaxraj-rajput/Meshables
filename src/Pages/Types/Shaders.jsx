import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Shaders = () => {
  return (
    <>
      <Helmet>
        <title>Shaders | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of shaders on Meshables."
        />

        <meta property="og:title" content="Shaders | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of shaders on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Shaders | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of shaders on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Shaders" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="shaders" />
        </div>
      </div>
    </>
  );
};

export default Shaders;
