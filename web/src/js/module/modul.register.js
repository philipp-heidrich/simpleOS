(function()
{
	this.register = {
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
	register.init = function()
	{
		// Starte Screen
		init_showScreen();

		// Add events
		init_addEvents();
	}


	/**
	 *	Start login screen
	 */
	function init_showScreen()
 	{
		// Change Module
		class_module.changeModule(register.obj.content);
 	}


	/**
	 *	Add event listener to objects
	 */
	function init_addEvents()
	{
		// Submit form
		register.obj.form.addEventListener('submit', function(event)
		{
			event.preventDefault();
			return false;
		});

		// Username input
		register.obj.input_name.addEventListener('keyup', function(event)
		{
			register.obj.input_pcName.value = convertPCname(register.obj.input_name.value);
		});

		// Next Button
		register.obj.button_fin.addEventListener('click', function(event)
		{
			if(
				createFirstUser() &&
				createOSSettings()
			)
			{
				goLoginSite();
			}
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
	register.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load register');

 		// Lade HTML
		boot.printBootMessage('&#10142; load objects');
 		register.obj = {
 			wrapper: document.querySelector('#wrapper'),
 			content: document.querySelector('.register'),
 			form: document.querySelector('.register .register__form'),
 			input_name: document.querySelector('.register .js__inputName'),
 			input_pcName: document.querySelector('.register .js__inputPcname'),
 			input_pwd: document.querySelector('.register .js__inputPwd'),
 			input_pwdRepeat: document.querySelector('.register .js__inputPwdRepeat'),
 			button_fin: document.querySelector('.register .js__registerFin')
 		}

		boot.printBootMessage('<br>');
 	}






	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Convert pcname
	 */
	function convertPCname(name)
	{
		// Edit
		name = name.replace(/ /gi, '.');
		name = name.replace(/[^a-zA-Z0-9\.]/g, '');
		name = name.toLowerCase();

		return name;
	}


	/**
	 *	Create first user
	 **/
	function createFirstUser()
	{
		var name 	= register.obj.input_name.value,
			pwd 	= register.obj.input_pwd.value,
			id 		= convertPCname(register.obj.input_name.value);

		// Check is this the same pwd
		if(
			(register.obj.input_pwd.value || register.obj.input_pwdRepeat.value)
			&&
			(register.obj.input_pwd.value !== register.obj.input_pwdRepeat.value)
		)
		{
			new msg.init({
				content: {
					txt: "Not the same passwords"
				}
			});

			return false;
		}

		// Create new user
		var newUser = class_user.createNewUser(name, id, pwd, 'admin');
		if(newUser)
		{
			// Save last login user
			class_user.saveCurrentUser(id);

			return true;
		}
		else
		{
			new msg.init({
				content: {
					txt: "Please fill all fields"
				}
			});

			return false;
		}
	}


	/**
	 *	Create os settings
	 */
	function createOSSettings()
	{
		var pcname = convertPCname(register.obj.input_pcName.value);

		// Save first pc visit
		os.saveFirstPcVisit();

		// Save PC name
		os.savePcName(pcname);

		return true;
	}


	/**
	 *	Go to login site
	 */
	function goLoginSite()
	{
		// Go to login screen
		login.init();
	}


}).call(this);
