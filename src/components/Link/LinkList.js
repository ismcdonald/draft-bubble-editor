import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";

function LinkList(props) {
  const { user, firebase } = React.useContext(FirebaseContext);
  const [content, setContent] = React.useState([]);
  const isNewPage = props.location.pathname.includes("new");

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
    console.log(content);
    setContent(content);
    return content;
  }

  console.log("x");

  return (
    <div>
      {renderContent().map((doc, i) => (
        <LinkItem key={doc.id} showCount={true} content={doc} index={i + 1} />
      ))}
    </div>
  );
}

export default LinkList;
