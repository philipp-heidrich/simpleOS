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
			// Show user login
			showLoginUserBox(lastlogin);

			// Show user change button
			showLoginChangeButton();
		}

		// No account found
		else
		{
			showAllUsersBox();
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

		// Click event: change button
		login.obj.showbox_changeUserBtn.addEventListener('click', function()
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
			showbox_changeUserBtn: document.querySelector('.login .login__changUserBtn'),

			noUser_loginList: document.querySelector('.login .login__chooseUserList')
 		}

		// Load user functions
		boot.printBootMessage('&#10142; load user');
		class_user.removeLoginUser();

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
		var currentUser = class_user.getCurrentUser();
		if(currentUser)
		{
			var pwd 	= login.obj.showbox_password_input.value,
				pwdHash = class_user.getUser(currentUser).pwd;

			// Pwd is correct
			if(class_user.comparePwd(pwd, pwdHash))
			{
				goLogin();
			}
		}
	}


	/**
	 *	Login and show desktop
	 */
	function goLogin()
	{
		// Save new current user
		class_user.saveCurrentUser(login.currentUser.id);

		// Save login user
		class_user.setLoginUser(login.currentUser.id);

		// Show desktop
		desktop.init();
	}


	/**
	 *	Change user
	 */
	function changeUser()
	{
		showAllUsersBox();

		// Save no current user
		class_user.saveCurrentUser(false);
	}


	/**
	 *	Show all users
	 */
	function printAllUsers()
	{
		var allUsers 	= class_user.getAllUsers(),
			allObj		= [];

		// Reset user
		login.obj.noUser_loginList.innerHTML = '';

		// Create all user html objects
		for(_user in allUsers)
		{
			var user = allUsers[_user];

			var li = document.createElement('li');
			li.userId = user.id;
			li.className = 'login__chooseUser';

			var name = document.createElement('h4');
			name.className = 'login__chooseUserName';
			name.innerHTML = user.name;
			li.appendChild(name);

			var id = document.createElement('h6');
			id.className = 'login__chooseUserId';
			id.innerHTML = user.id;
			li.appendChild(id);

			// Check is this a admin
			if(user.type == 'admin')
			{
				var type = document.createElement('div');
				type.className = 'login__chooseUserType';
				type.innerHTML = user.type;
				li.appendChild(type);
			}

			// Print
			login.obj.noUser_loginList.appendChild(li);

			// Add to array
			allObj.push(li);

			// Add event
			li.addEventListener('click', function()
			{
				// Save no current user
				class_user.saveCurrentUser(this.userId);

				// Show login user box
				showLoginUserBox(this.userId);

				// Show user change button
				showLoginChangeButton();
			});
		}

		// FadeIn
		var delaytimer = 200;
		for(_obj in allObj)
		{
			(function(timer)
			{
				var obj = this;

				setTimeout(function()
				{
					// Add class for css animation
					obj.className += ' login__chooseUser--active';
				}, timer);

			}).call(allObj[_obj], delaytimer);

			delaytimer = delaytimer + 100;
		}




	}


	/**
	 *	Show login user
	 */
	function showLoginUserBox(_user)
	{
		var allUsers = class_user.getAllUsers();
		login.currentUser = allUsers[_user];

		// Print user name
		login.obj.show_name.innerHTML = login.currentUser.name;

		// Reset all login areas
		login.obj.showbox_password.className 	= login.obj.showbox_password.className.replace(' login__area--active', '');
		login.obj.showbox_button.className 		= login.obj.showbox_button.className.replace(' login__area--active', '');

		// Check have this user a password
		if(login.currentUser.pwd)
		{
			login.obj.showbox_password.className += ' login__area--active';
			login.obj.showbox_password_input.select();
		}

		// Check have user no password
		else
		{
			login.obj.showbox_button.className += ' login__area--active';
		}

		// Show login box
		login.obj.loginbox_noAccount.className = login.obj.loginbox_noAccount.className.replace(' login__box--active', '');
		login.obj.loginbox_withAccount.className += ' login__box--active';
	}


	/**
	 *	Show all users
	 */
	function showAllUsersBox()
	{
		login.obj.loginbox_withAccount.className = login.obj.loginbox_withAccount.className.replace(' login__box--active', '');
		login.obj.loginbox_noAccount.className += ' login__box--active';

		printAllUsers();
	}


	/**
	 *	Show user change button
	 */
	function showLoginChangeButton()
	{
		// Check how many account exits
		if(class_user.getUserLength() > 1)
		{
			login.obj.showbox_changeUser.className += ' login__changeUser--active';
		}
		else {
			login.obj.showbox_changeUser.className = login.obj.showbox_changeUser.className.replace(' login__changeUser--active', '');
		}
	}





}).call(this);
