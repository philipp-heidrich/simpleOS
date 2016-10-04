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

		// Disalbe global click event
		program.disableClickEvent = true;

		// Add this object to global array
		program.list[o.id_counter] = o;

		// Add program to desktop
		desktop.obj.program.appendChild(o.layer);

		// Set new z-index
		program.counter++;
		o.layer.style.zIndex = program.counter;

		// Set to selected
		program.setSelection(o.id_counter);

		return o;
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
		_layer.className = _layer.className.replace(' program--maximize', '');
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

		if(o.isMaximize)
		{
			_layer.className += ' program--maximize';
		}

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

			// Run all extern maximize functions
			for(var i = 0; i < o.pushMaximizedArray.length; i++)
			{
				o.pushMaximizedArray[i]();
			}
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

			// Run all extern reduce functions
			for(var i = 0; i < o.pushReduceArray.length; i++)
			{
				o.pushReduceArray[i]();
			}
		}
	}


	/**
	 *	Push window resize function
	 */
	program.pushResizeFunction = function(id, func)
	{
		var o = program.list[id];

		if(!o.pushResizeArray)
		{
			o.pushResizeArray = [];
		}

		o.pushResizeArray.push(func);
	}


	/**
	 *	Push window maximized function
	 */
	program.pushMaximizedFunction = function(id, func)
	{
		var o = program.list[id];

		if(!o.pushMaximizedArray)
		{
			o.pushMaximizedArray = [];
		}

		o.pushMaximizedArray.push(func);
	}


	/**
	 *	Push window maximized function
	 */
	program.pushReduceFunction = function(id, func)
	{
		var o = program.list[id];

		if(!o.pushReduceArray)
		{
			o.pushReduceArray = [];
		}

		o.pushReduceArray.push(func);
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

		o.resizeArea = document.createElement('div');
		o.resizeArea.className = 'program__resizeArea';
		o.layer.appendChild(o.resizeArea);

		// Resize - top
		createResizeDiv('top', o);
		createResizeDiv('right', o);
		createResizeDiv('bottom', o);
		createResizeDiv('left', o);
		createResizeDiv('rightTop', o);
		createResizeDiv('rightBottom', o);
		createResizeDiv('leftBottom', o);
		createResizeDiv('leftTop', o);

		// Header
		o.header = document.createElement('div');
		o.header.className = 'program__header';
		o.layer.appendChild(o.header);

		// Header - move
		o.headerMove = document.createElement('div');
		o.headerMove.className = 'program__move';
		o.headerMove.onmousedown = function(event)
		{
			// Disabled global click event
			program.disableClickEvent = true;
			startWindowMovment(event, o.id_counter);
		}
		o.headerMove.ondblclick = function()
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
		o.header.appendChild(o.headerMove);

		// Header - title
		o.headerTitle = document.createElement('div');
		o.headerTitle.className = 'program__title';
		o.headerTitle.innerHTML = o.title;
		o.header.appendChild(o.headerTitle);

		o.headerRight = document.createElement('div');
		o.headerRight.className = 'program__headerRight';
		o.header.appendChild(o.headerRight);

		// Header - Minimze Btn
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

		// Header - Max-min Btn
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
		o.headerMaxMinimize.appendChild(createFontIcon('crop_5_4'));

		// Header - Close Btn
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
		o.content.className = 'program__content ' + o.id_program;
		o.layer.appendChild(o.content);
	}


	/**
	 *	Add Events
	 */
	function addEvents()
	{
		// Global click event
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


		// Global mousemove event
		window.addEventListener('mousemove', function(event)
		{
			moveWindowMovment(event);
			moveWindowResize(event);
		});

		// Global mouseup event
		window.addEventListener('mouseup', function(event)
		{
			stopWindowMovment(event),
			stopWindowResize(event);
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


	/**
	 *	Create resize div
	 */
	function createResizeDiv(type, o)
	{
		var id = 'changeSize_' + type;

		o[id] = document.createElement('div');
		o[id].className = 'program__changeSize';
		o[id].setAttribute('data-position', type);
		o[id].onmousedown = function(event)
		{
			// Disabled global click event
			program.disableClickEvent = true;

			// Start resize window size
			startWindowResize(event, o.id_counter, type);
		}
		o.resizeArea.appendChild(o[id]);
	}


	/**
	 *	Start window movement
	 */
	function startWindowMovment(event, id)
	{
		var o = program.list[id];

		// If the window not maximized
		if(
			!o.isMovment &&
			!o.isMaximize
		)
		{
			// Set new selection
			program.setSelection(id);

			// Set global movment variable
			program.isMovment = id;

			// Set is movment to true
			o.isMovment = true;

			// Set start momvment variable
			o.moveStartClient = {
				x: event.clientX,
				y: event.clientY
			}

			// Set start momvment variable
			o.moveStartObj = {
				x: o.layer.offsetLeft,
				y: o.layer.offsetTop,
				w: o.layer.offsetWidth,
				h: o.layer.offsetHeight
			}
		}
	}


	/**
	 *	Move window movment
	 */
	function moveWindowMovment(event)
	{
		var id = program.isMovment;

		// Check if this on movment
		if(
			id &&
			program.list[id] &&
			program.list[id].isMovment
		)
		{
			var o 				= program.list[id],
				startMove 		= o.moveStart,
				moveDistanceX	= event.clientX - o.moveStartClient.x,
				moveDistanceY	= event.clientY - o.moveStartClient.y,
				moveStartX 		= o.moveStartObj.x,
				moveStartY 		= o.moveStartObj.y;

			var left 	= moveStartX + moveDistanceX,
				top 	= moveStartY + moveDistanceY,
				width 	= o.moveStartObj.w,
				height 	= o.moveStartObj.h;

			// Check is the window outside from the browser x
			if(left < 0)
			{
				setWindowPosition(0, null, o.layer);
			}
			else if(window.innerWidth < left + width)
			{
				setWindowPosition(window.innerWidth - width, null, o.layer);
			}
			else
			{
				setWindowPosition(o.moveStartObj.x + moveDistanceX, null, o.layer);
			}

			// Check is the window outside from the browser y
			if(top < 0)
			{
				setWindowPosition(null, 0, o.layer);
			}
			else if(window.innerHeight < top + height)
			{
				setWindowPosition(null, window.innerHeight - height, o.layer);
			}
			else
			{
				setWindowPosition(null, o.moveStartObj.y + moveDistanceY, o.layer);
			}
		}
	}


	/**
	 *	Stop window movment
	 */
	function stopWindowMovment(event)
	{
		var id = program.isMovment;

		// Check if this on movment
		if(
			id &&
			program.list[id] &&
			program.list[id].isMovment
		)
		{
			var o = program.list[id];

			// Reset object variable
			o.isMovment = false;

			// Reset globale variable
			program.isMovment = false;
		}
	}


	/**
	 *	Start the resize window
	 */
	function startWindowResize(event, id, type)
	{
		var o = program.list[id];

		// If the window not maximized
		if(
			!o.isResize &&
			!o.isMaximize
		)
		{
			// Set new selection
			program.setSelection(id);

			// Set global movment variable
			program.isResize = id;

			// Set is movment to true
			o.isResize = true;
			o.resizeType = type;

			// Set start momvment variable
			o.moveStart = {
				x: event.clientX,
				y: event.clientY,
				w: o.layer.offsetWidth,
				h: o.layer.offsetHeight
			}
		}
	}


	/**
	 *	Move resize window
	 */
	function moveWindowResize(event)
	{
		var id = program.isResize;

		if(
			id &&
			program.list[id] &&
			program.list[id].isResize
		)
		{
			var o = program.list[id],
				type = o.resizeType,
				moveDistanceX = event.clientX - o.moveStart.x,
				moveDistanceY = event.clientY - o.moveStart.y;

			var moveStartX = o.moveStart.x,
				moveStartY = o.moveStart.y,
				moveStartW = o.moveStart.w,
				moveStartH = o.moveStart.h,
				width = (moveStartX + moveDistanceX + moveStartW - moveDistanceX) - (moveStartX + moveDistanceX),
				height = (moveStartY + moveDistanceY + moveStartH - moveDistanceY) - (moveStartY + moveDistanceY);

			switch(type)
			{
				case 'top':
					setWindowPosition(null, moveStartY + moveDistanceY, o.layer);
					setWindowSize(null, moveStartH - moveDistanceY, o.layer);
					break;

				case 'rightTop':
					setWindowSize(moveStartW + moveDistanceX, null, o.layer);

					if(height > 100)
					{
						setWindowPosition(null, moveStartY + moveDistanceY, o.layer);
						setWindowSize(null, moveStartH - moveDistanceY, o.layer);
					}

					break;

				case 'left':
					setWindowPosition(moveStartX + moveDistanceX, null, o.layer);
					setWindowSize(moveStartW - moveDistanceX, null, o.layer);
					break;

				case 'rightBottom':
					setWindowSize(moveStartW + moveDistanceX, null, o.layer);

					if(height > 100)
					{
						setWindowSize(null, moveStartH + moveDistanceY, o.layer);
					}

					break;

				case 'right':
					setWindowSize(moveStartW + moveDistanceX, null, o.layer);
					break;

				case 'leftBottom':
					setWindowSize(null, moveStartH + moveDistanceY, o.layer);

					if(width > 180)
					{
						setWindowPosition(moveStartX + moveDistanceX, null, o.layer);
						setWindowSize(moveStartW - moveDistanceX, null, o.layer);
					}
					break;

				case 'bottom':
					setWindowSize(null, moveStartH + moveDistanceY, o.layer);
					break;

				case 'leftTop':
					if(width > 180)
					{
						setWindowPosition(moveStartX + moveDistanceX, null, o.layer);
						setWindowSize(moveStartW - moveDistanceX, null, o.layer);
					}

					if(height > 100)
					{
						setWindowPosition(null, moveStartY + moveDistanceY, o.layer);
						setWindowSize(null, moveStartH - moveDistanceY, o.layer);
					}

					break;
			}

			// Run all resize functions
			for(var i = 0; i < o.pushResizeArray.length; i++)
			{
				o.pushResizeArray[i]();
			}
		}
	}


	/**
	 *	End resize window
	 */
	function stopWindowResize(event)
	{
		var id = program.isResize;

		if(
			id &&
			program.list[id] &&
			program.list[id].isResize
		)
		{
			var o = program.list[id];

			// Set global movment variable
			program.isResize = false;

			// Set is movment to true
			o.isResize = false;
		}
	}


	/**
	 *	Set new window position
	 */
	function setWindowPosition(x, y, obj)
	{
		if(x !== null)
		{
			obj.style.left = x + 'px';
		}

		if(y !== null)
		{
			obj.style.top = y + 'px';
		}
	}


	/**
	 *	Set new window size
	 */
	function setWindowSize(x, y, obj)
	{
		if(
			x !== null &&
			x > 180
		)
		{
			obj.style.width = x + 'px';
		}

		if(
			y !== null &&
			y > 100
		)
		{
			obj.style.height = y + 'px';
		}
	}


}).call(this);
