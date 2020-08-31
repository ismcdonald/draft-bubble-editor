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
import { PageState } from "./model/resource/PageResource"
import Link from "redux-first-router-link"
import firebase, { FirebaseContext } from "./firebase";



interface AppProps {
  page:any
}



const App = () => {

  const user = useAuth();
  console.log({ user });
  var o = { user, firebase };
  let page:PageState<any,any> = useCurrentPage();

  return (

    <FirebaseContext.Provider value={o}>
      <div className="app-container">
        <Layout>
          <div className="route-container">
            {renderPage(page)}
          </div>
        </Layout>
      </div>
    </FirebaseContext.Provider>
  
  )
}



  const renderPage = (page:PageState<any,any>) => {
    
    

    switch (page.resource.type) {
      case "home":
        return <div>
          <h1>home</h1>
          <Link to={"project/lea/essay"}>essay</Link>
        </div>
      case "project": 
        return <Project />
      case "ref":
        return <Notes/>
    }
  

  
  return  <h1> No component found </h1>
} 



export default App


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
