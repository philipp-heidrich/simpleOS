(function()
{
	this.program = {
		AUTHOR: 'Philipp Heidrich'
	}

	program.list 		= {};
	program.selected	= false;
	program.counter 	= 10;
	program.id 			= 0;




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
	program.start = function(id, title)
	{
		var tmpl 	= document.querySelector('#programs [program="' + id + '"]'),
			o 		= {};

		// Set new id
		program.id++;
		o.id = program.id;

		o.layer = document.createElement('div');
		o.layer.program_id = o.id;
		o.layer.setAttribute('data-program-id', o.id);
		o.layer.className = 'program';

		// Header
		o.header = document.createElement('div');
		o.header.className = 'program__header';
		o.layer.appendChild(o.header);

		o.headerTitle = document.createElement('div');
		o.headerTitle.className = 'program__title';
		o.headerTitle.innerHTML = title;
		o.header.appendChild(o.headerTitle);

		o.headerRight = document.createElement('div');
		o.headerRight.className = 'program__headerRight';
		o.header.appendChild(o.headerRight);

		// Close Btn
		o.headerClose = document.createElement('div');
		o.headerClose.className = 'program__headerBtn program__headerBtn--close';
		o.headerClose.onclick = function()
		{
			removeWindow(o.layer);
		}
		o.headerRight.appendChild(o.headerClose);

		o.headerCloseImg = document.createElement('i');
		o.headerCloseImg.className = 'material-icons';
		o.headerCloseImg.innerHTML = 'close';
		o.headerClose.appendChild(o.headerCloseImg);


		// Content
		o.content = tmpl.cloneNode(true);
		o.content.className = 'program__content';
		o.layer.appendChild(o.content);

		// Add Taskmanager
		addProgramToTaskLine(id, title, o);

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
			program.id - 1 &&
			program.list[program.id - 1]
		)
		{
			var obj = program.list[program.id - 1],
				pos_x = obj.layer.offsetLeft,
				pos_y = obj.layer.offsetTop;

			setNewWindowPosition(o.layer, pos_x, pos_y);
		}

		// Add this object to global array
		program.list[o.id] = o;

		// Time delay
		setTimeout(function()
		{
			// Add program to desktop
			desktop.obj.program.appendChild(o.layer);

			// Remove all selectets
			removeSelection();

			// Set to selected
			setSelection(o.id);
		}, 100);
	}








	/**
	 *
	 *	Private functions
	 *
	 */

	/**
 	 *	Add a new program to taskline
 	 */
 	function addProgramToTaskLine(id, title, o)
 	{
 		o.taskProgram = document.createElement('li');
 		o.taskProgram.program_id = o.id;
 		o.taskProgram.className = 'taskline__program';

 		// Value
 		o.taskName = document.createElement('div');
 		o.taskName.className = 'taskline__programTxt';
 		o.taskName.innerHTML = title;
 		o.taskProgram.appendChild(o.taskName);

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
	function removeWindow(removeLayer)
	{
		var program_id = removeLayer.program_id;

		// Remove object
		delete program.list[program_id];

		// Remove selection
		if(program.selected == program_id)
		{
			program.selected = false;
		}

		// Remove html object
		removeLayer.parentNode.removeChild(removeLayer);
	}


	/**
	 *	Remove selection
	 */
	function removeSelection()
	{
		if(program.selected)
		{
			var selection 	= program.selected,
				obj 		= program.list[program.selected].layer;

			// Remove selection class
			obj.className = obj.className.replace(' program--selected', '');

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
			var layer = program.list[selectNr].layer,
				task = program.list[selectNr].taskProgram;

			// Set new z-index
			program.counter++;
			layer.style.zIndex = program.counter;

			// Set selection class
			layer.className += ' program--selected';
			task.className += ' taskline__program--selected';

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
