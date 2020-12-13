(() => {
	const db = firebase.database();
	const tweetsDB = db.ref('/tweets');
	const postContainer = document.getElementById('post-container');
	const newPost = document.getElementById('new-post');
	const post = data => {
		const state = data.val();

		return `<figure class="profile-avatar post-section-avatar">
              <img src="images/avatar.png" alt="BP" class="profile-image">
          </figure>
          <div class="post-content">
              <div class="post-author">
                  <h3 class="post-author-name">${state.username}</h3>
                  <span class="post-delimiter fa fa-circle"></span>
                  <span class="post-date">${time_ago(new Date(state.date))}</span>
              </div>
              <p class="post-text">${state.message}</p>
              <div class="post-footer">
                  <div class="post-reaction">
                      <button class="far fa-thumbs-up like-btn" data-id="${data.key}"></button>
                      <span class="post-likes">${state.likes}</span>
                  </div>

                  <div class="post-reaction dislike-container">
                      <button class="far fa-thumbs-down dislike-btn" data-id="${data.key}"></button>
                      <span class="post-dislikes">${state.dislikes}</span>
                  </div>
              </div>
          </div>
          <div class="post-close">
              <button class="post-close fa fa-times" data-id="${data.key}"></button>
          </div>`;
	};

	window.onload = function() {
		var elem = document.getElementById("loader");
		elem.parentElement.removeChild(elem);
	}

	newPostForm.addEventListener('submit', event => {
		// Logic when posting new tweet
		event.preventDefault();
		tweet.post(newPost.value);
		
		let TweetsBox = document.getElementById("profile-posts-count");
		TweetsBox.innerHTML = +TweetsBox.innerHTML + 1;

		newPost.value = '';
	});

	firebase.auth().onAuthStateChanged(user => {
		// Update profile posts information
		const info = auth.getUserStats(user.uid);

		info.once('value').then((snapshot) => {			
			var tweets = (snapshot.val() && snapshot.val().tweets) || 0;
			var likes = (snapshot.val() && snapshot.val().likes) || 0;

			let TweetsBox = document.getElementById("profile-posts-count");
			let LikesBox = document.getElementById("profile-likes-count");
			let ProfileNameBox = document.getElementById("profile-name");

			TweetsBox.innerHTML = tweets;
			LikesBox.innerHTML = likes;
			ProfileNameBox.innerHTML = user.displayName;	
		});
	});

	tweetsDB.on('child_added', data => {
		if (!validateUser()) {
			return;
		}

		const loader = document.getElementById('loader');
		loader.style.display = 'none';

		let container = document.createElement("div");
		container.classList.add("post");

		let CreatedPost = post(data);
		container.innerHTML = CreatedPost;

		let PostContainer = document.getElementById('post-container');
		PostContainer.appendChild(container);

		let LikeButton = document.querySelectorAll(`[data-id="${data.key}"]`)[0];
		let DislikeButton = document.querySelectorAll(`[data-id="${data.key}"]`)[1];
		let RemoveButton = document.querySelectorAll(`[data-id="${data.key}"]`)[2];

		RemoveButton.addEventListener('click', event => {
			event.preventDefault();

			const RefTweets = db.ref('tweets/' + data.key);

			RefTweets.once('value').then((snapshot) => {
				var UserIdPost = (snapshot.val() && snapshot.val().userId) || 0;
				var LikesPost = (snapshot.val() && snapshot.val().likes) || 0;
				var DislikesPost = (snapshot.val() && snapshot.val().dislikes) || 0;

				var CurrentUserId = firebase.auth().currentUser.uid;
				if (UserIdPost === CurrentUserId) {
					const dbRefUser = auth.getUserStats(CurrentUserId);

					dbRefUser.once('value').then((snapshot) => {
						var LikesUser = (snapshot.val() && snapshot.val().likes) || 0;
						var TweetsUser = (snapshot.val() && snapshot.val().tweets) || 0;
						dbRefUser.update({ tweets: TweetsUser - 1, likes: LikesUser - DislikesPost - LikesPost });
						let TweetsBox = document.getElementById("profile-posts-count");
						let LikesBox = document.getElementById("profile-likes-count");
						TweetsBox.innerHTML = +TweetsBox.innerHTML - 1;
						LikesBox.innerHTML = +LikesBox.innerHTML - (DislikesPost + LikesPost);
					});
					
					tweet.delete(data.key);
					PostContainer.removeChild(event.target.parentNode.parentNode);
				}
			});			
		})

		LikeButton.addEventListener('click', event => {
			event.preventDefault();

			if (LikeButton.classList.contains("liked")) {
				LikeButton.classList.remove("liked");
				tweet.decrementLikes(data.key);
			} else {
				LikeButton.classList.add("liked");
				tweet.incrementLikes(data.key);
			}
		})

		DislikeButton.addEventListener('click', event => {
			event.preventDefault();

			if (DislikeButton.classList.contains("disliked")) {
				DislikeButton.classList.remove("disliked");
				tweet.decrementDislikes(data.key);
			} else {
				DislikeButton.classList.add("disliked");
				tweet.incrementDislikes(data.key);
			}
		})
	});

	tweetsDB.on('child_changed', data => {
		if (!validateUser()) return;

		document.querySelector(`.like-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().likes;
		document.querySelector(`.dislike-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().dislikes;
	
		this.auth.getUserStats(firebase.auth().currentUser.uid).once('value').then(data => {
			const {
				likes,
				tweets
			} = data.val();
			document.getElementById("profile-likes-count").innerText = likes;
			document.getElementById("profile-posts-count").innerText = tweets;
		});
	});

	function validateUser() {
		if (!firebase.auth().currentUser) {
			// user is not logged in
			window.location = 'index.html?error=accessDenied';
			return false;
		}

		return true;
	}


	// Helper function for converting time from milliseconds to human readable format
	function time_ago(time) {
		const time_formats = [
			[60, 'seconds', 1], // 60
			[120, '1 minute ago', '1 minute from now'], // 60*2
			[3600, 'minutes', 60], // 60*60, 60
			[7200, '1 hour ago', '1 hour from now'], // 60*60*2
			[86400, 'hours', 3600], // 60*60*24, 60*60
			[172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
			[604800, 'days', 86400], // 60*60*24*7, 60*60*24
			[1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
			[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
			[4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
			[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
			[58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
			[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
			[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
			[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
		];
		let seconds = (+new Date() - time) / 1000,
			token = 'ago',
			list_choice = 1;

		if (seconds === 0) {
			return 'Just now'
		}
		if (seconds < 0) {
			seconds = Math.abs(seconds);
			token = 'from now';
			list_choice = 2;
		}
		let i = 0,
			format;
		while (format = time_formats[i++])
			if (seconds < format[0]) {
				if (typeof format[2] === 'string')
					return format[list_choice];
				else
					return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
			}
		return time;
	}
})();
