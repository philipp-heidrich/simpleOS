(function()
{
	this.login = {
		AUTHOR: "Philipp Heidrich"
	}


	/**
	 *	Inital Desktop
	 */
	login.init = function()
	{
		// Starte Screen
		login.showScreen();
	}


	/**
	 *	Start login screen
	 */
	login.showScreen = function()
 	{
		// Remove hidden attribute
		boot.obj.content.className = boot.obj.content.className.replace(' content--active');

		login.obj.content.removeAttribute('hidden');
		login.obj.content.className += ' content--active';

		// Show right content
		login.showContent();

		// Fade in desktop
		setTimeout(function()
		{
			login.obj.content.className += ' login--show';
		}, 10);
 	}


	/**
	 *	Start login boot
	 */
	login.boot = function()
	{
		// Show message
		boot.printBootMessage('Load login');

		// Lade HTML
		login.obj = {
			wrapper: document.querySelector('#wrapper'),
			content: document.querySelector('.login')
		}

		login.status = {};
	}





	/**
	 *	Check login status
	 */
	login.get_loginStatus = function()
	{
		if(!login.status.account)
		{
			login.status.account = option.load('account_status');
		}

		return login.status.account;
	}


	/**
	 *	Show right content
	 */
	login.showContent = function()
	{
		// // Register Content
		// if(login.get_loginStatus() == 'register')
		// {
		// 	login.obj.box_register.className += ' login__box--active';
		// }
	}




}).call(this);
