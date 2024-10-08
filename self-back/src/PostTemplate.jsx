import "./PostTemplate.css"
import { FaRetweet } from "react-icons/fa";
import { useState, useEffect } from "react";
import { AiOutlineLike, AiOutlineRetweet, AiOutlineEnter, AiOutlinePlusCircle } from "react-icons/ai"
import { CiBookmark } from "react-icons/ci";
import Accordion from "./Accordion";
import { Link } from "react-router-dom";
import ReplyTemplate from "./ReplyTemplate";





function PostTemplate ({setCurrentTab, setReplyContent, handleNewReply, loggedIn, handleNewSave, handleNewRetweet, currentUser, post, handleNewLike, handleDelete}) {

    const [likeClicked, setLikeClicked] = useState(false);
    const [retweetClicked, setRetweetClicked] = useState(false);
    const [bookmarkClicked, setBookmarkClicked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [replyAdded, setReplyAdded] = useState(false);
    const [hoveredSection, setHoveredSection] = useState(null);

    const handleMouseEnter = (section) => {
      setHoveredSection(section);
    };
  
    const handleMouseLeave = () => {
      setHoveredSection(null);
    };

    const handleViewProfile = () => {

    }


    useEffect(() => {
        if (currentUser) {
            setLikeClicked(post.likes.includes(currentUser.id));
            setRetweetClicked(post.retweets.includes(currentUser.id));
            setBookmarkClicked(post.saves.includes(currentUser.id));
        } else {
            setLikeClicked(false);
            setRetweetClicked(false);
            setBookmarkClicked(false);
        }
    }, [currentUser, post.likes, post.retweets, post.saves]);

    const handleHigherLike = (postId) => {
        handleNewLike(postId);
        setLikeClicked(!likeClicked);
    }
    const handleHigherRetweet = (postId) => {
        handleNewRetweet(postId);
        setRetweetClicked(!likeClicked);
    }
    const handleHigherBookmark = (postId) => {
        handleNewSave(postId);
        setLikeClicked(!likeClicked);
    }

    const handleHigherReply = (postId) => {
        handleNewReply(postId)
        setReplyAdded(true); // Show popup when reply is added
        setTimeout(() => {
          setReplyAdded(false); // Hide popup after 2 seconds
        }, 4000);
    }

    const funkyreply = post.replies;
    const parentPost = post.user

    return(

        <div className="posty">
            <div className="postyone">
            <div className="postypfp" onMouseEnter={() => handleMouseEnter('profileImage')}
          onMouseLeave={handleMouseLeave}>
            {post.user ? (
                <>
                <Link to={`/user/${post.ownerId}`}>
                <img src="/LOGGEDIN.jpg" alt="User Profile" className="postprofile" onClick={() => setCurrentTab("profile")}/>
                </Link>
                {hoveredSection === 'profileImage' && (
                    <div className="hover-card under-profile-image">
                    <p>{post.displayName}</p>
                    <p>@{post.user}</p>
                    <p>Bio: Web Developer</p>
                    </div>
                )}
                </>
            ) : (
                <img src="/DEFAULT.png" className="postprofile"/>
            )}
            </div>
            
            <div>
            <div className="postyusername" onMouseEnter={() => handleMouseEnter('displayName')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}>
                {post.user ? (
                <div className="postyuzerz"> 
                <div>
                    <Link to={`/user/${post.ownerId}`}>
                    <p className="posthead postprofile">{post.displayName}</p>
                    </Link>
                    {hoveredSection === 'displayName' && (
                    <div className="hover-card under-display-name">
                        <p>{post.displayName}</p>
                        <p>@{post.user}</p>
                        <p>Bio: Web Developer</p>
                    </div>
                    )}
                </div>
                <>
                    <p className="postuser">@{post.user}</p>
                </>
                    
                </div>
                ) : (
                    <p>@Anonymous User</p>
                )}
            </div>


            
            <div className="postytext">
            <p>{post.title}</p>
            </div>
            </div>


            </div>
            <div className="postybuttons">
                <div className="statybuttonz">
                <AiOutlineLike
                onClick={() => handleHigherLike(post.id)}
                className={`postybutton ${likeClicked ? 'likepostyclicked' : 'likeposty'}`}
                /><p>{post.likes.length}</p>
                </div>

                <div className="statybuttonz">
                    <AiOutlineRetweet 
                    className={`postybutton ${retweetClicked ? 'retweetpostyclicked' : 'retweetposty'}`}
                    onClick={() => handleHigherRetweet(post.id)}
                    /><p>{post.retweets.length}</p>
                </div>
                <div className="statybuttonz">
                    <CiBookmark 
                    className={`postybutton ${bookmarkClicked ? 'bookmarkpostyclicked' : 'bookmarkposty'}`}
                    onClick={() => handleHigherBookmark(post.id)}
                    /><p>{post.saves.length}</p>
                </div>
                <div className="statybuttonz">
                    <AiOutlineEnter className={`postybutton ${isOpen ? 'replyupostyclicked' : 'replyuposty'}`} onClick={() => setIsOpen(!isOpen)}/>
                    <p>{post.replies.length}</p>
                </div>
                
            </div>

            <Accordion isOpen={isOpen} setIsOpen={setIsOpen} dependencies={post.replies.length}>
            <div className="replysection">
                <div className="addareply">
                    <img src="/LOGGEDIN.jpg"/>
                    <textarea className="addreplytextarea" placeholder="Add your thoughts" onChange={(e) => setReplyContent(e.target.value)}/>
                    <button className="replybuttun" onClick={() => handleHigherReply(post.id)}>Reply</button>
                </div>
                <hr className="replybreak"/>
                <div className="otherReplies">
                {funkyreply.map((post) => (
                <div>
                    <ReplyTemplate handleNewSave={handleNewSave} parentPost={parentPost} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post} handleDelete={handleDelete}/>
                </div>
                ))}
                </div>
            </div>
            {replyAdded && <div className="popup">Tweet Added!</div>}

            </Accordion>

        </div>
    )
}

export default PostTemplate;


//<ReplyTemplate handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} currentUser={currentUser} handleNewLike={handleNewLike} post={post.replies} handleDelete={handleDelete}/>