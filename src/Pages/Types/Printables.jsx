import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const Printables = () => {
  return (
    <>
      <Helmet>
        <title>Printables | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of printables on Meshables."
        />

        <meta property="og:title" content="Printables | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of printables on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Printables | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of printables on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="page_content">
        <PageTitle title="Printables" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="printables" />
        </div>
      </div>
    </>
  );
};

export default Printables;
