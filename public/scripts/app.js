function startApp() {
  watchNavBtns();
  watchEmployeeSubmit();
  generateUpdateQuery();
  loadHeader();
	loadLoginForm();
	loginPageListener();
	loginListener();
	homePageBtnListener();
	signUpPageListener();
}

$(startApp());