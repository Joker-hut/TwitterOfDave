import { useEffect, useState } from "react";
import "./Notifications.css"

function Notifications ({currentUser}) {

    const [userNotifications, setUserNotifications] = useState([]);

    // useEffect(() => {
    //     fetch("http://localhost:5434/api/notifications", {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ currentUser }),
    //     })
    //     .then(response => response.json())
    //     .then(data => setUserNotifications(data))
    //     .catch(error => console.error('Error fetching posts:', error));
    // }, []);

    return (
        <div className="notificationsmain">
            <button>Mark all as Read</button>  
            {currentUser ? (
        <div className="notificationn">
            {currentUser.notifications.map((notification) => {
                return (
                    <div>
                    {notification.type === "like" ? (
                        <p>{notification.sender} liked your post</p>
                    ) : notification.type === "message" ? (
                        <p>{notification.sender} sent you a message</p>
                    ) : notification.type === "reply" ? (
                        <p>{notification.sender} replied to your post</p>
                    ) : notification.type === "follow" ? (
                        <p>{notification.sender} started following you</p>
                    ) : <p>Bruh</p>}
                    </div>
                )

            })}
        </div>
            ) : <p>Loading...</p>}

        </div>
    )
}

export default Notifications;