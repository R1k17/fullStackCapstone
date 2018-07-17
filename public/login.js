function loginPageElement(){
	return `
		<section id="userLoginPage>
			<h2>Sign In</h2>
			<section id="userLoginRow">
				<form id="login-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label for="username-input">Username:</label>
						<input type="text" name="username-input" id="username-input" required="true">
						<label for="password-input">Password:</label>
						<input type="password" name="password-input" id="password-input" required="true">
						<button>Login</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
			<p class="extra-text">New to Timeplaner?<b id="to-newUser" tabindex="0" role="button">Sign up</b></p>
		</section>
	`;
}

function loginPageListener(){
	// $('header').on('click', '#login-page-btn', function(event){
	$('#login-page-btn').on('click', function(event){
		event.preventDefault();
		$('#mainPage').html(loginPageElement());

		// underlinePageLabel(this);
  });
  // this func is for keyboard users only
	// $('header').on('keydown', '#login-page', function(event){
	// 	if(event.keyCode === 32 || event.keyCode === 13){
	// 		$('main').html(loginPageElement());

	// 		underlinePageLabel(this);
	// 	}
	// });
}

function loadHeader(){
	// loadRecentEntriesPage();
	// underlinePageLabel($('#home-page'));
	// loadRecentEntries();

	$('#mainHeader').html(`
		<p class="header" id="about-page-btn" tabindex="0">About</p>
		<p class="header" id="home-page-btn" tabindex="0">Home</p>
		<p class="header" id="login-page-btn" tabindex="0">Login</p>
	`);
}

function loginListener(){
	$('#login-form').on('submit', function(event){
		event.preventDefault();
		
		$.ajax({
			url: 'auth/login',
			data: JSON.stringify({
				username: $('[name="username-input"]').val(),
				password: $('[name="password-input"]').val()
			}),
			dataType: 'json',
			contentType: "application/json",
			type: 'POST',
			success: function(data){
				localStorage.setItem('prjToken', data.authToken);
				// logIn();
				console.log(data);
				
			},
			error: function(err){
				$('#password-username-error').html('Sorry, this username or password is incorrect!<br>Please try again.');
			}
		});
	});
}

function logIn(){
	// get user information
	$.ajax({
		url: '/users/logged',
		type: 'GET',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			refreshToken();

			profile_basics = data;
			month_profile_created = data.monthCreated;
			year_profile_created = data.yearCreated;

			loadAppHome();

			underlinePageLabel('#home-page');
		},
		error: function(){
			$('main').html(loginPageElement());
			$('#header-right').html(`
				<p id="about-page" tabindex="0" role="button">About</p>
				<p id="login-page" tabindex="0" role="button">Login</p>
			`);
			underlinePageLabel($('#login-page'));
		}
	});
}
function startLogin(){
	loadHeader();
	loginPageListener();
	loginListener();
}

$(startLogin());