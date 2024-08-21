import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Textures = () => {
  return (
    <>
      <Helmet>
        <title>Textures | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of textures on Meshables."
        />

        <meta property="og:title" content="Textures | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of textures on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Textures | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of textures on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Textures" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="textures" />
        </div>
      </div>
    </>
  );
};

export default Textures;
