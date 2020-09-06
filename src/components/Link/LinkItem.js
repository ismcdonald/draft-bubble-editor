import * as React from "react";
//import { Link, withRouter } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FirebaseContext } from "../../firebase";
import Link from "redux-first-router-link"
import { useDispatch } from "react-redux";
import { NavToLogin } from "../../model/pageReducer";



function LinkItem({ content, index, showCount }) {
  // TODO - pass these in as params ?

  const { firebase, user } = React.useContext(FirebaseContext);
  const dispatch = useDispatch()  

  function handleLike() {
    if (!user) {
      dispatch(NavToLogin)
    } else {
      const voteRef = firebase.db.collection("content0").doc(content.id);
      voteRef.get().then((doc) => {
        if (doc.exists) {
          const prevVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid }, name: user.displayName };
          const updatedVotes = [...prevVotes, vote];
          voteRef.update({ votes: updatedVotes });
        }
      });
    }
  }

  function handleDeleteLink() {
    const contentRef = firebase.db.collection("content0").doc(content.id);
    contentRef
      .delete()
      .then(() => {
        console.log("document deleted");
      })
      .catch((e) => {
        console.log("error deleting document ", { e });
      });
  }

  const postedByUser = user && user.uid === content.postedBy.id;

  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray">{index}</span>}
        <div className="like-button" onClick={handleLike}>
          like
        </div>
        <div className="ml1">
          <div>
            {content.description}{" "}
            <span className="link">({content.content})</span>
          </div>
          <div className="f6 lh-copy gray">
            {content.votes.length} likes. Posted by {content.postedBy.name}{" "}
            {formatDistanceToNow(content.created)}
            {" | "} 
            <Link to={`/link/${content.id}`}>
              {content.comments.length > 0
                ? `${content.comments.length} comment${
                    content.comments.length === 1 ? "" : "s"
                  }`
                : "discuss"}
            </Link>
            {postedByUser && (
              <>
                {" | "}
                <a className="delete-button" onClick={handleDeleteLink}>
                  delete
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default LinkItem