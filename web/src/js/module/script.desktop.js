(function()
{
	this.desktop = {
		AUTHOR: "Philipp Heidrich"
	}


	/**
	 *	Inital Desktop
	 */
	desktop.init = function()
	{
		// Starte Screen
		desktop.showScreen();
	}


	/**
	 *	Start screen
	 */
	desktop.showScreen = function()
 	{
		var hiddenContent = document.querySelector('.hiddenModule .hidden_desktop');

		// Clone Desktop
		desktop.obj = hiddenContent.cloneNode(true);

		// Replace class
		desktop.obj.className = desktop.obj.className.replace('hidden_', '');

		// Put element into wrapper
		document.querySelector('#wrapper').appendChild(desktop.obj);

		// Fade in desktop
		setTimeout(function()
		{
			desktop.obj.className += ' desktop--show';
		}, 10);
 	}




}).call(this);
