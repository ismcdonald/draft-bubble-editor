import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FirebaseContext } from "../../firebase";

function LinkItem({ content, index, showCount, history }) {
  const { firebase, user } = React.useContext(FirebaseContext);

  function handleVote() {
    if (!user) {
      history.push("/login");
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
        <div className="vote-button" onClick={handleVote}>
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
                <span className="delete-button" onClick={handleDeleteLink}>
                  delete
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
