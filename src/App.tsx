import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import CreateLink from "./components/Link/CreateLink";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Login from "./components/Auth/Login";
import LinkList from "./components/Link/LinkList";
//import LinkItem from "./Link/LinkItem"
import LinkDetail from "./components/Link/LinkDetail";
import SearchLinks from "./components/Link/SearchLinks";
import useAuth from "./components/Auth/useAuth";
import firebase, { FirebaseContext } from "./firebase";
import Project from "./components/Project/Project";
import Layout from "./components/Layout";
import Notes from "./components/Project/Notes/Notes";

const reload = () => window.location.reload();

function App() {
  const user = useAuth();
  console.log({ user });
  var o = { user, firebase };

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={o}>
        <div className="app-container">
          <Layout>
            <div className="route-container">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/project/lea/essay" />}
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
            </div>
          </Layout>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
