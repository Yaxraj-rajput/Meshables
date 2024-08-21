import React from "react";
import PageTitle from "../../Components/UI/PageTitle";
import ListingSidebar from "../../Components/ListingSidebar";
import ItemsListing from "../../Components/ItemsListing";
import { Helmet } from "react-helmet";

const HDRIs = () => {
  return (
    <>
      <Helmet>
        <title>HDRIs | Meshables</title>
        <meta
          name="description"
          content="Browse through a wide range of HDRIs on Meshables."
        />

        <meta property="og:title" content="HDRIs | Meshables" />
        <meta
          property="og:description"
          content="Browse through a wide range of HDRIs on Meshables."
        />

        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="HDRIs | Meshables" />
        <meta
          name="twitter:description"
          content="Browse through a wide range of HDRIs on Meshables."
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="page_content">
        <PageTitle title="HDRIs" />
        <div className="listing_section">
          <ListingSidebar />
          <ItemsListing category="hdris" />
        </div>
      </div>
    </>
  );
};

export default HDRIs;
