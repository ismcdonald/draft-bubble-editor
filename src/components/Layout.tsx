/**
 */

import React from "react";
//import Header from "./Header";
import "../layout.css";
import Link from "redux-first-router-link"

var data = {
  site: {
    siteMetadata: {
      title: "KimandLeabook",
    },
  },
};

//    < Header siteTitle = { data.site.siteMetadata.title } />
//         {user  && (x == 2) ? `welcome ${user.displayName}`
// :   <Link to={"login"}>login</Link> }



const Layout = ({ children, user }: any) => {
  return (
    <>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >

        <main>{children}</main>
        <footer>  </footer>
      </div>
    </>
  );
};

export default Layout;
