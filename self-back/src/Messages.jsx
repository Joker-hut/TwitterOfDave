import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Messages.css"

function Messages ({currentUser}) {

    const [fullThreads, setFullThreads] = useState([]); // Store the full thread data
    const [otherUsers, setOtherUsers] = useState([]); // Store the other users' info
  
    useEffect(() => {
      if (!currentUser || !currentUser.threads) {
        console.log("currentUser or currentUser.threads is undefined");
        return;
      }
  
      console.log("Thread IDs of current user are:", currentUser.threads);
  
      const fetchThreadData = async () => {
        const fullThreadsData = await Promise.all(
          currentUser.threads.map(async (threadId) => {
            try {
              // Fetch full thread data using the thread ID
              const response = await fetch(`http://localhost:5434/api/threads/messages/${threadId}`);
              if (!response.ok) {
                throw new Error(`Error fetching thread with ID: ${threadId}`);
              }
              return await response.json(); // Return the full thread data
            } catch (error) {
              console.error("Error fetching thread:", error);
              return null;
            }
          })
        );
  
        setFullThreads(fullThreadsData.filter(Boolean)); // Filter out any null values
      };
  
      fetchThreadData();
    }, [currentUser]);
  
    useEffect(() => {
      if (fullThreads.length === 0) {
        return;
      }
  
      const fetchOtherUserData = async () => {
        const otherUsersInfo = await Promise.all(
          fullThreads.map(async (threadData) => {
            const thread = threadData.thread;
  
            if (!thread || !Array.isArray(thread.participants)) {
              console.error("Invalid thread or participants:", thread);
              return null;
            }
  
            const otherUserId = thread.participants.find(
              (id) => id !== currentUser.id
            );
  
            if (!otherUserId) {
              console.error("Other user ID not found in thread participants:", thread);
              return null;
            }
  
            try {
              const response = await fetch(`http://localhost:5434/api/users/${otherUserId}`);
              if (!response.ok) {
                throw new Error(`Error fetching user with ID: ${otherUserId}`);
              }
              return await response.json(); // Return the other user data
            } catch (error) {
              console.error("Error fetching other user:", error);
              return null;
            }
          })
        );
  
        setOtherUsers(otherUsersInfo.filter(Boolean)); // Filter out any null values
      };
  
      fetchOtherUserData();
    }, [fullThreads, currentUser]);
  
    if (!currentUser || fullThreads.length === 0) {
      return <p>Loading...</p>; // Show a loading message while fetching data
    }
  
    return (
    <div className="messagesmainn">

    <div className="messageshead">
        <h2>Your Conversations</h2>
    </div>  
      <div className="messagesmap">
        {fullThreads.map((threadData, index) => {
          const thread = threadData.thread;
          const otherUser = otherUsers[index];
  
          if (!otherUser) {
            return <p key={thread.id}>Loading user info...</p>;
          }
  
          return (
            <Link to={`/messages/${thread.id}`} key={thread.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="messagesmessage">
                <div className="messagesulm">
                <div className="messagesusername">
                <p>@{otherUser.username}</p>
                </div>
                <div className="messageslm">
                <p>
                  {thread.messages[thread.messages.length - 1]?.text ||
                    "No messages yet"}
                </p>
                </div>
                </div>
                <div className="messagestime">
                <p>
                  {thread.messages[thread.messages.length - 1]?.time ? new Date(thread.messages[thread.messages.length - 1].time).toLocaleString() : "NO messages yet"}
                </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
    );
  }
  

export default Messages;