import * as React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";
import { useCurrentPage, useParams } from "../../model/ps/usePageLoader";
import HomeIcon from '@material-ui/icons/Home';
import Link from 'redux-first-router-link'


function LinkList() {
  
  const { user, firebase } = React.useContext(FirebaseContext);
  const [content, setContent] = React.useState([]);
  const page = useCurrentPage()
  const params = useParams()
  //const isNewPage = props.location.pathname.includes("new");
  const {isNewPage} = params

  var shouldFilter = params.project && params.project != "all"

  React.useEffect(() => {
    getLinks(user);
  }, []);

  function getLinks(user) {
    firebase.db
      .collection("content0")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapshot);
  }

  function renderContent() {
    console.log('x')
    
    if (isNewPage) {
      return content;
    } else {
      return content
        .slice()
        .sort((c1, c2) => c2.votes.length - c1.votes.length);
    }
  }

  function handleSnapshot(snapshot) {
    const content = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    var byProject = {}
    for (var item of content) {
      var project = (item.project || "unknown") 
      var path =  project + (item.path ? `/${item.path}` :"")
    
    
      var items = byProject[path] ||  []
      byProject[path] = items
      items.push(item)
      console.log({item})
    }

    var keys = Object.keys(byProject)
    keys = keys.sort()

    var out = []
    for (var key of keys) {
      if (!shouldFilter || (key == params.project ) | (key.indexOf(params.project + "/") == 0)) {
        out.push({path:key, items:byProject[key]})
      }
    }


    // -- sort by project 
    console.log({out});
    setContent(out);  // <--  put in reducer ... 
    return out;
  }

  //console.log("-- rendering list ");

  return (
    <div>
       <div className="bubble-breadcrumbs-bar">
        <Link to="/">
          <HomeIcon  />
        </Link> 
      </div> 
      <h1>Notes on Readings {shouldFilter ? `for ${params.project}` : ":"} </h1>
      {content.map((item, i) => (
        <div key= {i}>
          <div className="divider">{" "}</div>
          <h2>{item.path} </h2>
          {item.items.map((doc) => (
            <LinkItem key={doc.id} showCount={true} content={doc} index={i + 1} />))}
        </div>
          ))}

            
    
    </div>
  );
}

export default LinkList;

