import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LuSend } from "react-icons/lu";

import './MessageThread.css'



function ThreadMessage ({currentUser}) {
    const { threadId } = useParams();
    const [otherThreadUser, setOtherThreadUser] = useState("");
    const [curThread, setCurThread] = useState("");
    const [messageField, setMessageField] = useState("");
    


    useEffect(() => {

      console.log("currentUser:", currentUser);
      console.log("threadId:", threadId);

      if (!currentUser || !threadId) {

        console.error("currentUser or threadId is not available.");
        return;
      }
    
      fetch(`http://localhost:5434/api/threads/messages/${threadId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching thread: ${response.statusText}`);
          }
          return response.json();
        })
        .then(threadData => {
          setCurThread(threadData.thread);

          const otherUserId = threadData.thread.participants.find(id => id !== currentUser.id);
    
          if (!otherUserId) {
            console.error("Other user not found in thread participants.");
            return;
          }
          return fetch(`http://localhost:5434/api/users/${otherUserId}`)
        })
        .then(userResponse => {
          if (!userResponse.ok) {
            throw new Error(`Error fetching user: ${userResponse.statusText}`);
          }
          return userResponse.json();
        })
        .then(otherUserData => {
          setOtherThreadUser(otherUserData); 
        })
        .catch(error => console.error('Error:', error)); 
    }, [currentUser, threadId]);

const handleNewMessage = () => {
    fetch (`http://localhost:5434/api/threads/messages/${threadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, messagebody: messageField}),
    })
        .then(response => response.json())
        .then((data) => {
            setMessageField(data.thread.messages);
            setCurThread(data.thread);
        })
    .catch(error => console.error('Error:', error));
}

    return(
        <div className="threadmessagesmain"> 
        {otherThreadUser ? (
          <div className="threadmessagesheader">
            <h3>Chat with {otherThreadUser.username}</h3>
          </div>
        ) : (
          <p>Loading user...</p>
        )}
        <div className="messagethreadmessages">
          {curThread.messages && curThread.messages.length > 0 ? (
            curThread.messages.map((message, idx) => (
              currentUser.id === message.sender ? (
                <div className="messagesender" key={idx}>
                  <div className="receiverimage">
                  <img src="/LOGGEDIN.jpg"/>
                  </div>
                  <div className="receivertexttime">
                    <div className="sendertext">
                  <p>{message.text}</p> 
                    </div>
                  <p className="receivertime">{new Date(message.time).toLocaleString()}</p> 
                  </div>
                </div>
              ) : (
                <div className="messagereceiver" key={idx}>
                  <div className="receiverimage">
                  <img src="/LOGGEDIN.jpg"/>
                  </div>
                  <div className="receivertexttime">
                    <div className="receivertext">
                  <p>{message.text}</p> 
                    </div>
                  <p className="receivertime">{new Date(message.time).toLocaleString()}</p> 
                  </div>
                </div>
              )
            ))
          ) : (
            <p>No messages in this thread yet.</p>
          )}
        </div>
        <div className="messagesthreadsend">
            <input placeholder="Send a message..." onChange={(e) => setMessageField(e.target.value)}/>
            <LuSend className="lusend" onClick={handleNewMessage}/>
        </div>
      </div>
    )
}

export default ThreadMessage;