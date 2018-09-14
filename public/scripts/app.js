function startApp() {
  watchNavBtns();
  watchEmployeeSubmit();
  generateUpdateQuery();

	landingPageHeader();
	loadLandingPage();
	landingPageListeners()
	
	loginPageListener();
	loginListener();
	homePageBtnListener();
	signUpPageListener();
}

$(startApp());