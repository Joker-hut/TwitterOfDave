  const express = require('express');
  const cors = require('cors');
const e = require('cors');
  const app = express();
  const PORT = 5434;

  // Enable CORS so that your React app can communicate with the backend
  app.use(cors());
  app.use(express.json());

  let users = [];

  let posts = [
    { id: 1, title: 'First Post', likes: [], retweets: [], saves: [], replies: [],},
    { id: 2, title: 'Second Post', likes: [], retweets: [], saves: [], replies: []},
  ];

  let threads = [];

  app.get('/', (req, res) => {
    res.send('Whats up');
  });

  app.get('/api/posts', (req, res) => {
    res.json(posts);
  });

  app.post("/api/signup", (req, res) => {
    const {username, password, profilePic, displayName, userBackground, userBio} = req.body; //Destructures the data and allows referring to username and password
    const existingUser = users.find(user => user.username === username) //Search to see if there is an existing user with the username

    if (existingUser){ //If existing user exists, return error message
      return res.status(400).json({message: "User exists"})
    }
    const newUser = { id: users.length + 1, username, password, profilePic: profilePic, displayName: displayName, followers: [], following: [], likedposts: [], retweetedposts: [], savedposts: [], posts: [], userBio, userBackground, repliedPosts:[], threads: [], notifications: []
    }; 
    users.push(newUser); //Adds the new user to the array of users
    res.status(201).json({ message: 'User signed up successfully', user: newUser }); //Success Message
  });

  

  app.post("/api/login", (req, res) => {
    const {username, password} = req.body;
    const isAUser = users.find(user => user.username === username && user.password === password) //Check if username AND passowrd match

    if(isAUser){
      return res.status(200).json({ message: 'User logged in successfully', user: isAUser });
    } else {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  })

  /* 
  ! Add Notifications
  */
  app.post('/api/posts', (req, res) => {
    const {title, user, profilePic, displayName, ownerId} = req.body;
    const postUser = users.find(u => u.username === user);
    if (!postUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newPost = { id: posts.length + 1, title, user, profilePic, displayName, likes: [], retweets: [], saves: [], replies: [], ownerId }; // 
    posts.push(newPost); 
    postUser.posts = postUser.posts || []; // Ensure the user has a posts array
    postUser.posts.push(newPost.id);
    res.status(201).json(newPost); // Send back the new post to frontend
  });

  app.post("/api/posts/likes/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const {userId} = req.body;

    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId);
    const otherUserId = post.user;
    const otherUser = users.find(u => u.id === otherUserId);

    const newNotification = {type: "like", sender: userId, reference: postId};

    if (post) {
      if(!post.likes.includes(userId)) {
        post.likes.push(userId);
        user.likedposts.push(postId);
        otherUser.notifications.push(newNotification);

        res.status(200).json({ message: "Like added", post, user });
      }
      else {
        post.likes = post.likes.filter(id => id !== userId)
        user.likedposts = user.likedposts.filter(id => id !== postId)
        otherUser.notifications = otherUser.notifications.filter(notification => {
          return !(notification.type === "like" && notification.sender === userId);
        });
        res.status(200).json({ message: "Like removed", post, user })
      }
    }
    else {
      res.status(404).json({message: "can not add like"})
    }
  })

  app.post('/api/threads', (req, res) => {
    const { userAId, userBId } = req.body;

    const existingThread = threads.find(thread => 
      (thread.participants.includes(userAId) && thread.participants.includes(userBId))
    );

    if (existingThread) {
      return res.status(200).json({ message: "Thread already exists", thread: existingThread, threadId: existingThread.id });
    }
    
    const newThread = {
        id: threads.length + 1,
        participants: [userAId, userBId],
        messages: []
    };
    const userA = users.find(u => u.id === userAId);
    const userB = users.find(u => u.id === userBId);
    if (userA && userB) {
      userA.threads.push(newThread.id);
      userB.threads.push(newThread.id);
  
      threads.push(newThread);
      return res.status(201).json({message: "Thread Added", newThread, userA, threadId: newThread.id});
    } else {
      return res.status(400).json({message: "Users not found"})
    }

});

app.get('/api/threads/messages/:threadId', (req, res) => {
  const threadId = parseInt(req.params.threadId);
  console.log("Thread ID is " + threadId + " bro")

  const selectedThread = threads.find(thread => thread.id === threadId);
  console.log("Thread selected is " + selectedThread + " bro")

  if (selectedThread) {
    return res.status(200).json({message: "Thread found", thread: selectedThread})
  }
  else {
    res.status(404).json({ message: 'User not found' });
  }
});

  /* 
  * Have added the notifications
  */
app.post('/api/threads/messages/:threadId', (req, res) => {
  const threadId = parseInt(req.params.threadId);
  console.log("Thread ID is " + threadId + " bro")
  console.log("body is " + JSON.stringify(req.body) + " bro")
  const {userId, messagebody} = req.body;


  const selectedThread = threads.find(thread => thread.id === threadId);
  console.log("Thread selected is " + JSON.stringify(selectedThread) + " bro")

  const newMessage = {text: messagebody, sender: userId, time: Date.now()}
  console.log("New message is " + JSON.stringify(newMessage) + " bro")

  const otherUserId = selectedThread.participants.find(participant => participant !== userId);
  const otherUser = users.find(user => user.id === otherUserId);
  if (!otherUser) {
    return res.status(404).json({ message: "Other user not found" });
  }

  const newNotification = {type: "message", sender: userId, reference: threadId};
  selectedThread.messages.push(newMessage);
  otherUser.notifications.push(newNotification);
  console.log("Messages is no " + JSON.stringify(selectedThread.messages) + " bro")

  return res.status(201).json({
    message: "Message added",
    thread: selectedThread, 
    newMessage
  })
})


app.get('/api/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log("userId is " + userId)
  const user = users.find(user => user.id === userId);
  
  if (user) {
      res.status(200).json(user);  // Send back the user object
  } else {
      res.status(404).json({ message: 'User not found' });
  }
});

  /* 
  * Have added the notifications
  */
  app.post("/api/users/followers/:userId", (req, res) => {
    const ownerid = parseInt(req.params.userId);
    const {userId} = req.body;
    console.log("The muthafucking request body is " + JSON.stringify(req.body))

    const owner = users.find(u => u.id === ownerid)
    const user = users.find(u => u.id === parseInt(userId))
    const newNotification = {type: "follow", sender: userId, reference: ""};

    console.log("the goddamned owner is " + JSON.stringify(owner))
    console.log("the godforsaken user is " + JSON.stringify(user))

    if (owner && user) {
      if(!owner.followers.includes(userId)) {
        owner.followers.push(userId);
        owner.notifications.push(newNotification);
        user.following.push(ownerid)
        console.log("bruh isss: " + user.following)
        console.log("Bruhmore issss: " + JSON.stringify(user.following))
        res.status(200).json({ message: "Follow added", owner, user });
      }
      else {
        owner.notifications = owner.notifications.filter(notification => {
          return !(notification.type === "follow" && notification.sender === userId);
        });
        owner.followers = owner.followers.filter(id => id !== userId)
        user.following = user.following.filter(id => id !== ownerid)
        res.status(200).json({ message: "Follow removed", owner, user })
      }
    }
    else {
      res.status(404).json({message: "can not add follow"})
    }
  })

  app.get('/api/users/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);
    
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});






  /* 
  ! Add Notifications
  */
  app.post("/api/posts/replies/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const { userId, replyTitle } = req.body;
    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId);
    const otherUserId = post.user;
    const otherUser = users.find(u => u.id === otherUserId);
    
  
    if (user && post) {
      // Generate a unique ID for the reply
      const replyId = Date.now(); // Or any other unique identifier generator
      
      // Add the reply to the post's replies array
      user.repliedPosts.push({ replyPostId: postId });
      const newReply = {
        replyId,
        replyTitle,
        userId: user.id, // Store only the user's ID
        profilePic: user.profilePic, // Store necessary fields only
        displayName: user.displayName, // Store necessary fields only
        likes: [],
        retweets: [],
        saves: [],
      };
  
      // Add the reply to the post's replies array
      post.replies.push(newReply);
      const newNotification = {type: "reply", sender: userId, reference: newReply.replyId};
      otherUser.notifications.push(newNotification);
  
      res.status(200).json({ message: "Reply added", post, user });
    } else {
      res.status(404).json({ message: "Post or user not found" });
    }
  });

  /* 
  ! Add Notifications
  */
  app.post("/api/posts/retweets/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const {userId} = req.body;

    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId)

    if (post) {
      if(!post.retweets.includes(userId)) {
        post.retweets.push(userId);
        user.retweetedposts.push(postId)
        res.status(200).json({ message: "Retweet added", post, user });
      }
      else {
        post.retweets = post.retweets.filter(id => id !== userId)
        user.retweetedposts = user.retweetedposts.filter(id => id !== postId)
        res.status(200).json({ message: "Rewteet removed", post, user })
      }
    }
    else {
      res.status(404).json({message: "can not add Save"})
    }
  })

  app.post("/api/posts/saves/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const {userId} = req.body;

    const post = posts.find(p => p.id === postId);
    const user = users.find(u => u.id === userId)

    if (post) {
      if(!post.saves.includes(userId)) {
        post.saves.push(userId);
        user.savedposts.push(postId)
        res.status(200).json({ message: "Retweet added", post, user });
      }
      else {
        post.saves = post.saves.filter(id => id !== userId)
        user.savedposts = user.savedposts.filter(id => id !== postId)
        res.status(200).json({ message: "Save removed", post, user })
      }
    }
    else {
      res.status(404).json({message: "can not add Save"})
    }
  })

  app.get("/api/notifications", (req, res) => {
    const {currentUser} = req.body;
    const currentUserId = currentUser.id;

    

  })







    app.delete('/api/posts/:id', (req, res) => {
      const postId = req.params.id; // Get the ID from the URL
      const {user} = req.body

      const post = posts.find(post => post.id === postId);
      if (!post) {
        return res.status(404).json({message: "Post not Found"})
      };
      if (post.user !== user){
        return res.status(403).json({ message: "This isn't your post"})
      };

      posts = posts.filter(post => post.id !== parseInt(postId)); // Remove the post
      res.status(200).json({ message: 'Post deleted successfully' });
    });



    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    }); 