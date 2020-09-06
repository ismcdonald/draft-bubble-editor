import React from "react";
import Link from "redux-first-router-link";
import { FirebaseContext } from "../firebase";

interface Props {
  to: string;
  style: any;
  children?: any;
}

type NavItem = {
  name: string;
  link: string;
  isBtn?: boolean;
  isName?: boolean;
  clickFn?: any;
};
const navData = (user: User): NavItem[] =>
  [
    { name: "News", link: "" },
    { name: "top", link: "top" },
    { name: "search", link: "search" },
    { name: "create", link: "create" },
    { name: "submit", link: "create" },
  ].filter(({ name }) => user || (name !== "submit" && name !== "create"));

type User = {
  displayName: string;
};

const navData2 = (user: User, firebase: any) => {
  var out = [];
  if (user) {
    out.push({ name: user.displayName, link: "account", isName: true });
    out.push({
      name: "logout",
      link: "logout",
      isBtn: true,
      clickFn: () => firebase.logout(),
    });
  } else {
    out.push({ name: "login", link: "login", isBtn: true });
  }
  return out;
};

const toNav = (pages: NavItem[]) => {
  const out = pages.map(({ name, link, isBtn, isName, clickFn }, i) => (
    <Link
      to={"/" + link}
      key={i}
      className={
        isName ? "header-name" : isBtn ? "header-button" : "header-link"
      }
      onClick={clickFn}
    >
      {name}
    </Link>
  ));
};

/*
  const Link = (props: Props) => {
    return (
      <a href={props.to} style={props.style}>
        {props.children}
      </a>
    );
  };
  */

const Header = ({ siteTitle }: { siteTitle: string; children?: any }) => {
  var user: User, firebase: any;
  ({ user, firebase } = React.useContext(FirebaseContext) as any);
  console.log("rendering header");
  return (
    <header
      style={{
        background: `white`,
        marginBottom: `5px`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          padding: `0px 15px 0px 0px`,
        }}
      >
        <h1 className="klb-header">
          <Link
            to="/"
            style={{
              color: `#abc`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
      </div>
    </header>
  );
};

//            {toNav(navData(user))}

export default Header;
