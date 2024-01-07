import { useEffect, useState } from "react";
import styles from "./Profile.module.css";

import { useDispatch, useSelector } from "react-redux";
import {
    actions,
  getUserPosts,
  likePost,
  updateProfile,
  deletePost,
  selector
} from "../../redux/reduxSlice";
import { formatDistanceToNow } from "date-fns";
import { Hourglass } from 'react-loader-spinner'

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, user, userPosts } = useSelector(selector);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("");
  const [modal, setModal] = useState(false);

  const [isActiveUpdateProfile, setIsActiveUpdateProfile] = useState(true);

  useEffect(() => {
    dispatch(getUserPosts(user._id));
  }, []);

  const handleNavClick = (isUpdateProfile) => {
    setIsActiveUpdateProfile(isUpdateProfile);
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleLike = (id, index) => {
    // passing the id to fetch the post and posts , index to update the posts array
    dispatch(likePost({ id, userPosts, index }));
  };

  const handleDeletePost = (id, index) => {
    // passing the id to fetch the post and posts , index to update the posts array
    dispatch(deletePost({ id, userPosts, index }));
  };

  const handleUpdateProfileFormSumit = (e)=>{
    e.preventDefault();
    console.log(name,email,password,file);
    dispatch(actions.setLoading(true));
    dispatch(updateProfile({name,email,password,file}));
    console.log(file);
  }

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
          colors={['#306cce', '#72a1ed']}
        />
      </div>
    );
  }


  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userProfile}>
        <div className={styles.profileImage}>
          <img
            src={
              user.image
                ? user.image.url
                : "https://img.icons8.com/ios-filled/50/FFFFFF/user--v1.png"
            }
            alt="icon"
          />
        </div>

        <div className={styles.userDetails}>
          <p> Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Followers: {user.followersCount}</p>
        </div>
      </div>
      <section className={styles.userPostsandUpdateContainer}>
        <header className={styles.userProfileHeader}>
          <div
            className={`${styles.updateProfileNav} ${
              isActiveUpdateProfile ? styles.active : ""
            }`}
            onClick={() => handleNavClick(true)}
          >
            Update Profile
          </div>
          <div
            className={`${styles.userPostsNav} ${
              !isActiveUpdateProfile ? styles.active : ""
            }`}
            onClick={() => handleNavClick(false)}
          >
            User Posts
          </div>
        </header>

        {isActiveUpdateProfile ? (
          <div className={styles.updateUserForm} onSubmit={(e)=>handleUpdateProfileFormSumit(e)}>
            <div className={styles.updateUserFormHeader}>
              <h1>Update Profile</h1>
            </div>
            <form className={styles.updateUserFormBody}>
              <div className={styles.updateUserFormBodyItem}>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" value={name}  onChange={e=>setName(e.target.value)}/>
              </div>
              <div className={styles.updateUserFormBodyItem}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.updateUserFormBodyItem}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={e=>setPassword(e.target.value)}/>
              </div>
              <div className={styles.updateUserFormBodyItem}>
                <label htmlFor="image">Image</label>
                <input type="file" name="profile" id="image" onChange={e=>setFile(e.target.files[0])} />
              </div>
              <div className={styles.updateUserFormBodyItem}>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.updateProfile}>
            {userPosts && (
              <>
                <div className={styles.postsContainer}>
                  {userPosts.map((post, index) => (
                    <div className={styles.post} key={index}>
                      {/* post header */}
                      <div className={styles.postHeader}>
                        <img
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
                          <button
                            onClick={(e) => handleDeletePost(post._id, index)}
                          >
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
                          post.media.url.endsWith(".webm") ? (
                            <video controls>
                              <source src={post.media.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : post.media.url.endsWith(".jpg") ||
                            post.media.url.endsWith(".png") ? (
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

                        <div className={styles.commentsContainer}>
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
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
