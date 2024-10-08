import "./App.css"
import { useState } from "react"
import PostTemplate from "./PostTemplate"
import UserImg from "./UserImg"
import { AnimatePresence, easeOut, motion } from "framer-motion";

function Mainfeed ({ setCurrentTab, setReplyContent, setNewPost, handleNewLike, currentUser, handleNewSave, handleNewRetweet, posts, handleDelete, handleNewPost, handleNewReply}) {

  const [tweetAdded, setTweetAdded] = useState(false);

  const handleHigherPost = (e) => {
    e.preventDefault();
    handleNewPost(easeOut);
    setTweetAdded(true);
    setTimeout(() => {
      setTweetAdded(false); // Hide popup after 2 seconds
    }, 4000);
  }
    
return(
<div className='mainfeed'>

<div className='mainnewpost'>
  <div className='pfp'>
  <UserImg currentUser={currentUser}/>
  </div>
  <div className='newpost'>
  <textarea className='whatshappening' onChange={(e) => setNewPost(e.target.value)} placeholder="What's happening?"/>
    <div className='newtweet'>
      <button onClick={handleHigherPost}>Tweet</button>
    </div>
  </div>
</div>
<hr className='heyher'/>
<AnimatePresence initial={false}>
<div className='postsfeed'>
{posts.map((post) => (
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
</div>
</AnimatePresence>

{tweetAdded && <div className="popuptweet">Tweet Added!</div>}

</div>
    )
}

export default Mainfeed

