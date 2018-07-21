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
		<p class="header" id="about-page-btn" tabindex="0"><i class="fa fa-info-circle"></i><br>About</p>
		<p class="header" id="home-page-btn" tabindex="0"><i class="fa fa-home"></i><br>Home</p>	
		<p class="header" id="login-page-btn" tabindex="0"><i class="fa fa-paper-plane"></i><br>Login</p>
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
			<div class="select-endpoint gridItem-emp">
				<p class="select-endpoint-icon"><i class="fa fa-users"></i></p>
				<p class="select-endpoint-text">Team</p>
			</div>
			<div class="select-endpoint gridItem-tt">
				<p class="select-endpoint-icon"><i class="fa fa-calendar"></i></p>
				<p class="select-endpoint-text">Schedule</p>
			</div>
		</div>
	`
}

function endpointBtnListener() {
	$('.gridItem-emp').on('click', function() {
		console.log('employees');
		getEmployeesFromAPI(displayAllEmployees);
    	getEmployeesListFromAPI();
		
	})
	$('.gridItem-tt').on('click', function() {
		console.log('timeTable');
		getTimeTablesFromAPI(displayAllTimeTables);
		getEmployeesListFromAPI();
	})
}

function accountPageForm() {
	console.log(userData);
	
	return `
	<h2>${userData.username}</h2>
	<h3>Settings</h3>
	<div>
		<span>Username: ${userData.username}</span>
		<span>Firstname: ${userData.firstName}</span>
		<span>Lastname: ${userData.lastName}</span>
		<span id="delete-account-btn">delete</span>
		<span id="logout-account-btn">logout</span>
	</div>
	`
}

function deleteAccount() {
	$.ajax({
		url: 'api/users/' + userData.id,
		type: 'DELETE',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data){
			localStorage.removeItem('prjToken');
			location.reload();
		}
	});
}

function deleteAccountListener() {
	$('#delete-account-btn').on('click', function() {
		if(confirm('You are about to delete your Account permenantly! Are you sure you want to delete your Account?')){
			deleteAccount();		
		}
		
	})
}

function logoutBtnListener() {
	$('#logout-account-btn').on('click', function(){
		localStorage.removeItem('prjToken');
		location.reload();
	});
}

function homePageBtnListener() {
	$('#home-page-btn').on('click', function() {
		loadHomeScreen();
		
	})
}

function accountPageListener() {
	$('#account-page-btn').on('click', function() {
		// set btn active
		$()
		$('#account-page-btn').attr('class', 'header active-header-btn')
		// set all other btns non-active
		// load page
		$('#mainPage').html(accountPageForm());
		// see account firstName/lastName
		// see username
		// logoutBtn
		//deleteBtn
		deleteAccountListener();
		logoutBtnListener();
		
	})
}

function loadHomeScreen() {
	// update navBar with buttons for home, user, about
		$('#mainHeader').html(`
			<p class="header" id="about-page-btn" tabindex="0"><i class="fa fa-info-circle"></i><br>About</p>
			<p class="header" id="home-page-btn" tabindex="0"><i class="fa fa-home"></i><br>Home</p>
			<p class="header" id="employees-page-btn"><i class="fa fa-users"></i><br>Team</p>
			<p class="header" id="timeTable-page-btn"><i class="fa fa-calendar"></i><br>Schedule</p>
			<p class="header" id="account-page-btn" tabindex="0"><i class="fa fa-cog"></i><br>Account</p>
		`);
	

	$('#mainPage').html(selectEndpointForm());
	endpointBtnListener();
	accountPageListener();
}

// next create an employees and timetable listener, so both buttons are useable
function logIn() {
	// get user information
	$.ajax({
		url: 'api/protected',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('prjToken')}`);
		},
		success: function(data) {
			refreshToken();

			userData = data;
			loadHomeScreen();
			homePageBtnListener();
		},
		error: function() {
			$('#mainPage').html(loginPageForm());
			// $('#header-right').html(`
			// 	<p id="about-page" tabindex="0" role="button">About</p>
			// 	<p id="login-page" tabindex="0" role="button">Login</p>
			// `);
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
				$('#mainPage').html(`
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
		$('#mainPage').html(loadLoginForm());
		signUpPageListener();
	});
};

function startLogin() {
	// loadHeader();
	// loadLoginForm();
	// loginPageListener();
	// loginListener();
	// signUpPageListener();
	
	// loadLoginForm with the header or on page start?
	// homePageBtnListener()
	// deleteAccountListener()
	// createAccountListener();
	// cancelAccountSignUpListener()
}

$(startLogin());


/* 
Loading animation http://tobiasahlin.com/spinkit/

<div class="spinner">
  <div class="rect1"></div>
  <div class="rect2"></div>
  <div class="rect3"></div>
  <div class="rect4"></div>
  <div class="rect5"></div>
</div>

==================================================
==================================================
CSS
==================================================

.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
*/