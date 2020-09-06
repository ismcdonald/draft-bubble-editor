import React from "react";
import { FirebaseContext } from "../../firebase";
import { formatDistanceToNow } from "date-fns";
import LinkItem from "./LinkItem";
import { NavToLogin } from "../../model/pageReducer";
import { useDispatch } from "react-redux";
import { useParams , useCurrentPage} from "../../model/ps/usePageLoader";

function LinkDetail() {
  const dispatch = useDispatch()
  const { firebase, user } = React.useContext(FirebaseContext);
  const page = useCurrentPage();
  const params = useParams();

  const contentId = params.linkId;
  const [content, setContent] = React.useState(null);  // <-- TODO - cache on page in dispatcher
  const [commentText, setCommentText] = React.useState([]);

  React.useEffect(() => {
    getLink();
  }, []);

  function getLink() {
    var contentRef = firebase.db.collection("content0").doc(contentId);
    contentRef.get().then((doc) => setContent({ ...doc.data(), id: doc.id }));
  }

  function handleCommentText(value) {
    setCommentText(value);
  }

  function handleAddComment() {
    if (!user) {
      dispatch(NavToLogin)
    } else {
      var contentRef = firebase.db.collection("content0").doc(contentId);
      contentRef.get().then((doc) => {
        const previousComments = doc.data().comments;
        const comment = {
          postedBy: { id: user.uid, name: user.displayName },
          created: Date.now(),
          text: commentText,
        };
        const updatedCommnents = [...previousComments, comment];

        contentRef.update({ comments: updatedCommnents });
        setContent((prevState) => ({
          ...prevState,
          comments: updatedCommnents,
        }));
        setCommentText("");
      });
    }
  }

  return !content ? (
    <div>loading... </div>
  ) : (
    <div>
      <LinkItem showCount={false} content={content} />
      <textarea
        content={content}
        onChange={(event) => handleCommentText(event.target.value)}
        value={commentText}
        rows="6"
        cols="60"
      />
      <div>
        <button className="button" onClick={handleAddComment}>
          Add comment
        </button>
      </div>
      {content.comments.map((comment, i) => (
        <div key={i}>
          <p className="comment-author">
            {comment.postedBy.name} | {formatDistanceToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default LinkDetail;
