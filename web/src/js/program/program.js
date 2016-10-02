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
		createTaskProgram(o);

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
			setSelection(o.id_counter);
		}, 100);
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
		// Create a google font icon
		function createFontIcon(fontType)
		{
			o.headerCloseImg = document.createElement('i');
			o.headerCloseImg.className = 'material-icons';
			o.headerCloseImg.innerHTML = fontType;

			return o.headerCloseImg;
		}


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

			minimizeWindow(o.id_counter);
		}
		o.headerRight.appendChild(o.headerMinimize);
		o.headerMinimize.appendChild(createFontIcon('remove'));

		// Close Btn
		o.headerClose = document.createElement('div');
		o.headerClose.className = 'program__headerBtn program__headerBtn--close';
		o.headerClose.onclick = function()
		{
			// Disabled global click event
			program.disableClickEvent = true;

			removeWindow(o.id_counter);
		}
		o.headerRight.appendChild(o.headerClose);
		o.headerClose.appendChild(createFontIcon('close'));

		// Content
		o.content = tmpl.cloneNode(true);
		o.content.className = 'program__content';
		o.layer.appendChild(o.content);
	}

	/**
 	 *	Add a new program to taskline
 	 */
 	function createTaskProgram(o)
 	{
 		o.taskProgram = document.createElement('li');
 		o.taskProgram.program_id = o.id_counter;
		o.taskProgram.onclick = function(event)
		{
			program.disableClickEvent = true;

			// Check is this minimized
			if(o.isMinimized)
			{
				reminizedWindow(o.id_counter);
			}

			// Check ist selected
			else if(o.isSelected)
			{
				minimizeWindow(o.id_counter);
			}

			// Set a new selection
			else {
				// Set new selection
				setSelection(o.id_counter);
			}
		}
 		o.taskProgram.className = 'taskline__program';

 		// Value
 		o.taskName = document.createElement('div');
 		o.taskName.className = 'taskline__programTxt';
 		o.taskName.innerHTML = o.title;
 		o.taskProgram.appendChild(o.taskName);

		// Taskmenu
		o.taskMenu = document.createElement('div');
		o.taskMenu.className = 'taskline__programMenu';
		o.taskProgram.appendChild(o.taskMenu);

		o.taskMenuClose = document.createElement('div');
		o.taskMenuClose.className = 'taskline__programMenuBtn taskline__programMenuBtn--close';
		o.taskMenuClose.onclick = function()
		{
			removeWindow(o.id_counter);
		}
		o.taskMenu.appendChild(o.taskMenuClose);

		o.taskMenuCloseIcon = document.createElement('i');
		o.taskMenuCloseIcon.className = 'material-icons';
		o.taskMenuCloseIcon.innerHTML = 'close';
		o.taskMenuClose.appendChild(o.taskMenuCloseIcon);

 		// Output
 		taskline.obj.program_open.appendChild(o.taskProgram);
 	}


	/**
	 *	Get current selected window
	 */
	function getSelectedWindow()
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
	function removeWindow(id)
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
	function minimizeWindow(id)
	{
		var o = program.list[id];
		var _layer = o.layer;

		// Edit object
		o.isMinimized = true;

		// Remove selection
		removeSelection();

		// Edit HTML
		_layer.className += ' program--minimized';
	}


	/**
	 *	Reminimize window
	 */
	function reminizedWindow(id)
	{
		var o = program.list[id];
		var _layer = o.layer;

		// Edit object
		o.isMinimized = false;

		// Remove selection
		setSelection(id);

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
	function removeSelection()
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
	function setSelection(selectNr)
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
			removeSelection();

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
					removeSelection();
				}

				// Set program selection
				if(
					parentProgram &&
					parentProgram.program_id
				)
				{
					setSelection(parentProgram.program_id);
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


}).call(this);
