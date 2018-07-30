let user = 0;

function loginPageForm() {
	return `
		<section class="form-template" id="userLoginPage">
			<h2 class="signIn-elem">Sign In</h2>
			<section id="userLoginRow">
				<form id="login-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label class="signIn-elem" for="username-input">Username</label>
						<input aria-label="Username" class="form-input-field" type="text" name="username-input" id="username-input" required="true">
						<label class="signIn-elem" for="password-input">Password</label>
						<input aria-label="Password" class="form-input-field" type="password" name="password-input" id="password-input" required="true">
						<button alt="Button to log into the app" aria-label="Login button" class="signIn-elem greenBtn login-btn">Login</button>
						<p id="password-username-error"></p>
					</fieldset>
				</form>
			</section>
			<p class="extra-text">New to Timeplaner?<b alt="Button to sign up a new user" aria-label="Sign up button" id="sign-up" tabindex="0" role="button"> Sign up</b></p>
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
		<p aria-label="App name" alt="Displaying the app name" class="header" id="appName" tabindex="0"></i><br>Horarium</p>
	`);
}

function loadLoginForm() {
	$('#mainPage').html(loginPageForm());
}

function loginListener() {
	$('#login-form').on('submit', function(event) {
		event.preventDefault();
		
		$.ajax({
			url: 'api/auth/login',
			data: JSON.stringify({
				username: $('[name="username-input"]').val(),
				password: $('[name="password-input"]').val()
			}),
			dataType: 'json',
			contentType: "application/json",
			type: 'POST',
			success: function(data) {
				localStorage.setItem('prjToken', data.authToken);
				logIn();
			},
			error: function(err) {
				$('#password-username-error').html('Sorry, this username or password is incorrect!<br>Please try again.');
			}
		});
	});
}

function refreshToken(){
	$.ajax({
		url: 'api/auth/refresh',
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			localStorage.setItem('prjToken', data.authToken);
		}
	});
}

function selectEndpointForm() {
	return `
		<div class="gridContainer-home">
			<div alt="Button to list all employees" aria-label="Team button" class="select-endpoint gridItem-emp">
				<p class="select-endpoint-icon"><i class="fa fa-users"></i></p>
				<p class="select-endpoint-text">Team</p>
			</div>
			<div alt="Button to show the timetable" aria-label="Timetable button" class="select-endpoint gridItem-tt">
				<p class="select-endpoint-icon"><i class="fa fa-calendar"></i></p>
				<p class="select-endpoint-text">Schedule</p>
			</div>
		</div>
	`
}

function endpointBtnListener(userData) {
	$('.gridItem-emp, #employees-page-btn').on('click', function() {
		getEmployeesFromAPI(displayAllEmployees);
		getEmployeesListFromAPI();
		loadMainHeader(userData);
		newEmpBtnListener();
		activateNewEmpBtn();
	})
	$('.gridItem-tt, #timeTable-page-btn').on('click', function() {
		getTimeTablesFromAPI(displayAllTimeTables);
		getEmployeesListFromAPI();
		loadMainHeader(userData);
		deactivateNewEmpBtn();
	})
}

function accountPageForm(userData) {
	return `
	<div class="account-template">
		<h2>${userData.username}</h2>
		<h3>Settings</h3>
		<div>
			<span alt="Showing Username of logged in user" aria-label="username" class="account-elems">Username: ${userData.username}</span>
			<span alt="Showing users firstname" aria-label="firstname" class="account-elems">Firstname: ${userData.firstName}</span>
			<span alt="Showing users lastname" aria-label="lastname" class="account-elems">Lastname: ${userData.lastName}</span>
			<span alt="Delete button to delete user" aria-label="Delete user" class="account-btns submit-form-btn redBtn" id="delete-account-btn">delete</span>
			<span alt="Logout button" aria-label="Logout button" class="account-btns submit-form-btn greyBtn" id="logout-account-btn">logout</span>
		</div>
	</div>
	`
}

function deleteAccount(userData) {
	$.ajax({
		url: 'api/users/' + userData.id,
		type: 'DELETE',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			localStorage.removeItem('prjToken');
			location.reload();
		}
	});
}

function deleteAccountListener(userData) {
	$('#delete-account-btn').on('click', function() {
		if(confirm('You are about to delete your Account permenantly! Are you sure you want to delete your Account?')){
			deleteAccount(userData);		
		}
		
	})
}

function logoutBtnListener() {
	$('#logout-account-btn').on('click', function(){
		localStorage.removeItem('prjToken');
		location.reload();
	});
}

function homePageBtnListener(userData) {
	$('#home-page-btn').on('click', function() {
		loadHomeScreen(userData);
		deactivateNewEmpBtn();
	})
}

function accountPageListener(userData) {
	$('#account-page-btn').on('click', function() {
		$('#account-page-btn').addClass('header active-header-btn')
		$('#mainPage').html(accountPageForm(userData));
		
		deleteAccountListener(userData);
		logoutBtnListener();
		deactivateNewEmpBtn();
	})
}

function loadMainHeader(userData) {
	$('#mainHeader').html(`
		<p aria-label="homepage" alt="Button to load the homepage" class="header" id="home-page-btn" tabindex="0"><i class="fa fa-home"></i><br>Home</p>
		<p aria-label="employees page" alt="Button to load a list of all employees" class="header" id="employees-page-btn"><i class="fa fa-users"></i><br>Team</p>
		<p aria-label="timetable page" alt="Button to load the timetable" class="header" id="timeTable-page-btn"><i class="fa fa-calendar"></i><br>Schedule</p>
		<p aria-label="account page" alt="Button to load the account page of the user" class="header" id="account-page-btn" tabindex="0"><i class="fa fa-cog"></i><br>Account</p>
`);
	endpointBtnListener(userData);
	homePageBtnListener(userData);
	accountPageListener(userData);
}

function loadHomeScreen(userData) {
	loadMainHeader(userData);
	user = userData;

	$('#mainPage').html(selectEndpointForm());
	endpointBtnListener(userData);
}

function logIn() {
	$.ajax({
		url: 'api/users/account',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data) {
			refreshToken();

			const userData = data;
			loadHomeScreen(userData);
			watchNavBtns();
		},
		error: function() {
			$('#mainPage').html(loginPageForm());
		}
	})
}

function signUpPageListener() {
	$('#sign-up').on('click', function() {
		$('#userLoginPage').html(signUpForm());
		createAccountListener();
		cancelAccountSignUpListener();
	});
}


function signUpForm() {
	return `
			<h2 class="signIn-elem">Sign Up</h2>
			<section id="signUpnewUser">
				<form id="submit-form" method="" action="">
					<fieldset>
						<legend></legend>
						<label class="signIn-elem" for="username">Username</label>
						<input aria-label="Username" class="form-input-field" type="text" name="username" id="username" required="true">
						<label class="signIn-elem" for="firstName">First name</label>
						<input aria-label="User Firstname" class="form-input-field" type="text" name="firstName" id="firstName" required="true">
						<label class="signIn-elem" for="lastName">Last name</label>
						<input aria-label="User lastname" class="form-input-field" type="text" name="lastName" id="lastName" required="true">
						<label class="signIn-elem" for="password">Password</label>
						<input aria-label="User password" class="form-input-field" type="password" name="password" id="password" required="true">
						<label class="signIn-elem" for="password-2">Re-type Password</label>
						<input aria-label="User password confirm" class="form-input-field" type="password" name="password-2" id="password-2" required="true">
						<button alt="Button to sign up as a new user" aria-label="Sign up button" class="submit-form-btn greenBtn">Submit</button>
						<button alt="Button to cancel the sign up process" aria-label="Cancel sign up button" type="button" id="cancel-button" class="greyBtn submit-form-btn">Cancel</button>
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
				$('#mainPage').html(`
					<div id="new-account-success">
						<p class="extra-text">Acount was successfully created!</p>
						<button alt="Button to start login process" aria-label="login button" class="button-blue" onclick="location.reload()">Login</button>
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
		$('#mainPage').html(loadLoginForm());
		signUpPageListener();
	});
};