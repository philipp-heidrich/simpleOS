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
		register.init_showScreen();

		// Add events
		register.init_addEvents();
	}


	/**
	 *	Start login screen
	 */
	register.init_showScreen = function()
 	{
		// Change Module
		class_module.changeModule(register.obj.content);
 	}


	/**
	 *	Add event listener to objects
	 */
	register.init_addEvents = function()
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
			convertPCname();
		});

		// Next Button
		register.obj.button_fin.addEventListener('click', function(event)
		{
			createFirstUser();
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
 			input_id: document.querySelector('.register .js__inputId'),
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
	function convertPCname()
	{
		var name = register.obj.input_name.value;

		// Edit
		name = name.replace(/ /gi, '.');
		name = name.replace(/[^a-zA-Z0-9\.]/g, '');
		name = name.toLowerCase();

		// Set new pc name
		register.obj.input_pcName.value = name;
		register.obj.input_id.value = name;
	}


	/**
	 *	Create first user
	 **/
	function createFirstUser()
	{
		var name = register.obj.input_name.value,
			id = register.obj.input_id.value,
			pwd = register.obj.input_pwd.value,
			pcname = register.obj.input_pcName.value;

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

			return;
		}

		// Check if a pwd entry
		if(!pwd.length)
		{
			pwd = false;
		}

		// Create new user
		var newUser = class_user.createNewUser(name, pcname, pwd, 'admin');
		if(newUser)
		{
			// Go to login
			goLoginSite(pcname);
		}
		else
		{
			new msg.init({
				content: {
					txt: "Please fill all fields"
				}
			});
		}
	}


	/**
	 *	Go to login site
	 */
	function goLoginSite(pcname)
	{
		// Save first pc visit
		os.saveFirstPcVisit();

		// Save PC name
		os.savePcName(pcname);

		// Save last login user
		class_user.saveCurrentUser(pcname);

		// Go to login screen
		login.init();
	}


}).call(this);
