(function()
{
	this.desktop = {
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
	desktop.init = function()
	{
		// Starte Screen
		desktop.init_showScreen();
	}


	/**
	 *	Start screen
	 */
	desktop.init_showScreen = function()
 	{
		// Change Module
		class_module.changeModule(desktop.obj.content);
 	}





	/**
	 *
	 *	Boot functions
	 *
	 */

	/**
 	 *	Start login boot
 	 */
 	desktop.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load desktop');

		// Lade HTML
		boot.printBootMessage('&#10142; load objects');
 		desktop.obj = {
 			wrapper: document.querySelector('#wrapper'),
 			content: document.querySelector('.desktop'),
			program: document.querySelector('.desktop .desktop__windows')
 		}

		boot.printBootMessage('<br>');
 	}







	/**
	 *
	 *	Private functions
	 *
	 */






}).call(this);
