import "./Sidebar.css"
import { useState, useEffect } from "react";
import { FaUserCircle, FaRegListAlt } from "react-icons/fa";
import { CiHome, CiCircleMore, CiUser, CiBoxList, CiBookmark, CiMail, CiBellOn, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";



function Sidebar ({currentUser, setCurrentTab, currentTab}) {

    const [notification, setNotification] = useState(0);

    useEffect(() => {
        if (currentUser){
            setNotification(currentUser.notifications.length);
        }
        else {
            console.log("bruh")
        }
    }, [currentUser])


    return(
        <div className="sidebars">
            <div>
                <img src="/TWITTY.png"/>
            </div>
            <Link to="/">
            <div className={`${currentTab === "home" ? 'sidebuttonsclicked' : 'sidebuttons'}`} onClick={() => setCurrentTab("home")}>
            <CiHome className="iconside"/>
            <p>Home</p>
            </div>
            </Link>

            <div className={`${currentTab === "explore" ? 'sidebuttonsclicked' : 'sidebuttons'}`}>
            <CiSearch className="iconside"/>
            <p>Explore</p>
            </div>

            <Link to="/notifications">
            <div className="sidebuttons">
            <CiBellOn className="iconside"/>
            <p>Notifications ({notification})</p>
            </div>
            </Link>


            <Link to="/messages">
            <div className="sidebuttons">
            <CiMail className="iconside"/>
            <p>Messages</p>
            </div>
            </Link>

            <Link to="/saved">
            <div className={`${currentTab === "bookmarks" ? 'sidebuttonsclicked' : 'sidebuttons'}`} onClick={() => setCurrentTab("bookmarks")}>
            <CiBookmark className="iconside"/>
            <p>Bookmarks</p>
            </div>
            </Link>

            <Link to="/userprofile">
            <div className={`${currentTab === "profile" ? 'sidebuttonsclicked' : 'sidebuttons'}`} onClick={() => setCurrentTab("profile")}>
            <CiUser className="iconside"/>
            <p>Profile</p>
            </div>
            </Link>
            <div className="sidebuttons">
            <CiCircleMore className="iconside"/>
            <p>More</p>
            </div>

        </div>
    )
}

export default Sidebar;