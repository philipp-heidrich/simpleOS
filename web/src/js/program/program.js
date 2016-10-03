(function()
{
	this.program = {
		AUTHOR: 'Philipp Heidrich'
	}

	program.list 		= {};
	program.selected	= false;
	program.counter 	= 10;
	program.idCounter 	= 0;




	/**
	 *
	 *	Boot functions
	 *
	 */

	 /**
 	 *	Start login boot
 	 */
 	program.boot = function()
 	{
 		// Show message
 		boot.printBootMessage('Load program');

		// Lade HTML
		boot.printBootMessage('&#10142; load objects');

		program.obj = {
			programArea: document.querySelectorAll('.desktop__programs')
 		}

		boot.printBootMessage('<br>');

		// Add Events
		addEvents();
 	}


	/**
	 *	Start program
	 */
	program.startWindow = function(id, title)
	{
		var o = {};

		// Set new id
		program.idCounter++;
		o.id_counter = program.idCounter;
		o.id_program = id;
		o.title = title;

		// Add window
		createWindow(o);

		// Add taskmanager
		taskline.createTaskProgram(o);

		// Set new position
		// Check if is a selected window
		if(program.selected)
		{
			var obj = program.list[program.selected],
				pos_x = obj.layer.offsetLeft,
				pos_y = obj.layer.offsetTop;

			setNewWindowPosition(o.layer, pos_x, pos_y);
		}

		// Check if is a window found
		else if(
			program.idCounter - 1 &&
			program.list[program.idCounter - 1] &&
			!program.list[program.idCounter - 1].minimized
		)
		{
			var obj = program.list[program.idCounter - 1],
				pos_x = obj.layer.offsetLeft,
				pos_y = obj.layer.offsetTop;

			setNewWindowPosition(o.layer, pos_x, pos_y);
		}

		// Add this object to global array
		program.list[o.id_counter] = o;

		// Time delay
		setTimeout(function()
		{
			// Add program to desktop
			desktop.obj.program.appendChild(o.layer);

			// Set to selected
			program.setSelection(o.id_counter);
		}, 100);
	}






	/**
	 *
	 *	Public functions
	 *
	 */

	 /**
 	 *	Get current selected window
 	 */
 	program.getSelectedWindow = function()
 	{
 		if(program.selected)
 		{
 			return program.list[program.selected];
 		}
 		else {
 			return false;
 		}
 	}


 	/**
 	 *	Close window
 	 */
 	program.removeWindow = function(id)
 	{
 		var _layer = program.list[id].layer,
 			_task = program.list[id].taskProgram;

 		// Remove selection
 		if(program.selected == id)
 		{
 			program.selected = false;
 		}

 		// Remove html object
 		_layer.parentNode.removeChild(_layer);
 		_task.parentNode.removeChild(_task);

 		// Remove object
 		delete program.list[id];
 	}


 	/**
 	 *	Minimize window
 	 */
 	program.minimizeWindow = function(id)
 	{
 		var o = program.list[id];
 		var _layer = o.layer;

 		// Edit object
 		o.isMinimized = true;

 		// Remove selection
 		program.removeSelection();

 		// Edit HTML
 		_layer.className += ' program--minimized';
 	}


 	/**
 	 *	Reminimize window
 	 */
 	program.reminizedWindow = function(id)
 	{
 		var o = program.list[id];
 		var _layer = o.layer;

 		// Edit object
 		o.isMinimized = false;

 		// Remove selection
 		program.setSelection(id);

 		// Edit HTML
 		_layer.className = _layer.className.replace(' program--minimized', ' program--reminimized');

 		// Delete reminimized class
 		setTimeout(function()
 		{
 			_layer.className = _layer.className.replace(' program--reminimized', '');
 		}, 550);
 	}


 	/**
 	 *	Remove selection
 	 */
 	program.removeSelection = function()
 	{
 		if(program.selected)
 		{
 			var o 			= program.list[program.selected],
 				_layer 		= o.layer,
 				_task 		= o.taskProgram;

 			// Edit object
 			o.isSelected = false;

 			// Remove selection class
 			_layer.className = _layer.className.replace(' program--selected', '');
 			_task.className = _task.className.replace(' taskline__program--selected', '');

 			// Remove selection
 			program.selected = false;
 		}
 	}


 	/**
 	 *	Set selection
 	 */
 	program.setSelection = function(selectNr)
 	{
 		if(
 			program.list[selectNr] &&
 			selectNr !== program.selected
 		)
 		{
 			var o 			= program.list[selectNr],
 				_layer 		= o.layer,
 				_task 		= o.taskProgram;

 			// Delete selections
 			program.removeSelection();

 			// Edit object
 			o.isSelected = true;

 			// Set new z-index
 			program.counter++;
 			_layer.style.zIndex = program.counter;

 			// Set selection class
 			_layer.className += ' program--selected';
 			_task.className += ' taskline__program--selected';

 			// Set global selection
 			program.selected = selectNr;
 		}
 	}


	/**
	 *	Maximize window to the screen size
	 */
	program.maximizeWindow = function(id)
	{
		var o = program.list[id];

		if(!o.isMaximize)
		{
			// Set is variable to true
			o.isMaximize = true;

			// Save current window size
			o.windowsSize = {
				x: o.layer.offsetWidth,
				y: o.layer.offsetHeight
			}

			// Save window position
			o.windowPos = {
				x: o.layer.offsetLeft,
				y: o.layer.offsetTop
			}

			o.layer.className += ' program--maximize';
		}
	}


	/**
	 *	Reduce window size to the original window size
	 */
	program.reduceWindow = function(id)
	{
		var o = program.list[id],
			oldWindowsSize = o.windowsSize,
			oldWindowsPos = o.windowPos;

		if(o.isMaximize)
		{
			o.isMaximize = false;

			// Delete class
			o.layer.className = o.layer.className.replace(' program--maximize', '');

			// Set new position
			if(oldWindowsPos)
			{
				o.layer.style.left = oldWindowsPos.x;
				o.layer.style.top = oldWindowsPos.y;
			}


			// Set new size
			if(oldWindowsSize)
			{
				o.layer.style.width = oldWindowsPos.x;
				o.layer.style.height = oldWindowsPos.y;
			}
		}
	}







	/**
	 *
	 *	Private functions
	 *
	 */

	/**
	 *	Add a new window
	 */
	function createWindow(o)
	{
		var tmpl = document.querySelector('#programs [program="' + o.id_program + '"]');

		o.layer = document.createElement('div');
		o.layer.program_id = o.id_counter;
		o.layer.setAttribute('data-program-id', o.id_counter);
		o.layer.className = 'program';

		// Header
		o.header = document.createElement('div');
		o.header.className = 'program__header';
		o.layer.appendChild(o.header);

		o.headerTitle = document.createElement('div');
		o.headerTitle.className = 'program__title';
		o.headerTitle.innerHTML = o.title;
		o.headerTitle.ondblclick = function()
		{
			// Disabled global click event
			program.disableClickEvent = true;

			if(o.isMaximize)
			{
				program.reduceWindow(o.id_counter);
			}
			else {
				program.maximizeWindow(o.id_counter);
			}
		}
		o.header.appendChild(o.headerTitle);

		o.headerRight = document.createElement('div');
		o.headerRight.className = 'program__headerRight';
		o.header.appendChild(o.headerRight);

		// Minimze Btn
		o.headerMinimize = document.createElement('div');
		o.headerMinimize.className = 'program__headerBtn program__headerBtn--mini';
		o.headerMinimize.onclick = function()
		{
			// Disabled global click event
			program.disableClickEvent = true;

			taskline.minimizeWindow(o.id_counter);
			program.minimizeWindow(o.id_counter);
		}
		o.headerRight.appendChild(o.headerMinimize);
		o.headerMinimize.appendChild(createFontIcon('remove'));

		// Max-min Btn
		o.headerMaxMinimize = document.createElement('div');
		o.headerMaxMinimize.className = 'program__headerBtn program__headerBtn--maxminmize';
		o.headerMaxMinimize.onclick = function()
		{
			// Disabled global click event
			program.disableClickEvent = true;

			if(o.isMaximize)
			{
				program.reduceWindow(o.id_counter);
			}
			else {
				program.maximizeWindow(o.id_counter);
			}
		}
		o.headerRight.appendChild(o.headerMaxMinimize);
		o.headerMaxMinimize.appendChild(createFontIcon('crop_5_4', 'goToBig'));
		o.headerMaxMinimize.appendChild(createFontIcon('filter_none', 'goToSmall'));

		// Close Btn
		o.headerClose = document.createElement('div');
		o.headerClose.className = 'program__headerBtn program__headerBtn--close';
		o.headerClose.onclick = function()
		{
			// Disabled global click event
			program.disableClickEvent = true;

			program.removeWindow(o.id_counter);
		}
		o.headerRight.appendChild(o.headerClose);
		o.headerClose.appendChild(createFontIcon('close'));

		// Content
		o.content = tmpl.cloneNode(true);
		o.content.className = 'program__content';
		o.layer.appendChild(o.content);
	}


	/**
	 *	Add Events
	 */
	function addEvents()
	{
		// Globaler Click event
		document.addEventListener('click', function(event)
		{
			if(program.disableClickEvent)
			{
				program.disableClickEvent = false;
			}
			else
			{
				var parentProgram = hasParent('.program', event.target, true);

				// Check if this a child from a program
				if(
					!parentProgram ||
					parentProgram.program_id !== program.list
				)
				{
					// Remove selection
					program.removeSelection();
					taskline.removeSelection();
				}

				// Set program selection
				if(
					parentProgram &&
					parentProgram.program_id
				)
				{
					program.setSelection(parentProgram.program_id);
				}
			}
		});
	}


	/**
 	 *	Check has this element this parent
 	 */
 	function hasParent(parent, child, returnParent)
 	{
		// Loop all Parents
		function loopAllParents(node, parentArray)
		{
			for(var i = 0; i < parentArray.length; i++)
			{
				if(parentArray[i] == node)
				{
					return node;
				}
			}

			return false;
		}

 		var node = child.parentNode,
			parents = (typeof parent == 'string') ? document.querySelectorAll(parent) : parent;

        while(node != null)
 		{
			var parentFound = loopAllParents(node, parents);

			if(parentFound)
			{
				if(returnParent)
				{
					return parentFound;
				}
				else {
					return true;
				}
			}

			node = node.parentNode;
        }

        return false;
 	}


	/**
	 *	Set new window position
	 */
	function setNewWindowPosition(obj, left, top)
	{
		var distance = 25;

		// Add new position
		obj.style.left = left + distance + 'px';
		obj.style.top = top + distance + 'px';
	}


	/**
	 *	Create a google font icon
	 */
	function createFontIcon(fontType, addClass)
	{
		var iconfontObj = document.createElement('i');
		iconfontObj.className = 'material-icons';
		iconfontObj.innerHTML = fontType;

		if(addClass)
		{
			iconfontObj.className += ' ' + addClass;
		}

		return iconfontObj;
	}


}).call(this);
