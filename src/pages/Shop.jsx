import React from "react";
import Hero from "../components/Hero/hero";
import Popular from "../components/Popular/popular";
import Offers from "../components/Offers/offers";
import NewCollections from "../components/NewCollections/newCollections";
import NewsLetter from "../components/NewsLetter/newsLetter";
import { HelmetProvider } from "react-helmet-async";
import ChatWidget from "../components/ChatWidget/chatWidget";
import { getStorageData } from "../helpers/stored";
const Shop = () => {
  const userId = getStorageData("user")?.id || null;
  console.log("userId", userId);

  return (
    <>
      <HelmetProvider>
        <title>JYStore</title>
      </HelmetProvider>
      <>
        <Hero />
        <Popular />
        <Offers />
        <NewCollections />
        <NewsLetter />
        {userId && <ChatWidget userId={userId} />}
      </>
    </>
  );
};

export default Shop;
