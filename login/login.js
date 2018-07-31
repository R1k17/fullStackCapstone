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
	$('#login-page-btn').on('click', function(){
    $('#mainPage').html(loginPageElement());
  });
}

function loginListener(){
	$('.mainPage').on('submit', '#login-form', function(event){
		event.preventDefault();

		$.ajax({
			url: 'auth/login',
			data: {
				username: $('[name="username-input"]').val(),
				password: $('[name="password-input"]').val()
			},
			type: 'POST',
			success: function(data){
				localStorage.setItem('prjToken', data.authToken);
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

function loadHeader(){
	$('#mainHeader').html(`
		<p id="about-page-btn" tabindex="0">About</p>
		<p id="home-page-btn" tabindex="0">Home</p>
		<p id="login-page-btn" tabindex="0">Login</p>
	`);
}

function startLogin(){
	loginPageListener();
}

$(startLogin());