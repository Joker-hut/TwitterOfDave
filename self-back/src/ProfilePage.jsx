import { useState } from "react";
import "./profilepage.css"
import UserImg from "./UserImg";
import PostTemplate from "./PostTemplate";
import { AnimatePresence, motion } from "framer-motion";
function ProfilePage ({setCurrentTab, setReplyContent, handleNewReply, userLiked, currentUser, displayName, setDisplayName, posts, userPosts, handleNewSave, handleNewRetweet, handleNewLike, handleDelete}) {

    const [selectedTab, setSelectedTab] = useState("tweets");

    return (
        <div className="profilepagemain">
            <div className="profilebackimage">
            <img src={currentUser.userBackground}/>
            </div>
            <div className="profilemainimage">
            <UserImg currentUser={currentUser}/>
            </div>

            <div className="profiledetails">
            <p className="usahname">{currentUser.displayName}</p>
            <p className="realusahname">@{currentUser.username}</p>
            <div>
                <p><span>{currentUser.following.length}</span> Following</p> 
                <p><span>{currentUser.followers.length}</span> Followers</p>
            </div>
            </div>

            <div className="profiledescription">
            <p>{currentUser.userBio}</p>
            </div>

            <div className="profileminidetails">
            <div className="locationdetails">

            </div>
            <div className="linkdetails">

            </div>
            <div className="joineddetails">

            </div>
            </div>

            <div className="followingfollowers">
            <div className="followingdetail">

            </div>
            <div className="followersdetail">

            </div>
            </div>

            <div className="tweetsmediareplies">
                <div className={`${selectedTab === "tweets" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTab("tweets")}>
                    <p>Tweets</p>
                </div>
                <div className={`${selectedTab === "tweetsreplies" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTab("tweetsreplies")}>
                    <p>Tweets & Replies</p>
                </div>
                <div className={`${selectedTab === "media" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTab("media")}>
                    <p>Media</p>
                </div>
                <div className={`${selectedTab === "likes" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTab("likes")}>
                    <p>Likes</p>
                </div>
            </div>

            <div className="posts">

            {selectedTab === "tweets" ? (
                <AnimatePresence initial={false}>
            {userPosts.map((post) => (
                   <motion.div
                   key={post.id}
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.5, ease: 'easeInOut' }}
                   style={{ overflow: 'hidden' }}
                 >
                    <PostTemplate setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post} handleDelete={handleDelete}/>
                </motion.div>
            ))}
                </AnimatePresence>
        ) : selectedTab === "likes" ? (
            <AnimatePresence initial={false}>
            {userLiked.map((post) => (
                   <motion.div
                   key={post.id}
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.5, ease: 'easeInOut' }}
                   style={{ overflow: 'hidden' }}
                 >
                    <PostTemplate setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post} handleDelete={handleDelete}/>
                </motion.div>
            ))}
            </AnimatePresence>
        ) : selectedTab === "bookmarks" ? (
            null
        ) : (
            <div>Tab not recognized</div> 
        )}

            </div>

        </div>
    )
}

export default ProfilePage;