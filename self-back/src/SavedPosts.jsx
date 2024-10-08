import "./savedposts.css"
import PostTemplate from "./PostTemplate";
import { AnimatePresence, motion } from "framer-motion";

function SavedPosts ({setCurrentTab, setReplyContent, handleNewReply, currentUser, userSaved, handleNewSave, handleNewRetweet, handleNewLike, handleDelete}) {
    return (
        <div className="savedpostmain">
            <div className="savedpostssub">
            <AnimatePresence initial={false}>
            {userSaved.map((post) => (
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
            </div>
        </div>
    )
};

export default SavedPosts;