function loginPageForm() {
	return `
		<section id="userLoginPage">
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
			<p class="extra-text">New to Timeplaner?<b id="sign-up" tabindex="0" role="button">Sign up</b></p>
		</section>
	`;
}

function loginPageListener() {
	$('#login-page-btn').on('click', function() {
		$('#mainPage').html(loadLoginForm());
	});
}

function loadHeader() {
	$('#mainHeader').html(`
		<p class="header" id="about-page-btn" tabindex="0">About</p>
		<p class="header" id="home-page-btn" tabindex="0">Home</p>
		<p class="header" id="login-page-btn" tabindex="0">Login</p>
	`);
}

function loadLoginForm() {
	$('.mainPage').html(loginPageForm());
}

function loginListener() {
	$('#login-form').on('submit', function(event) {
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
			success: function(data) {
				localStorage.setItem('prjToken', data.authToken);
				// logIn();
				console.log(data);
				
			},
			error: function(err) {
				$('#password-username-error').html('Sorry, this username or password is incorrect!<br>Please try again.');
			}
		});
	});
}

function logIn() {
	// get user information
	$.ajax({
		url: '/users/logged',
		type: 'GET',
		beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data) {
			refreshToken();

			profile_basics = data;
			month_profile_created = data.monthCreated;
			year_profile_created = data.yearCreated;

			loadAppHome();

			underlinePageLabel('#home-page');
		},
		error: function() {
			$('main').html(loginPageForm());
			$('#header-right').html(`
				<p id="about-page" tabindex="0" role="button">About</p>
				<p id="login-page" tabindex="0" role="button">Login</p>
			`);
			underlinePageLabel($('#login-page'));
		}
	});
}
// function createAccountPageListener() {
function signUpPageListener() {
	$('#sign-up').on('click', function() {
		$('#userLoginPage').html(signUpForm());
		createAccountListener();
		cancelAccountSignUpListener();
	});
}

// function createAccountElement() {
{/* <label for="firstName">First Name:</label>
<input type="text" name="firstName" id="firstName" required="true">
<label for="lastName">Last Name:</label>
<input type="text" name="lastName" id="lastName" required="true"> */}

function signUpForm() {
	return `
			<h2>Sign Up</h2>
			<section id="signUpnewUser">
				<form id="submit-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label for="username">Username:</label>
						<input type="text" name="username" id="username" required="true">
						<label for="password">Password:</label>
						<input type="password" name="password" id="password" required="true">
						<label for="password-2">Re-type Password:</label>
						<input type="password" name="password-2" id="password-2" required="true">
						<button class="submit-form-btn updateBtn">Submit</button>
						<button type="button" id="cancel-button" class="submit-form-btn deleteBtn">Cancel</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
		`;
}

function createAccountListener() {
	$('#submit-form').on('submit', function(event) {
		event.preventDefault();

		if($('[name="password"]').val() !== $('[name="password-2"]').val()) {
			$('#password-username-error').html(`Passwords have to match! Please try again.`);
			return;
		}

		$.ajax({
			url: '/api/users',
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({
				firstName: $('[name="firstName"]').val(),
				lastName: $('[name="lastName"]').val(),
				username: $('[name="username"]').val(),
				password: $('[name="password"]').val()
			}),
			success: function(data) {
				$('.mainPage').html(`
					<div id="new-account-success">
						<p class="extra-text">Acount was successfully created!</p>
						<button class="button-blue" onclick="location.reload()">Login</button>
					</div>
				`);
			},
			error: function(err) {
				$('#password-username-error').html('Sorry, this username is taken or the password is invalid. <br>Passwords should be a minimum of 10 characters in length.');
			}
		});
	});
}

function cancelAccountSignUpListener() {
	$('#cancel-button').on('click', function() {
		console.log('cancel is clicked');
		// $('.mainPage').html(loadLoginForm());
	});
};

function startLogin() {
	loadHeader();
	// loadLoginForm with the header or on page start?
	loadLoginForm();
	loginPageListener();
	loginListener();

	signUpPageListener();
	// createAccountListener();
	// cancelAccountSignUpListener()
}

$(startLogin());