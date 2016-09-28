(function()
{
	this.class_user = {
		AUTHOR: 'Philipp Heidrich'
	}


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

		var newUser = {
			id: id,
			name: name,
			type: type
		}

		// Hash pwd
		if(pwd)
		{
			newUser.pwd = class_user.hashpwd(pwd);
		}

		// Load account array
		var allAccounts = option.load('account_users');

		// Add new user to array
		allAccounts.push(newUser);

		// Save new account array
		option.save('account_users', allAccounts);

		return true;
	}


	/**
	 *	Hash password
	 */
	class_user.hashpwd = function(pwd)
	{
		var hash = 0;

		if(pwd.length == 0)
		{
			return hash;
		}

		for (i = 0; i < pwd.length; i++)
		{
			char = pwd.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}

		return hash;
	}




}).call(this);
