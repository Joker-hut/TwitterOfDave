import { useState, useEffect } from 'react'
import * as React from 'react'
import UserImg from './UserImg'
import Sidebar from './Sidebar'
import PostTemplate from './PostTemplate'
import TrendingSign from './TrendingSign'
import SavedPosts from './SavedPosts'
import Mainfeed from './Mainfeed'
import Messages from './Messages'
import ProfilePage from './ProfilePage'
import OtherUserProfile from './otherUserProfile'
import Notifications from './Notifications'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import ThreadMessage from './ThreadMessage'

function App() {
  
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("/DEFAULT.png");
  const [displayName, setDisplayName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userBio, setUserBio] = useState("");
  const [userBackground, setUserBackground] = useState("/BANNER.jpg");
  const [userPosts, setUserPosts] = useState([]);
  const [userSaved, setUserSaved] = useState([]);
  const [userLiked, setUserLiked] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [currentTab, setCurrentTab] = useState("home");
  const [userThreads, setUserThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState([]);


  useEffect(() => { //GET Request
    // Fetch data from the backend (Express)
    fetch('http://localhost:5434/api/posts')
      .then(response => response.json()) //Turn the received Json into normal js object
      .then(data => setPosts(data)) //Set posts to data, name is arbitrary but dont use response as its an object
      .catch(error => console.error('Error fetching posts:', error));
  }, []);


  const handleSignUp = (e) => {
    e.preventDefault();
    fetch('http://localhost:5434/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, profilePic, displayName, userBio, userBackground }), // Send username and password
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User signed up successfully') {
          alert('Sign-up successful!');
        } else {
          alert(data.message);
        }
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:5434/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "User logged in successfully"){
          setCurrentUser(data.user)
          setLoggedIn(true); //Set user state to the user object. If used only username, it would set it to the username itself not the entire user object
          alert("login success!");
        } else {
          alert(data.message);
        }
      })
  }

  const handleNewPost = (e) => { 
    if (!currentUser){
      alert("You must be logged in to post");
    }
    fetch('http://localhost:5434/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newPost, user: currentUser.username, profilePic: currentUser.profilePic, displayName: currentUser.displayName, ownerId: currentUser.id}),  
    })
      .then(response => response.json())
      .then((newPostFromServer) => {
        setPosts([...posts, newPostFromServer]); 
        setNewPost(''); 
      })
  };

  const handleNewThread = (targetId) => {
    if (currentUser) {
      fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAId: currentUser.id,
          userBId: targetId,
        })
      })
        .then(response => response.json())
        .then((data) => {
          setCurrentUser(data.userA)
        })
    }
  }

  const handleNewReply = (postId) => {
      fetch(`http://localhost:5434/api/posts/replies/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          replyTitle: replyContent, // Correct naming 
          userId: currentUser.id, // Pass userId, not currentuser
          profilePic: currentUser.profilePic, 
          displayName: currentUser.displayName 
        }), 
      })
      .then(response => response.json())
      .then((data) => {
        setPosts(prevPosts => prevPosts.map(post => post.id === data.post.id ? data.post : post));
        setCurrentUser(data.user);
        console.log("wasabimuffin is: " + JSON.stringify(posts))
        console.log("wasabimuffin is: " + JSON.stringify(posts[1].replies));
      })
      .catch(error => {
        console.error("Bruh Error Alert: ", error)
        console.log("posts is bruh");
      })
    }

  const handleNewLike = (postId) => {
    fetch(`http://localhost:5434/api/posts/likes/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ postId: postId, userId: currentUser.id})
  })
    .then(response => response.json())
    .then((data) => {
      setPosts(posts.map(post => post.id === data.post.id ? data.post : post));
      setCurrentUser(data.user);
      console.log("posts is: " + posts);
    })
    .catch(error => {
      console.error("Bruh Error Alert: ", error)
      console.log("posts is bruh");
    })
  }

  const handleNewFollow = (ownerId) => {
    fetch(`http://localhost:5434/api/users/followers/${ownerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ userId: currentUser.id})
  })
    .then(response => response.json())
    .then((data) => {
      setCurrentUser(data.user);
    })
    .catch(error => {
      console.error("Bruh Error Alert: ", error)
      console.log("posts is bruh");
    })
  }

  const handleNewRetweet = (postId) => {
    fetch(`http://localhost:5434/api/posts/retweets/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ postId: postId, userId: currentUser.id})
  })
    .then(response => response.json())
    .then((updatedPost) => {
      
      setPosts(posts.map(post => post.id === updatedPost.post.id ? updatedPost.post : post));
    })
    .catch(error => {
      console.error("Bruh Error Alert: ", error)
      console.log("posts is bruh");
    })
  }

  const handleNewSave = (postId) => {
    fetch(`http://localhost:5434/api/posts/saves/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, //what kind of data is being sent and how to handle it (JSON)
      body: JSON.stringify({ postId: postId, userId: currentUser.id})
  })
    .then(response => response.json())
    .then((data) => {
      
      setPosts(posts.map(post => post.id === data.post.id ? data.post : post));
      setCurrentUser(data.user);
    })
    .catch(error => {
      console.error("Bruh Error Alert: ", error)
      console.log("posts is bruh");
    })
  }

  useEffect(() => {
    if (currentUser) {
      const saved = posts.filter((post) => currentUser.savedposts.includes(post.id));
      setUserSaved([...saved]);
      console.log("yooo")
    }
  }, [posts, currentUser])

  useEffect(() => {
    if (currentUser) {
      const likeys = posts.filter((post) => currentUser.likedposts.includes(post.id));
      setUserLiked([...likeys]);
    }
  }, [posts, currentUser])

  const handleDelete = (postId) => {
    fetch(`http://localhost:5434/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ username: currentUser.username, id
       }), 
    })
      .then(() => {
        // After deleting the post, fetch the updated list of posts from the backend
        return fetch('http://localhost:5434/api/posts');
      })
      .then(response => response.json())
      .then(data => setPosts(data)) // Update the state with the fresh data from the backend
      .catch(error => console.error('Error fetching posts:', error));
  };

  useEffect(() => {
    if (currentUser) {
      const filtering = posts.filter((post) => post.user === currentUser.username);
      setUserPosts([...filtering])
    }

  }, [posts, currentUser])


  return (
    <Router>
      <div className='overall'>

      <div className='sidebar'>
        <Sidebar currentUser={currentUser} setCurrentTab={setCurrentTab} currentTab={currentTab}/>
      </div>

      <div className='alignthatshit'>
        <Routes>
        <Route path='/' element={
              <Mainfeed setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} setNewPost={setNewPost} handleNewLike={handleNewLike} currentUser={currentUser} handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} posts={posts} handleDelete={handleDelete} handleNewPost={handleNewPost}/>
        }/>

        <Route path='/userprofile' element={
              <ProfilePage setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} currentUser={currentUser} displayName={displayName} setDisplayName={setDisplayName} posts={posts} userPosts={userPosts} handleNewLike={handleNewLike} handleNewRetweet={handleNewRetweet} handleNewSave={handleNewSave} userLiked={userLiked}/>
        }/>
        <Route path='/user/:userId' element={
              <OtherUserProfile handleNewFollow={handleNewFollow} setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} currentUser={currentUser} displayName={displayName} setDisplayName={setDisplayName} posts={posts} userPosts={userPosts} handleNewLike={handleNewLike} handleNewRetweet={handleNewRetweet} handleNewSave={handleNewSave} userLiked={userLiked}/>
        }/>

        <Route path='/saved' element={
              <SavedPosts setCurrentTab={setCurrentTab} setReplyContent={setReplyContent} handleNewReply={handleNewReply} userSaved={userSaved} currentUser={currentUser}  handleNewSave={handleNewSave} handleNewRetweet={handleNewRetweet} posts={posts} handleDelete={handleDelete} handleNewLike={handleNewLike}/>
        }/>
        <Route path='/messages' element={
              <Messages currentUser={currentUser}/>
        }/>
        <Route path='/messages/:threadId' element={
              <ThreadMessage currentUser={currentUser}/>
        }/>
        <Route path='/notifications' element={
          <Notifications currentUser={currentUser}/>
        }/>
        </Routes>
      </div>
        <div className='signups'>
          <TrendingSign setUserBio={setUserBio} loggedIn={loggedIn} displayName={displayName} setDisplayName={setDisplayName} setUsername={setUsername} setPassword={setPassword} setCurrentUser={setCurrentUser} handleSignUp={handleSignUp} currentUser={currentUser} handleLogin={handleLogin}/>
        </div>


      </div>
    </Router>
  )
}

export default App
