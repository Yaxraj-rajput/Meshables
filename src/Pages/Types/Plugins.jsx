import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Plugins = () => {
  return (
    <>
      <Helmet>
        <title>Plugins | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of plugins on Meshables."
        />

        <meta property="og:title" content="Plugins | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of plugins on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Plugins | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of plugins on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Plugins" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="plugins" />
        </div>
      </div>
    </>
  );
};

export default Plugins;
