import "./ReplyTemplate.css"
import { FaRetweet } from "react-icons/fa";
import { useState, useEffect } from "react";
import { AiOutlineLike, AiOutlineRetweet, AiOutlineEnter, AiOutlinePlusCircle } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";



function ReplyTemplate ({parentPost, loggedIn, handleNewSave, handleNewRetweet, currentUser, post, handleNewLike, handleDelete}) {


    return(
        <div className="replyposty">
            <div className="replypostyone">
            <div className="replypostypfp">
                <img src="/LOGGEDIN.jpg" alt="User Profile" />
            </div>
            
            <div>
            <div className="replypostyusername">
                    <p className="replyposthead">{post.displayName}</p><p className="replyingto">Replying to @{parentPost}</p>
            </div>
            
            <div className="replypostytext">
            <p className="despicable">{post.replyTitle}</p>
            </div>
            </div>
                
            </div>
        </div>
    )
}

export default ReplyTemplate;