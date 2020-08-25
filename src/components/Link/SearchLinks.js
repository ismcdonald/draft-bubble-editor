import React from "react";

import { FirebaseContext } from "../../firebase";

import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [content, setContent] = React.useState([]);
  const [filteredContent, setFilteredContent] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    getInitialLinks();
  }, []);

  function getInitialLinks() {
    firebase.db
      .collection("content0")
      .get()
      .then((snapshot) => {
        setContent(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      });
  }
  function handleSearch(event) {
    event.preventDefault();
    const query = filter.toLowerCase();
    const matched = content.filter((content) => {
      return (
        content.description.toLowerCase().includes(query) ||
        content.content.toLowerCase().includes(query) ||
        content.postedBy.name.includes(query)
      );
    });
    setFilteredContent(matched);
  }
  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={(e) => setFilter(e.target.value)} />
          <button>go</button>
        </div>
      </form>
      {filteredContent.map((fcontent) => (
        <LinkItem key={fcontent.id} showCount={false} content={fcontent} />
      ))}
    </div>
  );
}

export default SearchLinks;
