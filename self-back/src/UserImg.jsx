
import "./Profilepic.css"
function UserImg ({currentUser}) {
    return(
        <div>
            {currentUser ? (
                <img src="/LOGGEDIN.jpg" alt="User Profile" />
            ) : (
                <img src="/DEFAULT.png"/>
            )}
        </div>
    )
}

export default UserImg;