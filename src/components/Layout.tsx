/**
 */

import React from "react";
//import Header from "./Header";
import "../layout.css";
import Link from "redux-first-router-link"
import { withStyles } from "@material-ui/core";

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



const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: { 
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

const Layout = withStyles(styles)( ({ classes, children, user }) => {
  
    return (
    <>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1920,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >

        <main>{children}</main>
        <footer>  </footer>
      </div>
    </>
  );
})

export default Layout;
