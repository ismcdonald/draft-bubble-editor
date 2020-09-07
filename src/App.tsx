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
import { useCurrentPage } from "./model/ps/usePageLoader";
import { PageState } from "./model/resource/PageResource";
import Link from "redux-first-router-link";
import firebase, { FirebaseContext } from "./firebase";
import Register from "./components/Auth/Register";
import DocEditor from "./components/Doc/DocEditor";

interface AppProps {
  page: any;
}

const App = () => {
  let page: PageState<any, any> = useCurrentPage();
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
  switch (page.resource.type) {
    case "home":
      console.log("rendering home)");
      return (
        <div>
          <h1>Lea's Projects:</h1>
          <Link to={"testdoc/text"}>doc/text </Link>{" "}
          <Link to={"testdoc/quote"}>doc/quote </Link>{" "}

          <Link to={"register"}>register </Link>{" "}
          <Link to={"project/lea/essay"}>essay</Link>{" "}

        </div>
      );

    case "project":
      return <Project />;
    case "ref":
      return <Notes />;
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
      return <DocEditor />
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
