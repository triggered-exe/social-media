import { useEffect, useState } from "react";
import styles from "./PostModal.module.css";

import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Hourglass } from "react-loader-spinner";
import {
  getSinglePost,
  addComment,
  deleteComment,
  selector,
} from "../../redux/reduxSlice";

const PostModal = ({ postId, setPostModal }) => {
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selector);
  const [commentModal, setCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    setLoading(true);
    console.log(postId);
    dispatch(getSinglePost(postId)).then((res) => {
      console.log(res.payload);
      setPost(res.payload.post);
      setComments(res.payload.comments);
      setLoading(false);
    });
  }, []);

  const formatDate = (date) => {
    if (!date) {
      // Handle case where date is not available or null
      return "No date available";
    }
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

//   function to add new comment 
  const handleAddComment = (e,id) => {
    e.preventDefault();
    console.log(post._id)
    console.log(commentContent)
    // update the comment in the backend and push it to the comments list
    dispatch(addComment({id:post._id,content:commentContent}))
    .then((res)=>{
        console.log(res.payload);
        setComments([res.payload,...comments]);
    })
    .finally(()=>{
        setCommentContent("");
        setCommentModal(false);
    })
  }

//   function to delete a comment
  const handleDeleteComment = (id) => {
    console.log(id)
    // update the comment in the backend and push it to the comments list
    dispatch(deleteComment(id))
    .then((res)=>{
        console.log(res.payload);
        setComments(comments.filter((comment)=>comment._id!==id));
    })
  }

  // show loading spinner while fetching data
  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <Hourglass
          visible={true}
          height={80}
          width={80}
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      </div>
    );
  }

  return (
    <div className={styles.postModalContainer}>
      {/* Post details */}
      {post && (
        <div className={styles.selectedPost}>
          <div className={styles.postHeader}>
            <img
              src={
                post.creator?.image?.url ||
                "https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
              }
              alt="icon"
            />
            <p>{post.creator?.name}</p>
            <p className={styles.postTime}>{formatDate(post.createdAt)}</p>
            <span className={styles.closePostModalX} onClick={()=>setPostModal(false)}>&#10006;</span>
          </div>
          <div className={styles.postBody}>
            <div className={styles.postContent}>
              <p>{post.content}</p>
            </div>
            {/* Media container */}
            {post.media && (
              <div className={styles.postMedia}>
                {post.media.url.endsWith(".mp4") ||
                post.media.url.endsWith(".webm") ? (
                  <video controls>
                    <source src={post.media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : post.media.url.endsWith(".jpg") ||
                  post.media.url.endsWith(".png") || 
                  post.media.url.endsWith(".webp") ? (
                  <img src={post.media.url} alt="Image" />
                ) : null}
              </div>
            )}
          </div>

          {/* Buttons of post */}
          <div className={styles.postButtons}>
            {/* Likes container */}
            <div className={styles.likesContainer}>
              <img
                src={
                  post.likes.includes(user._id)
                    ? "https://img.icons8.com/ios-filled/50/FA5252/like--v1.png"
                    : "https://img.icons8.com/ios/50/FA5252/like.png"
                }
                alt="like"
              />
              {post.likesCount}
            </div>
            {/* Comments container */}
            <div className={styles.comments} onClick={()=>setCommentModal(!commentModal)}>
              <img
                src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/FA5252/external-comments-social-media-ui-tanah-basah-glyph-tanah-basah.png"
                alt="external-comments-social-media-ui-tanah-basah-glyph-tanah-basah"
              />
              comments
            </div>
          </div>
        </div>
      )}

      {/* Comments details */}
      {comments && (
        <div className={styles.commentsContainer}>
          {/* Map through comments array and display each comment */}
          {comments.length === 0 && (<div className={styles.noCommentsDiv}>No comments to show</div>)}
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentSubContainer}>
              {/* Display each comment */}
              <div className={styles.commentHeader}>
                <img
                  src={
                    comment.creator?.image?.url ||
                    "https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
                  }
                  alt="icon"
                />
                <p>{comment.creator?.name}</p>
                <p className={styles.postTime}>
                  {formatDate(comment.createdAt)}
                </p>
                {/* delete button for the comment */}
                {comment.creator._id === user._id && (
                    <button className={styles.commentDeleteButton} onClick={(e) => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  )}
              </div>
              <div className={styles.commentContent}>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* comment modal */}
      {commentModal && (
        <section className={styles.commentModal}>
          <form onSubmit={(e)=>handleAddComment(e)}>
            <span className={styles.closeModalX} onClick={()=>setCommentModal(!commentModal)}>&#10006;</span>
            <input type="text" placeholder="Add a comment"  value={commentContent} onChange={e=>setCommentContent(e.target.value)} required className={styles.commentInput} autoFocus={true} maxLength={200} minLength={1} pattern="[a-zA-Z0-9 ]+" title="Only alphabets and numbers are allowed" onInvalid={e=>e.target.setCustomValidity("Please enter a valid comment")} onInput={e=>e.target.setCustomValidity("")}/>
            <button type="submit">Post</button>
          </form>
          </section>
      )}
    </div>
  );
};

export default PostModal;
