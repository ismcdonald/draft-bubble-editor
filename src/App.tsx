import * as React from "react";
//import { BrowserRouter, Switch, Route, Redirect, Lin} from "react-router-dom";
import CreateLink from "./components/Link/CreateLink";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Login from "./components/Auth/Login";
import LinkList from "./components/Link/LinkList";
//import LinkItem from "./Link/LinkItem"
import LinkDetail from "./components/Link/LinkDetail";
import SearchLinks from "./components/Link/SearchLinks";
import useAuth from "./components/Auth/useAuth";
import Project from "./components/Project/Project";
import Layout from "./components/Layout";
import Notes from "./components/Project/Notes/Notes";
import { useCurrentPage, usePage } from "./model/ps/usePageLoader";
import { PageState } from "./model/resource/PageResource";
import Link from "redux-first-router-link";
import firebase, { FirebaseContext } from "./firebase";
import Register from "./components/Auth/Register";
import DocEditor from "./components/Doc/DocEditor";
import DocApp from "./components/Doc/DocApp";

interface AppProps {
  page: any;
}

const App = () => {
  let page: PageState<any, any> = usePage(useCurrentPage())
  const user = useAuth();
  console.log({ user });
  var o = { user, firebase };
  console.log({o})

  return (
    <FirebaseContext.Provider value={o}>
      <div className="app-container">
        <Layout user={user}>
          <div className="route-container">{renderPage(page)}</div>
        </Layout>
      </div>
    </FirebaseContext.Provider>
  );
};

//           <Link to={"create"}>create </Link>
// <Link to={"doc"}>doc </Link>
// <div>
//  <Link to={"login"}>login</Link>
// {" "}<Link to={"register"}>register</Link>
// </div>

const renderPage = (page: PageState<any, any>) => {
  let {type, rurl} = page.resource
  switch (type) {
    case "home":
      console.log("rendering home)");
      return (
        <div>
          <h1>Lea's Projects:</h1>
          <Link to={"testdoc/text?v=X"}>text </Link>{" "}
          <Link to={"testdoc/quote?v=y"}>quote </Link>{" "}
          <Link to={"testdoc/quote2"} >quote2 </Link>{" "}
          <Link to={"register"}>register </Link>{" "}
          <Link to={"project/lea/essay"}>essay</Link>{" "}

        </div>
      );

    case "project":
      return <Project rurl={rurl} />;
    case "ref":
      return <Notes rurl={rurl} />;
    case "login":
      return <Login />;
    case "register":
        return  <Register/>
    case "forgot":
      return <ForgotPassword />;
    case "create":
      return <CreateLink />

    case "doc":
    case "testdoc":
      return <DocEditor/>
    case "link": 
      return <LinkDetail/>;
    case "404":
        return <div>Link not found </div>


    default:
      return <h1> No component found </h1>;
  }
};

export default App;

//export default App;

/*

                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/project/lea/thesis" />}
                  />

                  <Route path="/create" component={CreateLink} />
                  <Route path="/project/:owner/:pname/:ref" component={Notes} />

                  <Route path="/project/:owner/:pname" component={Project} />

                  <Route path="/login" component={Login} />
                  <Route path="/forgot" component={ForgotPassword} />
                  <Route path="/search" component={SearchLinks} />
                 
                  <Route path="/top" component={LinkList} />
                  <Route path="/new/:page" component={LinkList} />
                  <Route path="/link/:linkId" component={LinkDetail} />
                </Switch>
                */
