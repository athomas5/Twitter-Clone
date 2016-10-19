// Head
var userHeader;

// Current User
var currentUser;

// Tweets
var tweetList;
var tweetContent;
var tweetUsername;

// Following
var followingList;
var followersList;

// Textfield
var targetUser;
var tweetInput;
var followInput;
var unfollowInput;

// Buttons
var switchButton;
var followButton;
var unfollowButton;
var tweetButton;

var backButton;
var forwardButton;

window.addEventListener('load', function() {
  // Head
  userHeader = document.querySelector('#current-user-header');

  // Tweets
  tweetList = document.querySelector('#tweet-list');
  tweetContent = document.querySelectorAll('#tweet-list.tweet.tweet-content');
  tweetUsername = document.querySelector('#tweet-list.tweet.tweet-username');

  // Following
  followingList = document.querySelector('#following-list')
  followersList = document.querySelector('#follower-list');

  // Textfield
  targetUser = document.querySelector('input[type=text]#switch-user-input');
  tweetInput = document.querySelector('textarea#tweet-input');
  followInput = document.querySelector('input[type=text]#follow-input');
  unfollowInput = document.querySelector('input[type=text]#unfollow-input');

  // Buttons
  switchButton = document.querySelector('button#switch-user-button');
  followButton = document.querySelector('button#follow-button');
  unfollowButton = document.querySelector('button#unfollow-button')
  tweetButton = document.querySelector('button#tweet-button');

  backButton = document.querySelector('button#back-button');
  forwardButton = document.querySelector('button#forward-button');

  // EventListener
  switchButton.addEventListener('click', switchUserInput);
  followButton.addEventListener('click', followUser);
  unfollowButton.addEventListener('click', unfollowUser);
  tweetButton.addEventListener('click', postTweet);
});

function goBack(e) {
  window.history.back();
}

function goForward(e) {
  window.history.forward();
}

function switchUser(user) {
  // Switch current User
  currentUser = user;

  // Reset User Input
  targetUser.value = '';
  targetUser.placeholder = 'User';


  // Display Timeline
  user.clearTimeline();
  user.displayTimeline();

  // Display Following
  user.clearFollowing();
  user.displayFollowing();

  // Display Followers
  user.clearFollowers();
  user.displayFollowers();
}

function switchUserInput(e) {
  if (targetUser.value !== currentUser && targetUser.value !== undefined) {
    // Create new User
    var userObject = getUser(targetUser.value);
    userHeader.textContent = targetUser.value;
    switchUser(userObject);
  }
  else {
    targetUser.value = '';
    targetUser.placeholder = 'User';
  }
}

function switchUserLink(e) {
  var userObject = getUser(this.textContent);
  userHeader.textContent = this.textContent;
  switchUser(userObject);
}

User.prototype.clearTimeline = function() {
  while (tweetList.hasChildNodes()) {
    tweetList.removeChild(tweetList.firstChild);
  }
}

User.prototype.displayTimeline = function() {
  for (var i =  0; i < this.timeline.length; i++) {
    var tweet = this.timeline[i];

    // Tweet content
    var li = document.createElement('li');
    li.className = 'tweet';
    // li.className = 'list-group-item';
    var pContent = document.createElement('p');
    pContent.className = 'tweet-content';
    pContent.textContent = tweet.tweet;

    // Tweet name
    var pName = document.createElement('p');
    pName.className = 'tweet-username';
    pName.textContent = tweet.username;

    li.appendChild(pName);
    li.appendChild(pContent);
    tweetList.appendChild(li);
  }
}

User.prototype.clearFollowing = function() {
  while (followingList.hasChildNodes()) {
    followingList.removeChild(followingList.firstChild);
  }
}

User.prototype.displayFollowing = function() {
  for (var i = 0; i < this.following.length; i++) {
    var following = this.following[i];

    var li = document.createElement('li');
    li.className = 'following';
    var a = document.createElement('a');
    a.textContent = following.username;
    li.appendChild(a);
    followingList.appendChild(li);

    registerEventListener(a);
  }
}

User.prototype.clearFollowers = function() {
  while (followersList.hasChildNodes()) {
    followersList.removeChild(followersList.firstChild);
  }
}

User.prototype.displayFollowers = function() {
  for (var i = 0; i < this.followers.length; i++) {
    var follower = this.followers[i];

    var li = document.createElement('li');
    li.className = 'follower';
    var a = document.createElement('a');
    a.textContent = follower.username;
    li.appendChild(a);
    followersList.appendChild(li);

    registerEventListener(a);
  }
}

function postTweet(e) {
  var content = tweetInput.value;
  tweetInput.value = '';
  tweetInput.placeholder = 'What\'s Happening? ';

  if (validTweet(content) && currentUser !== undefined) {
    // Add tweet to users + followers timeline
    currentUser.tweet(content);
    tweetObject = currentUser.timeline[0];

    // Tweet content
    var li = document.createElement('li');
    li.className = 'tweet';
    // li.className = 'list-group-item';

    var pContent = document.createElement('p');
    pContent.className = 'tweet-content';
    pContent.textContent = content;

    // Tweet name
    var pName = document.createElement('p');
    pName.className = 'tweet-username';
    pName.textContent = currentUser.username;

    li.appendChild(pName);
    li.appendChild(pContent);
    tweetList.insertBefore(li, tweetList.childNodes[0]);
  }
}

function followUser(e) {
  var userToFollow = followInput.value;

  if (userToFollow !== '' && userToFollow !== currentUser
    && userToFollow !== undefined && currentUser !== undefined) {
    var followObject = getUser(userToFollow);

    if (currentUser.follow(followObject)) {
      currentUser.follow(followObject);
      var li = document.createElement('li');
      li.className = 'following';
      li.id = followInput.value;
      var a = document.createElement('a');
      a.textContent = userToFollow;
      li.appendChild(a);
      followingList.appendChild(li);

      registerEventListener(a);
    }
  }
  followInput.value = '';
  followInput.placeholder = 'Username';
}

function unfollowUser(e) {
  var userToUnfollow = unfollowInput.value;

  if (userToUnfollow !== '' && userToUnfollow !== currentUser
    && userToUnfollow !== undefined && currentUser !== undefined) {
    var unfollowObject = getUser(userToUnfollow);
    console.log(currentUser.following);

    if (currentUser.following.indexOf(unfollowObject) === -1) {
      alert('You are not following ' + unfollowInput.value);
    }
    else {
      currentUser.unfollow(unfollowObject);
      var userBeingFollowed = document.getElementById(unfollowInput.value);
      userBeingFollowed.remove();
    }
  }
  unfollowInput.value = '';
  unfollowInput.placeholder = 'Username';
}

function registerEventListener(item) {
  item.addEventListener('click', switchUserLink);
}

var users = {};

function getTweet(tweet_id) {
  for (var i = 0; i < tweets.length; i++) {
    if (tweets[i].id === tweet_id) {
      return tweets[i];
    }
  }
  return false;
}

function date() {
  var date = new Date();
  var year = date.getUTCFullYear().toString();
  var month = pad(date.getUTCMonth() + 1, 2);
  var day = pad(date.getUTCDate(), 2);
  var hour = pad(date.getUTCHours(), 2);
  var minute = pad(date.getUTCMinutes(), 2);
  var second = pad(date.getUTCSeconds(), 2);

  return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
}

function getUser(username) {
  if(!users.hasOwnProperty(username)) {
    users[username] = new User(username);
  }
  return users[username];
}

function objectWithProperty(key, value) {
  return function(object) {
    return object[key] === value;
  }
}

function objectProperty(key) {
  return function(object) {
    return object[key];
  }
}

function notEquals(rhs) {
  return function(lhs) {
    return lhs !== rhs;
  }
}

function pad(number, length) {
  number = number.toString();

  return Array(1 + length - number.length).join('0') + number;
}

function randomId() {
  return 100000 + Math.floor(Math.random() * 100000)
}

function validUsername(username){
  return typeof username === 'string' && username !== '';
}

function validTweet(tweet) {
  return typeof tweet === 'string' && tweet !== '' && tweet.length <= 140;
}

function Tweet(content, username) {
  this.id = randomId();
  this.date = date();
  this.username = username;
  this.tweet = content;
  this.retweet = false;
  this.favorites = 0;
  this.favoritedBy = [];
}

Tweet.prototype.clone = function(retweet) {
  var clone = new Tweet(this.id, this.username);
  clone.id = this.id;
  clone.date = this.date;
  clone.favorites = this.favorites;
  clone.tweet = this.tweet;
  clone.retweet = retweet;
  return clone;
}

function User(username) {
  this.username = username;
  this.timeline = [];
  this.followers = [];
  this.following = [];
}

User.prototype.tweet = function(content) {
  if(!validTweet(content)) {
    return false;
  }
  var tweet = new Tweet(content, this.username);
  this.timeline.unshift(tweet);
  this.followers
    .map(function(user) {
      return user.timeline;
    })
    .forEach(function(timeline) {
      timeline.unshift(tweet.clone(false));
    });
  return tweet;
};

User.prototype.follow = function(user) {
  if(this === user) {
    return false;
  }
  if(this.following.indexOf(user) !== -1) {
    return false;
  }
  this.following.push(user);
  user.followers.push(this);
  return true;
};

User.prototype.getTimeline = function(options) {
  return this.timeline
    .filter(function(tweet) {
      return !options.hasOwnProperty('query') || tweet.tweet.indexOf(options.query) !== -1;
    })
    .filter(function(tweet) {
      return !options.hasOwnProperty('username') || tweet.username === options.username;
    });
};

User.prototype.unfollow = function(user) {
  if(this === user) {
    return false;
  }
  if(this.following.indexOf(user) === -1) {
    return false;
  }
  this.following = this.following.filter(notEquals(user));
  user.followers = user.followers.filter(notEquals(this));
  return true;
};

User.prototype.retweet = function(id) {
  var tweet = this.timeline.find(objectWithProperty('id', id));
  if(!tweet || tweet.username === this.username) {
    return false;
  }

  this.followers
    .filter(function(user) {
      return !user.timeline.find(objectWithProperty('id', id));
    })
    .map(objectProperty('timeline'))
    .forEach(function(timeline) {
      timeline.unshift(tweet.clone(true));
    });

  return true;
}

User.prototype.favorite = function(id) {
  var found = false;
  Object.keys(users)
    .map(function(username) {
      return users[username];
    })
    .map(objectProperty('timeline'))
    .reduce(function(previous, current) {
      return previous.concat(current);
    }, [])
    .filter(function(tweet) {
      return tweet.id === id;
    })
    .forEach(function(tweet) {
      tweet.favorites++;
      // tweet.favoritedBy.push(this);
      found = true;
    });
  return found;
}

User.prototype.unfavorite = function(id) {
  var found = false;
  Object.keys(users)
    .map(function(username) {
      return users[username];
    })
    .map(objectProperty('timeline'))
    .reduce(function(previous, current) {
      return previous.concat(current);
    }, [])
    .filter(function(tweet) {
      return tweet.id === id;
    })
    .forEach(function(tweet) {
      if (tweet.favorites > 0) {
        tweet.favorites--;
        // tweet.favoritedBy = tweet.favoritedBy.filter(notEquals(this));
        found = true;
      }
      else {
        return false;
      }
    });
  return found;
}


/*
 * @function
 * @name timeline
 * The timeline function will return an array of tweets representing the
 * timeline for a given username.
 *
 * @param   {string} user   The username whose timeline to return.
 * @param   {Object} [options]  Optional options object to customize behavior.
 * @returns {Tweet[]|false}     Array of tweet objects representing the timeline
 * of the user. Alternatively, false will be returned if the username is not a
 * valid string.
 */
function timeline(user, options) {
  if(!validUsername(user)) {
    return false;
  }
  var userObject = getUser(user);
  return userObject.getTimeline(options || {});
}

/*
 * @function
 * @name follow
 * The follow function allows the follower to receive future tweets from the
 * user.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully followed and false
 * if not.
 */
function follow(follower, user) {
  if(!validUsername(follower) || !validUsername(user)) {
    return false;
  }
  var followerObject = getUser(follower);
  var userObject = getUser(user);
  return followerObject.follow(userObject);
}

/* @function
 * @name unfollow
 * The unfollow function is the inverse of {@link follow}. After unfollowing,
 * future tweets from user will not show up in follower's timeline.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully unfollowed and false
 * if not.
 */
function unfollow(follower, user) {
  if(!validUsername(follower) || !validUsername(user)) {
    return false;
  }
  var followerObject = getUser(follower);
  var userObject = getUser(user);
  return followerObject.unfollow(userObject);
}

/*
 * @function
 * @name tweet
 * This function will add a tweet for a given user. Tweeting will add a tweet
 * to each followers timeline, including the user doing the tweeting.
 *
 * @param   {string} user     The user tweeting.
 * @param   {string} content  The tweet content.
 * @returns {Tweet|false}     Returns a tweet object or false in the case of a
 * failure.
 */
function tweet(user, content) {
  if(!validUsername(user) || !validTweet(content)) {
    return false;
  }
  return getUser(user).tweet(content);
}

/*
 * @function
 * @name retweet
 * Retweeting allows followers to share another user's tweets with their own
 * followers.
 *
 * @param   {string} retweeter  The user performing the retweet.
 * @param   {number} tweet_id   The tweet ID being retweeted.
 * @returns {boolean}           True if successful, false if not successful.
 */
function retweet(retweeter, tweet_id) {
  if(!validUsername(retweeter)) {
    return false;
  }
  var user = getUser(retweeter);
  return user.retweet(tweet_id);
}

/*
 * @function
 * @name favorite
 * Increments the favorite count of the tweet with the corresponding ID.
 *
 * @param   {number} tweet_id ID of tweet to favorite.
 * @returns {boolean}         True if successful, false if not successful.
 */
function favorite(tweet_id) {
  return User.favorite(tweet_id);
}

function unfavorite(tweet_id) {
  return User.unfavorite(tweet_id);
}
