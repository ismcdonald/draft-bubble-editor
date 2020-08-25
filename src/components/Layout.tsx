/**
 */

import React from "react";

import Header from "./Header";
import "../layout.css";

var data = {
  site: {
    siteMetadata: {
      title: "kimandleabook",
    },
  },
};
const Layout = ({ children }: any) => {
  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        {/*  <footer>© {new Date().getFullYear()}</footer> */}
      </div>
    </>
  );
};

export default Layout;
