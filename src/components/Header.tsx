import React from "react";

interface Props {
  to: string;
  style: any;
  children?: any;
}
const Link = (props: Props) => {
  return (
    <a href={props.to} style={props.style}>
      {props.children}
    </a>
  );
};

const Header = ({ siteTitle }: { siteTitle: string; children?: any }) => (
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
      <h1 className="klb-header" >
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

export default Header;
