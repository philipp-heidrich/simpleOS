(function()
{
	this.startobj = {
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
 	startobj.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load startobj');

		// Lade HTML
		boot.printBootMessage('&#10142; load objects');

		startobj.obj = {
			startobj_btn: document.querySelector('.taskline__start'),

			area: document.querySelector('.startobj'),
 			programm_terminal: document.querySelector('.startobj .js__onclickTerminal')
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
	 *	Open startobj
	 */
	function openStartobj()
	{
		if(!startobj.status_startobj)
		{
			startobj.status_startobj = true;

			startobj.obj.area.className += ' startobj--active';
		}
	}


	/**
	 *	Close startobj
	 */
	function closeStartObj()
	{
		if(startobj.status_startobj)
		{
			startobj.status_startobj = false;

			startobj.obj.area.className = startobj.obj.area.className.replace(' startobj--active', '');
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
				!startobj.status_startobj
			)
			{
				openStartobj();
			}

			else if(
				!hasParent('.startobj', obj) &&
				startobj.status_startobj
			)
			{
				closeStartObj();
			}
		});

		// Click event: terminal program
		startobj.obj.programm_terminal.addEventListener('click', function()
		{
			// Close start menu
			closeStartObj();

			// Open terminal
			new terminal.init();
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
