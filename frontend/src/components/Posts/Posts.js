import { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import PostModal from "../PostModal/PostModal";

import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  likePost,
  createPost,
  deletePost,
  selector,
} from "../../redux/reduxSlice";
import { formatDistanceToNow } from "date-fns";

const Posts = ({setPage, Profile}) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState(false);
  const { user, posts } = useSelector(selector);
  const [postModal, setPostModal] = useState(false);
  const [postId, setPostId] = useState(null);


  console.log(setPage)
  console.log( Profile)
  console.log('posts')

  useEffect(() => {
    console.log(file);
  }, [file]);

  // get the posts
  useEffect(() => {
    handleFetchPost();
  }, [user]);

  const handleFetchPost = async () => {
    dispatch(getPosts());
  };

  // create post
  const handlePostSubmit = (e) => {
    e.preventDefault();
    const data = {
      content,
      file,
    };
    console.log(posts);
    setModal(!modal);
    dispatch(createPost({ data, posts }));
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleLike = (id, index) => {
    // passing the id to fetch the post and posts , index to update the posts array
    dispatch(likePost({ id, posts, index }));
  };

  const handleDeletePost = (id, index) => {
    // passing the id to fetch the post and posts , index to update the posts array
    dispatch(deletePost({ id, posts, index }));
  };

  //   handling post modal
  const handlePostModal = (id)=>{
    setPostId(id);
    setPostModal(!postModal);
    console.log('post',postId);
    console.log('id',id);
}

  return (
    <>
      {/* top search bar  */}
      {user && (
        <div
          className={styles.searchBar}
          onClick={(e) => {
            setModal(!modal);
          }}
        >
          <img
            src={
              user.image
                ? user.image.url
                : "https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
            }
            alt="icon"
          />
          <input type="text" placeholder="what's happening?" />
          <img
            src="https://img.icons8.com/ios-filled/50/FFFFFF/image--v1.png"
            alt="icon"
          />
        </div>
      )}

      {/* show posts */}
      {posts && (
        <>
          <div className={styles.postsContainer}>
            {posts.map((post, index) => (
              <div className={styles.post} key={index}>
                {/* post header */}
                <div className={styles.postHeader}>
                  <img
                //   setting the profile page in the Home.js using props
                    onClick={() => {
                        setPage(<Profile id={post.creator._id} />);
                      }}
                    src={
                      post.creator.image
                        ? post.creator.image.url
                        : "https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
                    }
                    alt="icon"
                  />
                  <p>{post.creator.name}</p>
                  <p className={styles.postTime}>
                    {formatDate(post.createdAt)}
                  </p>
                  {/* delete button of post  */}
                  {post.creator._id === user._id && (
                    <button  onClick={(e) => handleDeletePost(post._id, index)}>
                      Delete
                    </button>
                  )}
                </div>
                <div className={styles.postContent}>
                  <p>{post.content}</p>
                </div>
                {/* media container of post */}
                {post.media && (
                  <div className={styles.postMedia}>
                    {post.media.url.endsWith(".mp4") ||
                    post.media.url.endsWith(".webm")  ? (
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

                {/* buttons of post */}
                <div className={styles.postButtons}>
                  {/* likes container of post  */}
                  <div
                    className={styles.likesContainer}
                    onClick={(e) => handleLike(post._id, index)}
                  >
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
                  {/* comments container of post   */}
                  <div
                    className={styles.commentsContainer}
                    onClick={(e) => handlePostModal(post._id)}
                  >
                    <img
                      src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/FA5252/external-comments-social-media-ui-tanah-basah-glyph-tanah-basah.png"
                      alt="external-comments-social-media-ui-tanah-basah-glyph-tanah-basah"
                    />
                    comments
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* create new post modal  */}
      {modal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <span
              className={styles.close}
              onClick={(e) => {
                setModal(!modal);
              }}
            >
              &times;
            </span>
            <form onSubmit={handlePostSubmit} enctype="multipart/form-data">
              <textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.textarea}
                required
              ></textarea>
              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className={styles.fileInput}
                />
              </div>

              <button type="submit" className={styles.modalButton}>
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* show post modal */}
      {postModal && <PostModal postId={postId} setPostModal={setPostModal}/>
      }
    </>
  );
};

export default Posts;
