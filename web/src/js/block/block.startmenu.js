(function()
{
	this.startmenu = {
		AUTHOR: 'Philipp Heidrich'
	}


	/**
	 *
	 *	Boot functions
	 *
	 */

	 /**
 	 *	Start login boot
 	 */
 	startmenu.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load startmenu');

		// Lade HTML
		boot.printBootMessage('&#10142; load objects');

		startmenu.obj = {
			startmenu_btn: document.querySelector('.taskline__start'),

			area: document.querySelector('.startmenu'),
 			programm_terminal: document.querySelector('.startmenu .js__onclickTerminal')
 		}

		boot.printBootMessage('<br>');

		// Add Events
		addEvents();
 	}







	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Open startmenu
	 */
	function openstartmenu()
	{
		if(!startmenu.status_startmenu)
		{
			startmenu.status_startmenu = true;

			startmenu.obj.area.className += ' startmenu--active';
		}
	}


	/**
	 *	Close startmenu
	 */
	function closestartmenu()
	{
		if(startmenu.status_startmenu)
		{
			startmenu.status_startmenu = false;

			startmenu.obj.area.className = startmenu.obj.area.className.replace(' startmenu--active', '');
		}
	}


	/**
	 *	Add events
	 */
	function addEvents()
	{
		// Global click event
		document.addEventListener('click', function(event)
		{
			var obj = event.target;

			if(
				hasParent('.taskline__start', obj) &&
				!startmenu.status_startmenu
			)
			{
				openstartmenu();
			}

			else if(
				!hasParent('.startmenu', obj) &&
				startmenu.status_startmenu
			)
			{
				closestartmenu();
			}
		});

		// Click event: terminal program
		startmenu.obj.programm_terminal.addEventListener('click', function()
		{
			// Close start menu
			closestartmenu();

			// Open terminal
			new program_terminal.init();
		});
	}


	/**
	 *	Check has this element this parent
	 */
	function hasParent(parent, child)
	{
		var node 	= child.parentNode,
			parent 	= document.querySelector(parent);

        while(node != null)
		{
            if(node == parent)
			{
                return true;
            }

            node = node.parentNode;
        }

        return false;
	}


}).call(this);
