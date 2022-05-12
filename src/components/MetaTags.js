import React from "react";
import Helmet from "react-helmet";
import Thumbnail from "../images/Thumbnail.png";

export default function MetaTags() {
  return (
    <Helmet>
      <title>Weather</title>
      <meta name="description" content="Minimalist Weather APP" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://freakge.github.io/weather" />
      <meta property="og:image" content={Thumbnail} />
      <meta
        name="keywords"
        content="Weather, Weather APP, Minimalist Weather APP"
      />
    </Helmet>
  );
}
