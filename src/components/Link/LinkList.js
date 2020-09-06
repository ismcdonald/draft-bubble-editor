import * as React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";
import { useCurrentPage } from "../../model/ps/usePageLoader";

function LinkList() {
  
  const { user, firebase } = React.useContext(FirebaseContext);
  const [content, setContent] = React.useState([]);
  const page = useCurrentPage()

  //const isNewPage = props.location.pathname.includes("new");
  const isNewPage = page.resource.params.isCreate


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
    console.log({content});
    setContent(content);  // <--  put in reducer ... 
    return content;
  }

  console.log("-- rendering list ");

  return (
    <div>
      {renderContent().map((doc, i) => (
        <LinkItem key={doc.id} showCount={true} content={doc} index={i + 1} />
      ))}
    </div>
  );
}

export default LinkList;
