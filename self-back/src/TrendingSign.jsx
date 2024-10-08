import "./TrendingSign.css"
import { useState } from "react";
import UserImg from "./UserImg";

function TrendingSign ({setUserBio, setDisplayName, displayName, currentUser, setUsername, setPassword, setCurrentUser, handleSignUp, handleLogin}) {
   
const [signupToggle, setSignupToggle] = useState(false);
const [loginToggle, setLoginToggle] = useState(false);
  
  return(
        <div className="rightside">
        <div>
        {currentUser ? (
                <div className="sideinfo">
                  <div className="usersideinfo">
                    
                    <UserImg currentUser={currentUser}/>
                    
                    <div className="usercredentials">
                    <p className="displayname">{currentUser.displayName}</p>
                    <p className="displayusername">@{currentUser.username}</p>
                    </div>
                  </div>
                    <div>
                    <button onClick={() => setCurrentUser(null)}>Log Out</button>
                    </div>
                </div>
                ) : (
                  <div className="signlogbar">
                    <p>New? Sign up!</p>
                    <button onClick={() => setSignupToggle(!signupToggle)}>Sign up!</button>
                    <p>Already have an account?</p>
                    <button onClick={() => setLoginToggle(!loginToggle)}>Log in Here</button>
                  </div>
                )}

        {signupToggle ? (
          <div className="signupwindow" onClick={(e) => {if (e.target === e.currentTarget) {
            setSignupToggle(false)}
          }} >
            <div className="signupsubwindow">
              <div className="inputmessage">
                <h2>Sign up for Dave's Twitter</h2> <h2 className="close" onClick={()=> setSignupToggle(false)}>X</h2>
              </div>
                <p>This is a basic project, PLEASE use a DISPOSABLE password</p>
                <input className="inputfield" placeholder="your name" onChange={(e) => setDisplayName(e.target.value)}/>
                <input className="inputfield" placeholder='username' onChange={(e) => setUsername(e.target.value)}/>
                <input className="inputfield" placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
                <textarea placeholder="about you" className="inputfield" onChange={(e) => setUserBio(e.target.value)}/>
                <button className="inputbutton" onClick={handleSignUp}>Signup!</button>
            </div>
          </div>) : <></>}

        {loginToggle ? (
          <div className="loginwindow" onClick={(e) => {if (e.target === e.currentTarget) {
            setLoginToggle(false)}
          }}>
            <div className="loginsubwindow">
            <div className="inputmessage">
                <h2>Log in to Dave's Twitter</h2> <h2 className="close" onClick={()=> setLoginToggle(false)}>X</h2>
              </div>
             <p>This is a basic project, PLEASE use a DISPOSABLE password</p>
            <input className="inputfield" placeholder='username' onChange={(e) => setUsername(e.target.value)}/>
            <input className="inputfield" placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
            <button className="inputbutton" onClick={handleLogin}>Log In</button>
            </div>
          </div>) : <></>}
      
          </div>
          <br/>
        </div>
    )
}

export default TrendingSign;