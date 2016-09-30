(function()
{
	this.login = {
		AUTHOR: "Philipp Heidrich"
	}


	/**
	 *
	 *	Inital functions
	 *
	 */

	/**
	 *	Inital Desktop
	 */
	login.init = function()
	{
		// Starte Screen
		login.init_showScreen();

		// Show right content
		login.init_showContent();

		// Add events
		login.init_addEvents();
	}


	/**
	 *	Start login screen
	 */
	login.init_showScreen = function()
 	{
		// Change Module
		class_module.changeModule(login.obj.content);
 	}


	/**
	 *	Show right content
	 */
	login.init_showContent = function()
	{
		var lastlogin = class_user.getCurrentUser();

		// Show change user button
		if(lastlogin)
		{
			var allUsers = class_user.getAllUsers();
			login.currentUser = allUsers[lastlogin];

			// Print user name
			login.obj.show_name.innerHTML = login.currentUser.name;

			// Check have this user a password
			if(login.currentUser.pwd)
			{
				login.obj.showbox_password.className += ' login__area--active';
				login.obj.showbox_password_input.select();
			}
			else

			// Check have user no password
			{
				login.obj.showbox_button.className += ' login__area--active';
			}

			// Show login box
			login.obj.loginbox_withAccount.className += ' login__box--active';

			// Check how many account exits
			if(allUsers.length > 1)
			{
				login.obj.showbox_changeUser.className += ' login__changeUser--active';
			}
			else {
				login.obj.showbox_changeUser.className = login.obj.showbox_changeUser.className.replace(' login__changeUser--active', '');
			}
		}

		// No account found
		else
		{
			login.obj.loginbox_noAccount.className += ' login__box--active';

			// Select username field
			login.obj.noUser_input_name.select();
		}
	}


	/**
	 *	Add eventlistener
	 */
	login.init_addEvents = function()
	{
		// Event keypress password input field
		login.obj.showbox_password_input.addEventListener('keyup', function(event)
		{
			checkPwd();
		});

		// Event onclick login button
		login.obj.showbox_button.addEventListener('click', function()
		{
			goLogin();
		});

		// Event onsubmit noUser form
		login.obj.noUser_form.addEventListener('submit', function(event)
		{
			event.preventDefault();
			return false;
		});

		// Click event: change button
		login.obj.showbox_changeUser_btn.addEventListener('click', function()
		{
			changeUser();
		});
	}






	/**
	 *
	 *	Boot functions
	 *
	 */

	 /**
 	 *	Start login boot
 	 */
 	login.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load login...');

 		// Lade HTML
		boot.printBootMessage('&#10142; load objects');
 		login.obj = {
 			wrapper: document.querySelector('#wrapper'),
 			content: document.querySelector('.login'),
 			show_name: document.querySelector('.login .js__showName'),
			loginbox_withAccount: document.querySelector('.login .login__box.login__box--withUser'),
			loginbox_noAccount: document.querySelector('.login .login__box.login__box--noUser'),
 			showbox_password: document.querySelector('.login .login__area--password'),
			showbox_password_input: document.querySelector('.login .login__inputField'),
 			showbox_button: document.querySelector('.login .login__area--button'),
			showbox_changeUser: document.querySelector('.login .login__changeUser'),
			showbox_changeUser_btn: document.querySelector('.login .login__changUserBtn'),
			noUser_input_name: document.querySelector('.login .js__noUserInput_name'),
			noUser_input_pwd: document.querySelector('.login .js__noUserInput_pwd'),
			noUser_form: document.querySelector('.login .js__noUserForm')
 		}

 		login.status = {};

		boot.printBootMessage('<br>');
 	}







	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Ceck is this the right pwd
	 */
	function checkPwd()
	{
		var pwd 	= login.obj.showbox_password_input.value,
			pwdHash = login.user.pwd;

		// Pwd is correct
		if(class_user.checkPwd(pwd, pwdHash))
		{
			goLogin();
		}
	}


	/**
	 *	Login and show desktop
	 */
	function goLogin()
	{
		class_user.saveCurrentUser(login.currentUser.id);

		// Show desktop
		desktop.init();
	}


	/**
	 *	Change user
	 */
	function changeUser()
	{
		// Remove activ class
		login.obj.loginbox_withAccount.className = login.obj.loginbox_withAccount.className.replace(' login__box--active');

		// Set new active class
		login.obj.loginbox_noAccount.className += ' login__box--active';
	}






}).call(this);
