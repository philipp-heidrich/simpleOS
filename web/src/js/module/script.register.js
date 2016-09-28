(function()
{
	this.register = {
		AUTHOR: "Philipp Heidrich"
	}


	/**
	 *	Inital Desktop
	 */
	register.init = function()
	{
		// Starte Screen
		register.showScreen();
	}


	/**
	 *	Start login screen
	 */
	register.showScreen = function()
 	{
		// Add events
		register.addEvents();

		// Remove boot content
		boot.obj.content.className = boot.obj.content.className.replace(' content--active', '');

		// Show register content
		register.obj.content.removeAttribute('hidden');
		register.obj.content.className += ' content--active';

		// Fade in desktop
		setTimeout(function()
		{
			register.obj.content.className += ' register--show';
		}, 10);
 	}


	/**
	 *	Start login boot
	 */
	register.boot = function()
	{
		// Show message
		boot.printBootMessage('Load register');

		// Lade HTML
		register.obj = {
			wrapper: document.querySelector('#wrapper'),
			content: document.querySelector('.register'),
			form: document.querySelector('.register .register__form'),
			input_userName: document.querySelector('.register .js_inputName'),
			input_pcName: document.querySelector('.register .js_inputPcname'),
			input_pwd: document.querySelector('.register .js_inputPwd'),
			input_pwdRepeat: document.querySelector('.register .js_inputPwdRepeat'),
			button_fin: document.querySelector('.register .js_registerFin')
		}
	}


	/**
	 *	Convert pcname
	 */
	register.convertPCname = function()
	{
		var name = register.obj.input_userName.value;

		// Edit
		name = name.replace(/ /gi, '.');
		name = name.replace(/[^a-zA-Z0-9\.]/g, '');
		name = name.toLowerCase();

		// Set new pc name
		register.obj.input_pcName.value = name;
	}


	/**
	 *	Create first user
	 **/
	register.createFirstUser = function()
	{
		var name = register.obj.input_userName.value,
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
			// Save pc name
			option.save('os_name', pcname);

			// Save complete first visit
			option.save('os_firstVisit', true);

			// Go to login screen
			login.init();
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
	 *	Add event listener to objects
	 */
	register.addEvents = function()
	{
		// Submit form
		register.obj.form.addEventListener('submit', function(event)
		{
			event.preventDefault();
			return false;
		});

		// Username input
		register.obj.input_userName.addEventListener('keyup', function(event)
		{
			register.convertPCname();
		});

		// Next Button
		register.obj.button_fin.addEventListener('click', function(event)
		{
			register.createFirstUser();
		});
	}

}).call(this);
