import { useState, useEffect} from "react";
import "./profilepage.css"
import UserImg from "./UserImg";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PostTemplate from "./PostTemplate";
import { AnimatePresence, motion } from "framer-motion";
function OtherUserProfile ({ handleNewFollow, setCurrentTab, setReplyContent, handleNewReply, userLiked, currentUser, displayName, setDisplayName, posts, userPosts, handleNewSave, handleNewRetweet, handleNewLike, handleDelete}) {

    const { userId } = useParams();

    const [selectedTabby, setSelectedTabby] = useState("tweets");
    const [otherUser, setOtherUser] = useState(null);  // Hold the user data
    const [otherUserPosts, setOtherUserPosts] = useState([]); 
    const [followerLength, setFollowerLength] = useState(0);
    const [followingLength, setFollowingLength] = useState(0);
    const [loading, setLoading] = useState(true);  // Track loading state
    const [mockButton, setMockButton] = useState(false)
    const [targetLikes, setTargetLikes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5434/api/users/${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setOtherUser(data);

                const postsByUser = posts.filter(post => post.ownerId === data.id);
                setOtherUserPosts([...postsByUser]);
                console.log(JSON.stringify(otherUser))

                setFollowerLength(data.followers.length)
                setFollowingLength(data.following.length)
                    const targetlikeys = posts.filter((post) => data.likedposts.includes(post.id));
                    setTargetLikes([...targetlikeys]);
                    setLoading(false);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [userId, posts, mockButton]);

    const handleHigherFollow = (otheruserid) => {
        setMockButton(!mockButton)
        handleNewFollow(otheruserid)
    }

    const handleStartChat = () => {
        fetch('http://localhost:5434/api/threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userAId: currentUser.id,
                userBId: otherUser.id,
            }),
        })
            .then(response => {
            console.log(response);
            return response.json()})
            .then((data) => {
                navigate(`/messages/${data.threadId}`);  // Redirect to the thread page
            })
            .catch(error => console.error('Error starting chat:', error));
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    if (!otherUser) {
        return <p>User not found</p>;
    }

    return (
        <div className="profilepagemain">
            <div className="profilebackimage">
            <img src="/BANNER.jpg"/>
            </div>
            <div className="profilemainimage">
            <UserImg currentUser={otherUser}/>
            </div>

            <div className="profiledetails">
            <p className="realusahname">@{otherUser.username}</p>
            <div>
                <p><span>{followingLength}</span>Following</p> 
                <p><span>{followerLength}</span>Followers</p>
                <button onClick={() => handleHigherFollow(otherUser.id)}>Follow</button>
                <button onClick={handleStartChat}>Message</button>
                
            </div>
            </div>

            <div className="profiledescription">
            <p>{otherUser.userBio}</p>
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
                <div className={`${selectedTabby === "tweets" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTabby("tweets")}>
                    <p>Tweets</p>
                </div>
                <div className={`${selectedTabby === "tweetsreplies" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTabby("tweetsreplies")}>
                    <p>Tweets & Replies</p>
                </div>
                <div className={`${selectedTabby === "media" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTabby("media")}>
                    <p>Media</p>
                </div>
                <div className={`${selectedTabby === "likes" ? 'selectedpart' : 'part'}`} onClick={() => setSelectedTabby("likes")}>
                    <p>Likes</p>
                </div>
            </div>

            <div className="posts">

            {selectedTabby === "tweets" ? (
                <AnimatePresence initial={false}>
            {otherUserPosts.map((post) => (
                   <motion.div
                   key={post.id}
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.5, ease: 'easeInOut' }}
                   style={{ overflow: 'hidden' }} // Ensure smooth collapsing
                 >
                    <PostTemplate setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post} handleDelete={handleDelete}/>
                </motion.div>
            ))}
                </AnimatePresence>
        ) : selectedTabby === "likes" ? (
            <AnimatePresence initial={false}>
            {targetLikes.map((post) => (
                   <motion.div
                   key={post.id}
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.5, ease: 'easeInOut' }}
                   style={{ overflow: 'hidden' }} // Ensure smooth collapsing
                 >
                    <PostTemplate setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post} handleDelete={handleDelete}/>
                </motion.div>
            ))}
            </AnimatePresence>
        ) : selectedTabby === "bookmarks" ? (
            null
        ) : (
            <div>Tab not recognized</div> // Default case
        )}

            </div>

        </div>
    )
}

export default OtherUserProfile;