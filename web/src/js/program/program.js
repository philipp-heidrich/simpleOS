(function()
{
	this.program = {
		AUTHOR: 'Philipp Heidrich'
	}

	program.list 		= {};
	program.selected	= false;
	program.counter 	= 10;
	program.id 		= 0;




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
			progObj = {};

		// Set new id
		program.id++;
		progObj.id = program.id;

		progObj.layer = document.createElement('div');
		progObj.layer.program_id = progObj.id;
		progObj.layer.setAttribute('data-program-id', progObj.id);
		progObj.layer.className = 'program program--selected';

		// Header
		progObj.header = document.createElement('div');
		progObj.header.className = 'program__header';
		progObj.layer.appendChild(progObj.header);

		progObj.headerTitle = document.createElement('div');
		progObj.headerTitle.className = 'program__title';
		progObj.headerTitle.innerHTML = title;
		progObj.header.appendChild(progObj.headerTitle);

		progObj.headerRight = document.createElement('div');
		progObj.headerRight.className = 'program__headerRight';
		progObj.header.appendChild(progObj.headerRight);

		progObj.headerClose = document.createElement('div');
		progObj.headerClose.className = 'program__headerBtn program__headerBtn--close';
		progObj.headerRight.appendChild(progObj.headerClose);

		progObj.headerCloseImg = document.createElement('i');
		progObj.headerCloseImg.className = 'material-icons';
		progObj.headerCloseImg.innerHTML = 'close';
		progObj.headerClose.appendChild(progObj.headerCloseImg);

		// Content
		progObj.content = tmpl.cloneNode(true);
		progObj.content.className = 'program__content';
		progObj.layer.appendChild(progObj.content);

		// Remove all selectets
		// TODO

		// Set to selected
		program.selected = progObj.id;

		// Set new z-index
		program.counter++;
		progObj.layer.style.zIndex = program.counter;

		// Add this object to global array
		program.list[progObj.id] = progObj;

		// Add program to desktop
		desktop.obj.program.appendChild(progObj.layer);
	}







	/**
	 *
	 *	Private functions
	 *
	 */

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


	/**
	 *	Add Events
	 */
	function addEvents()
	{
		// Globaler Click event
		document.addEventListener('click', function(event)
		{
			var target = event.target;

			// Check if this a child from a program
			if(!hasParent('.program', target))
			{
				// Remove selection
				removeSelection();
			}

			// Set program selection
			if(hasParent('.program', target))
			{
				// TODO
			}
		});
	}


}).call(this);
