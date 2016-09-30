(function()
{
	this.class_user = {
		AUTHOR: 'Philipp Heidrich'
	}



	/**
	 *	Public functons
	 */

	/**
	 *	Create new user
	 */
	class_user.createNewUser = function(name, id, pwd, type)
	{
		// Check is valid name
		if(!name || !name.length)
		{
			return;
		}

		// Check user type
		if(!type || !type.match(/[admin|user]/g))
		{
			return;
		}

		var userObj = {
			id: id,
			name: name,
			type: type,
			pwd: false
		}

		// Hash pwd
		if(pwd)
		{
			userObj = hashpwd(pwd);
		}

		// Load account array
		var allAccounts = option.load('account_users');

		// Add new user to array
		allAccounts[id] = userObj;

		// Save new account array
		option.save('account_users', allAccounts);

		return true;
	}


	/**
	 *	Get all pc users
	 */
	class_user.getAllUsers = function()
	{
		return option.load('account_users');
	}


	/**
	 *	Get length of users
	 */
	class_user.getUserLength = function()
	{
		var users = option.load('account_users');
		return users.length;
	}


	/**
	 *	Get last login user
	 */
	class_user.getCurrentUser = function()
	{
		var lastlogin = option.load('account_currentUser');
		return lastlogin;
	}


	/**
	 *	Save last login user
	 */
	class_user.saveCurrentUser = function(userId)
	{
		option.save('account_currentUser', userId);
	}


	/**
	 *	Check right pwd
	 */
	class_user.checkPwd = function(pwd, pwdhash)
	{
		var newPwdHash = hashpwd(pwd);

		if(newPwdHash == pwdhash)
		{
			return true;
		}
		else
		{
			return false;
		}
	}






	/**
	 *	Private functions
	 */

	/**
	 *	Hash password
	 */
	function hashpwd(pwd)
	{
		var hash = 0;

		if(pwd.length == 0)
		{
			return hash;
		}

		for(i = 0; i < pwd.length; i++)
		{
			char = pwd.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}

		return hash;
	}


}).call(this);
